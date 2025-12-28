import { Container, Typography, Paper, Box } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import AddIcon from '@mui/icons-material/Add';

const CreateRight = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SecurityIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Create Right
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Create a new right/permission
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Right Form
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Form will be implemented here...
        </Typography>
      </Paper>
    </Container>
  );
};

export default CreateRight;


