import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Note from "./components/Note";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import axios from "axios";

const Persons = (props) => {
  return (
    <ul>
      {props.peopleToShow.map((person) => (
        <Note key={person.id} note={person} />
      ))}
    </ul>
  );
};
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const peopleToShow =
    filter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase()),
        );

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  }, []);
  console.log("render", persons.length, "notes");

  const AddPerson = (event) => {
    event.preventDefault();
    if (newName.trim() === "" || newNumber.trim() === "") {
      toast.error(`Name and number are required fields`);
      return;
    }

    let alreadyExists = false;

    for (const item of persons) {
      console.log("Item: ", item);
      if (item.name === newName) {
        toast.error(`${newName} is already added to phonebook`);
        alreadyExists = true;
        break;
      }
    }

    if (alreadyExists) return;

    const personObject = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1),
    };

    setPersons(persons.concat(personObject));
    setNewName("");
    setNewNumber("");
    toast.success(`Added ${newName}`);
  };

  const handleNameChange = (event) => {
    console.log("Name field changes to ", event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log("Number field changes to ", event.target.value);
    setNewNumber(event.target.value);
  };
  const handleFilterChange = (event) => {
    console.log("Filter field changes to ", event.target.value);
    setFilter(event.target.value);
  };

  return (
    <div>
      <Toaster position="top-right" />

      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange} />

      <h3>Add newbie</h3>
      <PersonForm
        AddPerson={AddPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons peopleToShow={peopleToShow} />
    </div>
  );
};

export default App;
