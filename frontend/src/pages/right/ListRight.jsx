import { Container, Typography, Paper, Box } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import ListIcon from '@mui/icons-material/List';

const ListRight = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SecurityIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            List Rights
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          View and manage all rights/permissions
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Rights List
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rights list will be implemented here...
        </Typography>
      </Paper>
    </Container>
  );
};

export default ListRight;


