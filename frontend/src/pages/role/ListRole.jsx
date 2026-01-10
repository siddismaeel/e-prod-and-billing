import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import BadgeIcon from '@mui/icons-material/Badge';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllRoles, deleteRole } from '../../services/roleService';

const ListRole = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredRoles(roles);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = roles.filter((role) => {
        return (
          (role.roleName && role.roleName.toLowerCase().includes(searchLower)) ||
          (role.name && role.name.toLowerCase().includes(searchLower)) ||
          (role.description && role.description.toLowerCase().includes(searchLower))
        );
      });
      setFilteredRoles(filtered);
    }
  }, [searchText, roles]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllRoles();
      // Handle response structure - data might be nested
      const rolesList = Array.isArray(data) 
        ? data.filter(role => role != null) 
        : (data?.data || []).filter(role => role != null);
      console.log('Fetched roles:', rolesList); // Debug log
      setRoles(rolesList);
      setFilteredRoles(rolesList);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch roles');
      setRoles([]);
      setFilteredRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (roleId) => {
    navigate(`/roles/create/${roleId}`);
  };

  const handleDelete = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        setLoading(true);
        setError(null);
        await deleteRole(roleId);
        // Refresh the list
        await fetchRoles();
      } catch (err) {
        console.error('Error deleting role:', err);
        setError(err.response?.data?.message || err.message || 'Failed to delete role');
      } finally {
        setLoading(false);
      }
    }
  };

  // Define columns
  const columns = [
    {
      field: 'roleId',
      headerName: 'Role ID',
      width: 120,
      sortable: true,
      type: 'number',
      valueGetter: (params) => params?.row?.roleId || params?.row?.id || null,
    },
    {
      field: 'roleName',
      headerName: 'Role Name',
      flex: 1,
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 120,
      sortable: true,
      type: 'number',
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      minWidth: 250,
      sortable: false,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const roleId = params.row.roleId || params.row.id;
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleEdit(roleId)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(roleId)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by role name or description..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 500 }}
          />
          {searchText && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Showing {filteredRoles.length} of {roles.length} roles
            </Typography>
          )}
        </Box>

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          /* DataGrid */
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredRoles}
              columns={columns}
              getRowId={(row) => row?.roleId || row?.id || Math.random()}
              pageSizeOptions={[10, 25, 50, 100]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
                sorting: {
                  sortModel: [{ field: 'roleName', sort: 'asc' }],
                },
              }}
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'primary.main',
                  color: '#ffffff',
                  fontWeight: 'bold',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  color: '#ffffff',
                  fontWeight: 'bold',
                },
                '& .MuiDataGrid-columnHeader': {
                  color: '#ffffff',
                },
                '& .MuiDataGrid-sortIcon': {
                  color: '#ffffff',
                },
                '& .MuiDataGrid-menuIcon': {
                  color: '#ffffff',
                },
                '& .MuiDataGrid-filterIcon': {
                  color: '#ffffff',
                },
                '& .MuiDataGrid-columnHeader:focus': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ListRole;
