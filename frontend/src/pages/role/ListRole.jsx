import { Container, Typography, Paper, Box } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import ListIcon from '@mui/icons-material/List';

const ListRole = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BadgeIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <ListIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            List Roles
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          View and manage all roles
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Roles List
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Role list will be implemented here...
        </Typography>
      </Paper>
    </Container>
  );
};

export default ListRole;


