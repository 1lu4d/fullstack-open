import { useState, useEffect } from "react";
import Notification from "./components/Notification";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import peopleService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState("some thing happened...");
  const [messageType, setMessageType] = useState("");

  const peopleToShow =
    filter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase()),
        );

  useEffect(() => {
    peopleService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
      })
      .catch(() => {
        console.log("Failed to fetch people list");
      });
  }, []);
  console.log("render", persons.length, "notes");

  const AddPerson = (event) => {
    event.preventDefault();
    if (newName.trim() === "" || newNumber.trim() === "") {
      setMessageType("fail");
      setMessage(`Name and number are required fields`);
      setTimeout(() => {
        setMessage(null);
        setMessageType("");
      }, 3000);
      return;
    }

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      if (
        window.confirm(
          `${existingPerson.name} is already in phonebook, replace the old number with a new one?`,
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        peopleService
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : returnedPerson,
              ),
            );
            setNewName("");
            setNewNumber("");
            setMessageType("success");
            setMessage(`Updated ${existingPerson.name}'s number`);
            setTimeout(() => {
              setMessage(null);
              setMessageType("");
            }, 5000);
          })
          .catch(() => {
            setMessageType("fail");
            setMessage(`Failed to update ${existingPerson}`);
            setTimeout(() => {
              setMessage(null);
              setMessageType("");
            }, 5000);
          });
      }
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };
    peopleService
      .create(personObject)
      .then((returnedPersons) => {
        setPersons(persons.concat(returnedPersons));
        setNewName("");
        setNewNumber("");
        setMessageType("success");
        setMessage(`Added ${newName}`);
        setTimeout(() => {
          setMessage(null);
          setMessageType("");
        }, 5000);
      })
      .catch(() => {
        console.log("Something went wrong");
      });
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

  const handleRemove = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      peopleService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setMessageType("success");
          setMessage(`Deleted ${name}`);
          setTimeout(() => {
            setMessage(null);
            setMessageType("");
          }, 5000);
        })
        .catch(() => {
          setMessageType("fail");
          setMessage(`Failed to delete ${name}`);
          setTimeout(() => {
            setMessage(null);
            setMessageType("");
          }, 5000);
        });
    }
  };

  return (
    <div>
      {/* Bye bye toaster :( */}

      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
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
      <Persons peopleToShow={peopleToShow} handleRemove={handleRemove} />
    </div>
  );
};

export default App;
