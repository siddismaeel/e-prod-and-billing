import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import LinkIcon from '@mui/icons-material/Link';
import SecurityIcon from '@mui/icons-material/Security';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { getAllRoles } from '../../services/roleService';
import { getAllRights } from '../../services/rightService';
import { mapRoleToRights, getRoleMappings } from '../../services/roleRightMappingService';
import { useMediaQuery, useTheme } from '@mui/material';

const RoleRightMapping = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingRights, setLoadingRights] = useState(true);
  const [loadingMappings, setLoadingMappings] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dropdown data
  const [roles, setRoles] = useState([]);
  const [rights, setRights] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');

  // Mapping data - array of { rightId, map, view, create, update, delete, export, print, approve, reject, cancel }
  const [rightMappings, setRightMappings] = useState([]);

  // Permission labels
  const permissions = [
    { key: 'map', label: 'Map' },
    { key: 'view', label: 'View' },
    { key: 'create', label: 'Create' },
    { key: 'update', label: 'Update' },
    { key: 'delete', label: 'Delete' },
    { key: 'export', label: 'Export' },
    { key: 'print', label: 'Print' },
    { key: 'approve', label: 'Approve' },
    { key: 'reject', label: 'Reject' },
    { key: 'cancel', label: 'Cancel' },
  ];

  // Fetch roles and rights on component mount
  useEffect(() => {
    fetchRoles();
    fetchRights();
  }, []);

  // Load existing mappings when role is selected
  useEffect(() => {
    if (selectedRoleId) {
      loadExistingMappings();
    } else {
      setRightMappings([]);
    }
  }, [selectedRoleId]);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const data = await getAllRoles();
      const rolesList = Array.isArray(data) ? data : (data?.data || []);
      setRoles(rolesList);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError('Failed to load roles. Please refresh the page.');
    } finally {
      setLoadingRoles(false);
    }
  };

  const fetchRights = async () => {
    try {
      setLoadingRights(true);
      const data = await getAllRights();
      const rightsList = Array.isArray(data) ? data : (data?.data || []);
      setRights(rightsList);
    } catch (err) {
      console.error('Error fetching rights:', err);
      setError('Failed to load rights. Please refresh the page.');
    } finally {
      setLoadingRights(false);
    }
  };

  const loadExistingMappings = async () => {
    try {
      setLoadingMappings(true);
      setError('');
      const mappingData = await getRoleMappings(Number(selectedRoleId));
      
      // Handle response structure - mappingData might be nested
      const mappings = mappingData?.data || mappingData;
      
      if (mappings && mappings.rights) {
        // If response has rights array directly
        const mappedRights = Array.isArray(mappings.rights) ? mappings.rights : 
                           (mappings.rightMapings || mappings.rightMappings || []);
        
        setRightMappings(mappedRights.map(right => ({
          rightId: right.rightId || right.id,
          map: right.map || false,
          view: right.view || false,
          create: right.create || false,
          update: right.update || false,
          delete: right.delete || false,
          export: right.export || false,
          print: right.print || false,
          approve: right.approve || false,
          reject: right.reject || false,
          cancel: right.cancel || false,
        })));
      } else {
        setRightMappings([]);
      }
    } catch (err) {
      console.error('Error loading mappings:', err);
      // Don't show error if no mappings exist (404 or empty)
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || err.message || 'Failed to load existing mappings');
      }
      setRightMappings([]);
    } finally {
      setLoadingMappings(false);
    }
  };

  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    setSelectedRoleId(roleId);
    setError('');
    setSuccess('');
  };

  const handleAddRight = () => {
    // Find available rights that are not already added
    const addedRightIds = rightMappings.map(rm => rm.rightId);
    const availableRights = rights.filter(right => {
      const rightId = right.rightId || right.id;
      return !addedRightIds.includes(rightId);
    });

    if (availableRights.length === 0) {
      setError('All available rights have been added');
      return;
    }

    // Add first available right with all permissions set to false
    const firstRight = availableRights[0];
    const rightId = firstRight.rightId || firstRight.id;
    
    setRightMappings([...rightMappings, {
      rightId: rightId,
      map: false,
      view: false,
      create: false,
      update: false,
      delete: false,
      export: false,
      print: false,
      approve: false,
      reject: false,
      cancel: false,
    }]);
  };

  const handleRemoveRight = (index) => {
    setRightMappings(rightMappings.filter((_, i) => i !== index));
  };

  const handleRightChange = (index, newRightId) => {
    const updatedMappings = [...rightMappings];
    updatedMappings[index].rightId = Number(newRightId);
    // Reset all permissions when right is changed
    permissions.forEach(perm => {
      updatedMappings[index][perm.key] = false;
    });
    setRightMappings(updatedMappings);
  };

  const handlePermissionChange = (index, permissionKey, checked) => {
    const updatedMappings = [...rightMappings];
    updatedMappings[index][permissionKey] = checked;
    setRightMappings(updatedMappings);
  };

  const validateForm = () => {
    if (!selectedRoleId) {
      setError('Please select a role');
      return false;
    }
    if (rightMappings.length === 0) {
      setError('Please add at least one right mapping');
      return false;
    }
    // Check that all mappings have a rightId selected
    const hasInvalidMapping = rightMappings.some(rm => !rm.rightId);
    if (hasInvalidMapping) {
      setError('Please select a right for all mappings');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Prepare payload according to RoleRightMappingRequest structure
      const payload = {
        roleId: Number(selectedRoleId),
        rights: rightMappings.map(rm => ({
          rightId: Number(rm.rightId),
          map: rm.map || false,
          view: rm.view || false,
          create: rm.create || false,
          update: rm.update || false,
          delete: rm.delete || false,
          export: rm.export || false,
          print: rm.print || false,
          approve: rm.approve || false,
          reject: rm.reject || false,
          cancel: rm.cancel || false,
        })),
      };

      await mapRoleToRights(payload);
      
      setSuccess('Role-right mapping saved successfully!');
      
      // Reload mappings to reflect changes
      setTimeout(() => {
        loadExistingMappings();
      }, 1000);
    } catch (err) {
      console.error('Error saving role-right mapping:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save role-right mapping');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedRoleId('');
    setRightMappings([]);
    setError('');
    setSuccess('');
  };

  const getRightName = (rightId) => {
    const right = rights.find(r => (r.rightId || r.id) === rightId);
    return right ? (right.rightName || right.name) : 'Select Right';
  };

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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Role Selection */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
                Select Role
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required disabled={loadingRoles || loadingMappings}>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  value={selectedRoleId}
                  label="Role"
                  onChange={handleRoleChange}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Role</em>
                  </MenuItem>
                  {loadingRoles ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading roles...
                    </MenuItem>
                  ) : roles.length === 0 ? (
                    <MenuItem disabled>No roles available</MenuItem>
                  ) : (
                    roles.map((role) => (
                      <MenuItem key={role.roleId || role.id} value={role.roleId || role.id}>
                        {role.roleName || role.name || `Role ${role.roleId || role.id}`}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              {loadingMappings && selectedRoleId && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Loading existing mappings...
                </Typography>
              )}
            </Grid>

            {/* Rights Mapping Section */}
            {selectedRoleId && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Rights & Permissions
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddRight}
                      disabled={loading || loadingRights || rights.length === 0}
                      size="small"
                    >
                      Add Right
                    </Button>
                  </Box>
                </Grid>

                {rightMappings.length === 0 ? (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      No rights mapped yet. Click "Add Right" to start mapping permissions.
                    </Alert>
                  </Grid>
                ) : isMobile ? (
                  // Mobile: Card-based layout
                  rightMappings.map((mapping, index) => (
                    <Grid item xs={12} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <FormControl fullWidth size="small" sx={{ mr: 1 }}>
                              <InputLabel id={`right-select-label-${index}`}>Right</InputLabel>
                              <Select
                                labelId={`right-select-label-${index}`}
                                id={`right-select-${index}`}
                                value={mapping.rightId || ''}
                                label="Right"
                                onChange={(e) => handleRightChange(index, e.target.value)}
                                disabled={loading}
                              >
                                <MenuItem value="">
                                  <em>Select Right</em>
                                </MenuItem>
                                {rights.map((right) => {
                                  const rightId = right.rightId || right.id;
                                  const isSelected = rightMappings.some((rm, i) => i !== index && rm.rightId === rightId);
                                  return (
                                    <MenuItem 
                                      key={rightId} 
                                      value={rightId}
                                      disabled={isSelected}
                                    >
                                      {right.rightName || right.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveRight(index)}
                              disabled={loading}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          <Grid container spacing={1}>
                            {permissions.map((perm) => (
                              <Grid item xs={6} sm={4} md={3} key={perm.key}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={mapping[perm.key] || false}
                                      onChange={(e) => handlePermissionChange(index, perm.key, e.target.checked)}
                                      disabled={loading || !mapping.rightId}
                                      size="small"
                                    />
                                  }
                                  label={perm.label}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  // Desktop: Table layout
                  <Grid item xs={12}>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Right</TableCell>
                            {permissions.map((perm) => (
                              <TableCell key={perm.key} align="center" sx={{ minWidth: 80 }}>
                                {perm.label}
                              </TableCell>
                            ))}
                            <TableCell align="center" sx={{ width: 80 }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rightMappings.map((mapping, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                                  <Select
                                    value={mapping.rightId || ''}
                                    onChange={(e) => handleRightChange(index, e.target.value)}
                                    disabled={loading}
                                    displayEmpty
                                  >
                                    <MenuItem value="">
                                      <em>Select Right</em>
                                    </MenuItem>
                                    {rights.map((right) => {
                                      const rightId = right.rightId || right.id;
                                      const isSelected = rightMappings.some((rm, i) => i !== index && rm.rightId === rightId);
                                      return (
                                        <MenuItem 
                                          key={rightId} 
                                          value={rightId}
                                          disabled={isSelected}
                                        >
                                          {right.rightName || right.name}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                              </TableCell>
                              {permissions.map((perm) => (
                                <TableCell key={perm.key} align="center">
                                  <Checkbox
                                    checked={mapping[perm.key] || false}
                                    onChange={(e) => handlePermissionChange(index, perm.key, e.target.checked)}
                                    disabled={loading || !mapping.rightId}
                                    size="small"
                                  />
                                </TableCell>
                              ))}
                              <TableCell align="center">
                                <Tooltip title="Remove">
                                  <IconButton
                                    color="error"
                                    onClick={() => handleRemoveRight(index)}
                                    disabled={loading}
                                    size="small"
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<ClearIcon />}
                      onClick={handleReset}
                      disabled={loading}
                    >
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={loading || rightMappings.length === 0}
                    >
                      {loading ? 'Saving...' : 'Save Mapping'}
                    </Button>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default RoleRightMapping;
