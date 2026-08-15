const CreateForm = (props) => {
  return (
    <form onSubmit={props.CreateBlog}>
      <div>
        title:{" "}
        <input
          value={props.newTitle}
          onChange={(event) => props.setNewTitle(event.target.value)}
          required
          type="text"
          placeholder="Yor title"
        />
      </div>
      <div>
        author:{" "}
        <input
          value={props.newAuthor}
          onChange={(event) => props.setNewAuthor(event.target.value)}
          required
          type="text"
          placeholder="Yor author"
        />
      </div>
      <div>
        url:{" "}
        <input
          value={props.newUrl}
          onChange={(event) => props.setNewUrl(event.target.value)}
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
