import { useState } from 'react';
import axios from 'axios';
import { Input, Typography, Box, Alert, AlertTitle, IconButton, InputAdornment, Grid, FormControl, Select, MenuItem } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    console.log("ye h ",password)
    console.log("yhi h",regex.test(password))
    return regex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!role) {
      setError('Please select a role.');
      return;
    }
    console.log("this is ",validatePassword)
    if (!validatePassword(password)) {
      setError('Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/registerUser',
        { username, password, role },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.success) {
        setSuccess('Registration successful!');
        setUsername('');
        setPassword('');
        setRole('');
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError('Registration failed: ' + response.data.message);
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    } catch (error) {
      setError('An error occurred: ' + error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        width="200vh"
        height="80vh"
        backgroundColor="1A1A1A"
        paddingBottom='60px'
        

      >
        {/* Left Side - Form */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ color: 'white'}}
        >
          <form onSubmit={handleSubmit}>
            {/* Error or Success Alert */}
            {error && (
              <Alert severity="error" sx={{ marginBottom: '20px' }}>
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ marginBottom: '20px' }}>
                <AlertTitle>Success</AlertTitle>
                {success}
              </Alert>
            )}
          
            <Typography variant="h3" color="white" sx={{ marginTop: '30px',display:'flex',alignItems:'flex-start' }}>
              Create an account 
            </Typography>
            <Typography sx={{display:'flex',alignItems:'flex-start',paddingLeft:'5px'}}>Enter new user credentials to register an account </Typography>
            
            

<Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center', }}>
<Box display="flex" flexDirection="column" width="245px" sx={{ margin: '20px 0px 20px 10px',padding:'20px 0px 20px 0px',backgroundColor:'#262626', }}>
            <Typography color="white" sx={{marginRight:'140px',}}>
              Username
            </Typography>
            <Input
            
              type="text"
              disableUnderline
              placeholder='Type Here'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ borderBottom: '2px solid #333333', color: 'white',margin:'0px 20px 0px 20px'}}
            />
          </Box>
          <Box
              display="flex"
              flexDirection="column"
              width="218px"
              height='73px'
              sx={{ margin: '20px 0px 20px 7px',padding:'13px 15px 13px 15px',backgroundColor:'#262626' }}
            >
              <Typography color="white" marginRight={'190px'} >
                Role
              </Typography>


<FormControl variant="standard">
  <Select
    labelId="demo-simple-select-standard-label"
    id="demo-simple-select-standard"
    value={role}
    onChange={(e) => setRole(e.target.value)}
    label="Select"
    disableUnderline

    placeholder='Select'
    sx={{
      marginTop:'5px',
      borderBottom:'2px solid #333333',
      
      color: 'white', // Change selected text color
      backgroundColor: '#262626', // Change background color
      '& .MuiSvgIcon-root': { color: 'white' }, // Change arrow icon color
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          bgcolor: '#262626', // Change dropdown background color
          '& .MuiMenuItem-root': {
            color: 'white', // Change dropdown item text color
          },
          '& .Mui-selected': {
            backgroundColor: '#333333', // Change background of selected item
          },
        },
      },
    }}
  >
    <MenuItem value="select">
      <em>Select Role</em>
    </MenuItem>
    <MenuItem value="user">User</MenuItem>
    <MenuItem value="admin">Admin</MenuItem>
  </Select>
</FormControl> 


            </Box>
</Grid>


            {/* Password Field with Toggle */}
            <Box display="flex" flexDirection="column" width="500px" sx={{ margin: '20px 0px 20px 0px',padding:'20px 0px 20px 0px',backgroundColor:'#262626' }}>
            <Typography color="white" sx={{marginRight:'390px'}}>
              Password
            </Typography>
            <Input
  type={showPassword ? 'text' : 'password'}
  disableUnderline
  value={password}
  placeholder="Type Here"
  onChange={(e) => setPassword(e.target.value)}
  sx={{ borderBottom: '2px solid #333333', color: 'white', flex: 1,margin:'0px 20px 0px 20px' }}
  endAdornment={
    <InputAdornment position="end">
      <IconButton onClick={togglePasswordVisibility} sx={{ color: 'white',marginBottom:'10px' }}>
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  }
/>
          
          </Box>

            {/* Role Selection */}
            

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                backgroundColor: '#9EFF00',
                color: '#1A1A1A',
                padding: '10px 20px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                display:'flex',
                alignItems:'flex-start'
              }}
            >
              <b>REGISTER A NEW USER</b>
            </button>
          </form>
        </Box>

        {/* Right Side - Image */}
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ backgroundColor: '#1A1A1A' }}
        >
          <img src="/login_register_logo.png" alt="Decorative" style={{ width: '100%', height: 'auto' }} />
        </Box>
      </Box>
    </>
  );
};

export default Register;