import { useEffect, useRef, useState } from "react";
import styles from "./StompChatPage.module.css";
import useAuthStore from "../utils/useAuthStore";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";

const StompChatPage = () => {
  /*
    WebSocket은 랜더링과 무관한 값
    state로하면 변경될 때마다 리랜더링
    값 유지 + 랜더링 영향 없음 = useRef
  */
  const chatBoxRef = useRef(null);
  const stompClient = useRef(null);
  const subscriptionRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const senderId = useAuthStore((state) => state.memberId);
  const senderName = useAuthStore((state) => state.memberName);
  const senderThumb = useAuthStore((state) => state.memberThumb);
  const token = useAuthStore((state) => state.token);

  const { roomId } = useParams();

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/chat/history/${roomId}`)
      .then((res) => {
        setMessages(res.data);
      });

    connectWebsocket();

    // cleanup
    return () => {
      axios.post(`${import.meta.env.VITE_BACKSERVER}/chat/room/${roomId}/read`);

      subscriptionRef.current?.unsubscribe();
      stompClient.current?.deactivate();
    };
  }, [token]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const connectWebsocket = () => {
    if (stompClient.current?.active) return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_BACKSERVER}/connect`),

      reconnectDelay: 5000,

      connectHeaders: {
        Authorization: `${token}`,
      },

      onConnect: () => {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe(); // 중복 방지
        }

        subscriptionRef.current = client.subscribe(
          `/topic/${roomId}`,

          (message) => {
            let parseMessage;
            try {
              parseMessage = JSON.parse(message.body);
            } catch (e) {
              parseMessage = { message: message.body };
            }

            setMessages((prev) => [...prev, parseMessage]);
          },

          {
            Authorization: `${token}`, // subscribe 할 때도 토큰
          },
        );
      },
    });

    client.activate();
    stompClient.current = client;
  };

  const sendMessage = (e) => {
    e.preventDefault(); // form submit 기본 동작 막기

    if (
      stompClient.current &&
      stompClient.current.connected &&
      newMessage.trim() !== ""
    ) {
      const obj = {
        senderId: senderId,
        senderName: senderName,
        senderThumb: senderThumb,
        message: newMessage,
      };

      stompClient.current.publish({
        destination: `/publish/${roomId}`,
        body: JSON.stringify(obj),
      });

      setNewMessage("");
    }
  };

  return (
    <div className={styles.chat_card}>
      <h3>나중에 거래 게시글의 title 받아서 적용할 것</h3>
      <div className={styles.chat_box} ref={chatBoxRef}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`${styles.chat_message} ${m.senderId === senderId ? styles.sent : styles.received}`}
          >
            <strong>{m.senderName}: </strong> {m.message}
          </div>
        ))}
      </div>
      <form className={styles.chat_send} onSubmit={sendMessage}>
        <textarea
          className={styles.input_zone}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="채팅을 입력하세요"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(e);
            }
          }}
        />
        <div className={styles.btn_zone}>
          <button type="submit">전송</button>
        </div>
      </form>
    </div>
  );
};

export default StompChatPage;
