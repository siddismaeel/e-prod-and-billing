import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = ({ size = 40, fullScreen = false }) => {
  const spinner = (
    <CircularProgress size={size} />
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        {spinner}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
      }}
    >
      {spinner}
    </Box>
  );
};

export default LoadingSpinner;


