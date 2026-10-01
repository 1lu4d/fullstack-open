import { Link } from 'react-router-dom'

const Navigation = ({ user, handleLogoff }) => {
  const padding = { padding: 5 }

  return (
    <div>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/create">
        nouveau blogh
      </Link>
      {user ? (
        <button onClick={handleLogoff}>logoff</button>
      ) : (
        <Link style={padding} to="/login">
          login
        </Link>
      )}
    </div>
  )
}

export default Navigation
