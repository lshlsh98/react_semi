const Nickname = ({ member }) => {
  const activeColor = member.hexCode || "#000";
  return (
    <span
      style={{
        color: activeColor,
      }}
    >
      {member.memberId ||
        member.communityWriter ||
        member.marketWriter ||
        member.communityCommentWriter ||
        member.marketCommentWriter}
    </span>
  );
};

export default Nickname;
