import { Link } from 'react-router-dom'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Paper
} from '@mui/material'

const BlogList = ({ blogs }) => {
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2, mt: 2 }}>
        Blogs
      </Typography>

      <Paper elevation={2}>
        <List>
          {blogs.map((blog) => (
            <ListItem key={blog.id} disablePadding divider>
              <ListItemButton component={Link} to={`/blogs/${blog.id}`}>
                <ListItemText primary={blog.title} secondary={blog.author} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  )
}

export default BlogList
