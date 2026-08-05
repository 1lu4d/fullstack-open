const Note = ({ note, handleRemove }) => {
  if (!handleRemove && !note.id && !note.number) {
    return <li className="note">{note}</li>;
  }
  return (
    <li className="note">
      {note.name} {note.number}{" "}
      <button onClick={() => handleRemove(note.id, note.name)}>delete</button>
    </li>
  );
};

export default Note;
