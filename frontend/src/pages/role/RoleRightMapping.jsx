import { Container, Typography, Paper, Box } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import LinkIcon from '@mui/icons-material/Link';
import SecurityIcon from '@mui/icons-material/Security';

const RoleRightMapping = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BadgeIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <LinkIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <SecurityIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Role Right Mapping
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Map roles to their corresponding rights/permissions
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Role Right Mapping
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Mapping interface will be implemented here...
        </Typography>
      </Paper>
    </Container>
  );
};

export default RoleRightMapping;


