require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const Person = require("./models/person");
var morgan = require("morgan");
const app = express();

morgan.token("body", (req) => {
  if (req.method === "POST" && req.body) {
    return JSON.stringify(req.body);
  }
  return "";
});

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms Data: :body",
  ),
);

const errorHandler = (error, request, response, next) => {
  console.error("error.name:", error.name);
  console.error("error.message:", error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "Wrong id format" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  return response.status(500).json({ error: "Internal server error" });
};

// let persons = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "The name or number is missing",
    });
  }

  Person.findOne({ name: body.name })
    .then((existingPerson) => {
      if (existingPerson) {
        return response.status(400).json({
          error: "The name already exists in phonebook",
        });
      }
      const person = new Person({
        name: body.name,
        number: body.number,
      });
      return person.save();
    })
    .then((savedPerson) => {
      if (savedPerson) {
        response.json(savedPerson);
      }
    })
    .catch((error) => next(error));
});

// Definitelly nothing to see here (It will be back)

// app.put("/api/persons/:id", (request, response) => {
//   const id = request.params.id;
//   const body = request.body;

//   const person = persons.find((person) => person.id === id);

//   console.log(person);

//   if (person) {
//     const updatedPerson = {
//       ...person,
//       number: body.number,
//     };

//     persons = persons.map((person) =>
//       person.id !== id ? person : updatedPerson,
//     );
//     response.json(updatedPerson);
//   } else {
//     response.status(404).end();
//   }
// });

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((persons) => response.json(persons))
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  Person.countDocuments({})
    .then((count) => {
      const date = new Date();
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
      `);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
