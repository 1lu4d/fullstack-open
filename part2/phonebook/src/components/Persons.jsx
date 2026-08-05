import Note from "./Note";
const Persons = ({ peopleToShow, handleRemove }) => {
  console.log(peopleToShow);
  if (peopleToShow.length === 0) {
    return (
      <ul>
        <Note key="1" note="No entries in phonebook" />
      </ul>
    );
  }
  return (
    <ul>
      {peopleToShow.map((person) => (
        <Note key={person.id} note={person} handleRemove={handleRemove} />
      ))}
    </ul>
  );
};

export default Persons;
