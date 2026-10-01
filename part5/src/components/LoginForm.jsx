import { TextField, Button, Stack, Typography } from '@mui/material'

const LoginForm = ({
  handleLogin,
  username,
  password,
  setUsername,
  setPassword
}) => (
  <div>
    <Typography variant="h4" sx={{ mb: 2, mt: 2 }}>
      Log in, ma boi
    </Typography>
    <form onSubmit={handleLogin}>
      <Stack spacing={2} sx={{ maxWidth: 400 }}>
        <TextField
          id="username"
          name="username"
          label="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          required
          autoComplete="username"
          variant="standard"
        />
        <TextField
          id="password"
          name="password"
          label="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          required
          autoComplete="current-password"
          variant="standard"
        />
        <Button type="submit" variant="contained">
          login
        </Button>
      </Stack>
    </form>
  </div>
)

export default LoginForm
