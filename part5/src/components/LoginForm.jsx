const LoginForm = ({
  handleLogin,
  username,
  password,
  setUsername,
  setPassword,
}) => (
  <form onSubmit={handleLogin}>
    <div>
      <label>
        username
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          autoComplete="username"
        />
      </label>
    </div>
    <div>
      <label>
        password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          autoComplete="current-password"
        />
      </label>
    </div>
    <button type="submit">login</button>
  </form>
);

export default LoginForm;
