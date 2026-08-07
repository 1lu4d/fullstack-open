require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const Person = require("./models/person");
var morgan = require("morgan");
const path = require("path");
const app = express();

morgan.token("body", (req) => {
  if (req.method === "POST" && req.body) {
    return JSON.stringify(req.body);
  }
  return "";
});

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms Data: :body",
  ),
);

// Pour le hampteur
app.get("/favicon.svg", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "favicon.ico"));
});

const errorHandler = (error, request, response, next) => {
  console.error("error.name:", error.name);
  console.error("error.message:", error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Wrong id format" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  return response.status(500).json({ error: "Internal server error" });
};

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

  Person.findOneAndUpdate(
    { name: body.name },
    { name: body.name, number: body.number },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
      context: "query",
    },
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Its back from the dead

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { returnDocument: "after", runValidators: true, context: "query" },
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).json({ error: "person not found" });
      }
    })
    .catch((error) => next(error));
});

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
  Person.estimatedDocumentCount()
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
