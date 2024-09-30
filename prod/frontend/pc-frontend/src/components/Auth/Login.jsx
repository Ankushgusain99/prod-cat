
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertTitle, Input, Typography, IconButton, InputAdornment, Button } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Box from "@mui/material/Box";

const Login = ({onLogin}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/loginUser',
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const { token,user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username',user.username)
      localStorage.setItem('role',user.role)
      if (response.status === 200) {
        setSuccess('Login successful!');
        console.log("login vala",user)
        onLogin(user); // Pass user info to the parent component
        setTimeout(() => {
          const info = {
            id: response.data.user._id,
            name: response.data.user.username,
          };
          setUsername('');
          setPassword('');
          setError('');
          setSuccess('');
          if (response.data.user.role === 'admin') {
            
            navigate("/productTable");
          } else {
            navigate("/productForm", { state: { info } });
          }
        }, 1000);
      } else {
        setError('Login failed: ' + response.data.message);
        setTimeout(() => {
          setError('');
        }, 5000);
      }
    } catch (error) {
      setError('An error occurred: ' + (error.response?.data?.message || error.message));
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  return (
    <>
      <Box display="flex" flexDirection="row" bgcolor="#1A1A1A" sx={{width:'lg',maxHeight:'80vh',fontFamily: 'Barlow, sans-serif',paddingBottom:'50px'  // Set font family to Barlow with a sans-serif fallback

}}>
      {/* Left Side - Image */}
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ backgroundColor: '#1A1A1A', overflow: 'hidden' }}
      >
        <img src='/login_register_logo.png' alt="Decorative" style={{ width: '100%', height: 'auto' }} />
      </Box>

      {/* Right Side - Form */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        padding="40px"
        sx={{ color: 'white', overflow: 'hidden' }}
      >
        <form onSubmit={handleSubmit}>
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

          <Typography fontSize='40px' color="#FFFFFF" sx={{ display:'flex',flexDirection:'row',alignItems:'flex-start' }}>
            Welcome back 
          </Typography>
          <Typography color="#FFFFFF" sx={{ display:'flex',flexDirection:'row',alignItems:'flex-start' }}>Enter credentials to access the account</Typography>

          {/* Username Field */}
          <Box display="flex" flexDirection="column" width="500px" sx={{ margin: '20px 0px 20px 0px',padding:'20px 0px 20px 0px',backgroundColor:'#262626' }}>
            <Typography color="white" sx={{marginRight:'380px'}}>
              Username
            </Typography>
            <Input
              type="text"
              disableUnderline
              placeholder='Type Here'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ borderBottom: '2px solid gray', color: 'white',margin:'0px 20px 0px 20px'}}
            />
          </Box>

          {/* Password Field with Toggle */}
          <Box display="flex" flexDirection="column" width="500px" sx={{ margin: '20px 0px 20px 0px',padding:'20px 0px 20px 0px',backgroundColor:'#262626' }}>
            <Typography color="white" sx={{marginRight:'380px'}}>
              Password
            </Typography>
            <Input
  type={showPassword ? 'text' : 'password'}
  disableUnderline
  value={password}
  placeholder="Type Here"
  onChange={(e) => setPassword(e.target.value)}
  sx={{ borderBottom: '2px solid gray', color: 'white', flex: 1,margin:'0px 20px 0px 20px' }}
  endAdornment={
    <InputAdornment position="end">
      <IconButton onClick={togglePasswordVisibility} sx={{ color: 'white',marginBottom:'10px' }}>
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  }
/>
          
          </Box>

          <Button
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
            <strong>Login To Continue</strong>
          </Button>
        </form>
      </Box>
    </Box>
    </>
    
  );
};

export default Login;



