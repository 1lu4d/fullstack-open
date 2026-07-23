const PersonForm = (props) => {
  return (
    <form onSubmit={props.AddPerson}>
      <div>
        name:{" "}
        <input
          value={props.newName}
          onChange={props.handleNameChange}
          required
          type="text"
        />
      </div>
      <div>
        number:{" "}
        <input
          value={props.newNumber}
          onChange={props.handleNumberChange}
          required
          type="text"
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
