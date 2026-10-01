import { Link } from 'react-router-dom'
import { AppBar, Button, Toolbar } from '@mui/material'

const Navigation = ({ user, handleLogoff }) => {
  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/" sx={style}>
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/create" sx={style}>
          nouveau blogh
        </Button>
        {user ? (
          <Button color="inherit" onClick={handleLogoff} sx={style}>
            logoff
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login" sx={style}>
            login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
