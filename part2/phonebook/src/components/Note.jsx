const Note = ({ note, handleRemove }) => {
  return (
    <li className="note">
      {note.name} {note.number}{" "}
      <button onClick={() => handleRemove(note.id, note.name)}>delete</button>
    </li>
  );
};

export default Note;
