import { useState } from "react";

const CreateForm = (props) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");
  return (
    <form onSubmit={props.CreateBlog}>
      <div>
        title:{" "}
        <input
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          required
          type="text"
          placeholder="Yor title"
        />
      </div>
      <div>
        author:{" "}
        <input
          value={newAuthor}
          onChange={(event) => setNewAuthor(event.target.value)}
          required
          type="text"
          placeholder="Yor author"
        />
      </div>
      <div>
        url:{" "}
        <input
          value={newUrl}
          onChange={(event) => setNewUrl(event.target.value)}
          required
          type="text"
          placeholder="Yor URL"
        />
      </div>
      <div>
        <button type="submit">Create</button>
      </div>
    </form>
  );
};

export default CreateForm;
