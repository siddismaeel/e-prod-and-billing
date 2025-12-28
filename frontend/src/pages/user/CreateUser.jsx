import { Container, Typography, Paper, Box } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';

const CreateUser = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonAddIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Create User
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Create a new user
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          User Form
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Form will be implemented here...
        </Typography>
      </Paper>
    </Container>
  );
};

export default CreateUser;


