const Notification = ({ message, type }) => {
  if (message === null || type === "") {
    return null;
  }
  if (type == "success") {
    return <div className="success">{message}</div>;
  } else if (type == "fail") {
    return <div className="error">{message}</div>;
  }

  return null;
};

export default Notification;
