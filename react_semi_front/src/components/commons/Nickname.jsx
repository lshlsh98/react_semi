const Nickname = ({ member }) => {
  const activeColor = member.hexCode || "#000";
  return (
    <span
      style={{
        color: activeColor,
      }}
    >
      {member.memberId}
    </span>
  );
};
export default Nickname;
