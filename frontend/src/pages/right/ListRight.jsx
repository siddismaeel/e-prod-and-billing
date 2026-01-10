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
import SecurityIcon from '@mui/icons-material/Security';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllRights, deleteRight } from '../../services/rightService';

const ListRight = () => {
  const navigate = useNavigate();
  const [rights, setRights] = useState([]);
  const [filteredRights, setFilteredRights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchRights();
  }, []);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredRights(rights);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = rights.filter((right) => {
        return (
          (right.rightName && right.rightName.toLowerCase().includes(searchLower)) ||
          (right.name && right.name.toLowerCase().includes(searchLower)) ||
          (right.rightDescription && right.rightDescription.toLowerCase().includes(searchLower)) ||
          (right.description && right.description.toLowerCase().includes(searchLower))
        );
      });
      setFilteredRights(filtered);
    }
  }, [searchText, rights]);

  const fetchRights = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllRights();
      // Handle response structure - data might be nested
      const rightsList = Array.isArray(data) 
        ? data.filter(right => right != null) 
        : (data?.data || []).filter(right => right != null);
      setRights(rightsList);
      setFilteredRights(rightsList);
    } catch (err) {
      console.error('Error fetching rights:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch rights');
      setRights([]);
      setFilteredRights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rightId) => {
    navigate(`/rights/create/${rightId}`);
  };

  const handleDelete = async (rightId) => {
    if (window.confirm('Are you sure you want to delete this right?')) {
      try {
        setLoading(true);
        setError(null);
        await deleteRight(rightId);
        // Refresh the list
        await fetchRights();
      } catch (err) {
        console.error('Error deleting right:', err);
        setError(err.response?.data?.message || err.message || 'Failed to delete right');
      } finally {
        setLoading(false);
      }
    }
  };

  // Define columns
  const columns = [
    {
      field: 'rightId',
      headerName: 'Right ID',
      width: 120,
      sortable: true,
      type: 'number',
      valueGetter: (params) => params?.row?.rightId || params?.row?.id || null,
    },
    {
      field: 'rightName',
      headerName: 'Right Name',
      flex: 1,
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'rightDescription',
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
      field: 'moduleId',
      headerName: 'Module ID',
      width: 120,
      sortable: true,
      type: 'number',
      valueGetter: (params) => params?.row?.moduleId || params?.row?.module?.id || null,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ?? '-'}
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
        const rightId = params.row.rightId || params.row.id;
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleEdit(rightId)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(rightId)}
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
            placeholder="Search by right name or description..."
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
              Showing {filteredRights.length} of {rights.length} rights
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
              rows={filteredRights}
              columns={columns}
              getRowId={(row) => row?.rightId || row?.id || Math.random()}
              pageSizeOptions={[10, 25, 50, 100]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
                sorting: {
                  sortModel: [{ field: 'rightName', sort: 'asc' }],
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

export default ListRight;
