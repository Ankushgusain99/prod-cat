import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListIcon from '@mui/icons-material/List';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

export default function LeftDrawer() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook
  const[username,setUsername]=React.useState("")
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(open);
    
  };
  React.useEffect(()=>{
    setUsername(localStorage.getItem('username'))
  },[username])
  

  const list = () => (
    <Box
      sx={{ width: 325 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      backgroundColor={'#262626'}
      color={'white'}
      
    >
      <List sx={{backgroundColor:'#1A1A1A',color:'white'}}>
      <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/productTable')}>
            <ListItemText primary="ProductTable" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/register')}>
            <ListItemText primary="Register" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/users')}>
            <ListItemText primary="Users" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{height:'345px'}}>
        
        </ListItem> 
        
      </List>
      
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)} sx={{ 
    outline: 'none',        // Disables the outline for focus
    '&:focus': {
      outline: 'none',      // Ensures no outline on focus
    },
    '&:active': {
      outline: 'none',      // Ensures no outline on active state
    },
    '&:hover': {
      outline: 'none',      // Ensures no outline on hover
    }
  }} style={{ height: '40px', width: '40px'}}>
  <ListIcon sx={{ backgroundColor: '#262626',color:'white', borderRadius: '50%',height:'30px',marginLeft:'10px' }} />
  <span style={{color:'white'}}>Menu</span>
</Button>
      <Drawer
        anchor='left'
        open={open}
        onClose={toggleDrawer(false)}
        
      >
        <div style={{display:'flex',backgroundColor:'#262626',padding:'10px'}}>
        <AccountCircleOutlinedIcon sx={{color:'white',fontSize: '60px',marginLeft:'10px'}} />
           <span style={{color:"white",fontSize:'20px',marginTop:'15px'}}>
             Hello, {username}
            </span>
        </div>
        
        {list()}
      </Drawer>
    </div>
  );
}