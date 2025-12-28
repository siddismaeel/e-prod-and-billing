import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { login, verifyOtp } from '../../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('login'); // 'login' or 'verify-otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClear = () => {
    setUsername('');
    setPassword('');
    setOtp('');
    setStep('login');
    setError('');
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(username, password);
      setStep('verify-otp');
      setError('');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await verifyOtp(username, password, otp);
      
      // Log the response structure for debugging
      console.log('OTP Verification Response:', data);
      
      // Handle response structure: { data: { token, currentUser }, message, status }
      // Check for token in various possible locations
      let token = null;
      if (data.data?.token) {
        token = data.data.token;
      } else if (data.token) {
        token = data.token;
      } else if (data.accessToken) {
        token = data.accessToken;
      } else if (data.jwtToken) {
        token = data.jwtToken;
      } else if (data.jwt) {
        token = data.jwt;
      }
      
      // Store token if found
      if (token) {
        localStorage.setItem('token', token);
        console.log('Token stored successfully in localStorage');
        
        // Verify token was stored
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          console.log('Token verification: Token exists in localStorage');
        } else {
          console.error('Token verification failed: Token not found in localStorage');
        }
      } else {
        console.warn('No token found in response. Response structure:', data);
        setError('Token not received from server. Please try again.');
        return;
      }
      
      // Store currentUser data following the response structure: data.data.currentUser
      let currentUser = null;
      if (data.data?.currentUser) {
        currentUser = data.data.currentUser;
      } else if (data.currentUser) {
        currentUser = data.currentUser;
      } else if (data.data?.user) {
        currentUser = data.data.user;
      } else if (data.user) {
        currentUser = data.user;
      }
      
      if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log('Current user stored successfully in localStorage:', currentUser);
      } else {
        console.warn('No currentUser found in response. Response structure:', data);
      }
      
      // Navigate to home page only after successful token storage
      navigate('/');
    } catch (err) {
      console.error('OTP Verification Error:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'OTP verification failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <LockIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {step === 'login' ? 'Enter your credentials' : 'Enter OTP to verify'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={step === 'verify-otp' || loading}
            fullWidth
            required
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={step === 'verify-otp' || loading}
            fullWidth
            required
          />

          {step === 'verify-otp' && (
            <TextField
              label="OTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
              fullWidth
              required
              inputProps={{ maxLength: 6 }}
            />
          )}

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={step === 'login' ? handleLogin : handleVerifyOtp}
              disabled={loading}
              fullWidth
            >
              {loading ? 'Processing...' : step === 'login' ? 'Login' : 'Verify OTP'}
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClear}
              disabled={loading}
              fullWidth
            >
              Clear
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;

