const Note = ({ note, country, handleShow }) => {
  if (!handleShow) {
    return <li className="note">{note}</li>;
  }
  return (
    <li className="note">
      {note}
      <button onClick={() => handleShow(country)}>Show</button>
    </li>
  );
};

export default Note;
