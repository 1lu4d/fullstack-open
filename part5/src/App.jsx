import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import CreateForm from "./components/CreateForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { ToastContainer, toast } from "react-toastify";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const CreateBlog = async (event) => {
    event.preventDefault();
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    };

    try {
      const createdBlog = await blogService.create(blogObject);
      setBlogs([...blogs, createdBlog]);
      setNewTitle("");
      setNewAuthor("");
      setNewUrl("");
      toast.success(`Added new blog: ${createdBlog.title} by ${user.username}`);
    } catch (error) {
      toast.error("Failed to add blog");
      console.error("Error creating blog:", error);
    }
  };

  const handleLogoff = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedBlogappUser");
    blogService.setToken(null);
    setUser(null);
    toast.info("Logged out successfully");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      toast.success(`Logged in as ${user.username}`);
    } catch {
      toast.error("wrong credentials");
    }
  };

  const loginForm = () => (
    <LoginForm
      handleLogin={handleLogin}
      username={username}
      password={password}
      setUsername={setUsername}
      setPassword={setPassword}
    />
  );

  const createForm = () => (
    <CreateForm
      CreateBlog={CreateBlog}
      newTitle={newTitle}
      setNewTitle={setNewTitle}
      newAuthor={newAuthor}
      setNewAuthor={setNewAuthor}
      newUrl={newUrl}
      setNewUrl={setNewUrl}
    />
  );

  const blogForm = () => (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );

  return (
    <div>
      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.username} logged in
            <button onClick={handleLogoff}>Logoff</button>
          </p>
          <h2>blogs</h2>
          {blogForm()}
          <h2>Create new blog</h2>
          {createForm()}
        </div>
      )}
      <ToastContainer position="top-right" autoClose={670} />
    </div>
  );
};

export default App;
