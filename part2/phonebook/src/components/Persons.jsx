import Note from "./Note";
const Persons = ({ peopleToShow, handleRemove }) => {
  return (
    <ul>
      {peopleToShow.map((person) => (
        <Note key={person.id} note={person} handleRemove={handleRemove} />
      ))}
    </ul>
  );
};

export default Persons;
