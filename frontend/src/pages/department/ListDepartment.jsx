import { Container, Typography, Paper, Box } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import ListIcon from '@mui/icons-material/List';

const ListDepartment = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BusinessIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            List Departments
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          View and manage all departments
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Departments List
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Department list will be implemented here...
        </Typography>
      </Paper>
    </Container>
  );
};

export default ListDepartment;


