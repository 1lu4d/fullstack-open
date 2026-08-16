import { useState } from "react";

const CreateForm = ({ CreateBlog }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    CreateBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });
    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };
  return (
    <form onSubmit={handleSubmit}>
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
