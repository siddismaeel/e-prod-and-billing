import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Grid, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import { upsertPropositionsBatch } from '../../services/propositionService';
import { getAllReadyItems } from '../../services/readyItemService';
import { getAllRawMaterials } from '../../services/rawMaterialService';

const CreateProposition = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [readyItemId, setReadyItemId] = useState('');
  const [rawMaterialEntries, setRawMaterialEntries] = useState([
    { rawMaterialId: '', expectedPercentage: '' }
  ]);

  // Dropdown data
  const [readyItems, setReadyItems] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loadingReadyItems, setLoadingReadyItems] = useState(true);
  const [loadingRawMaterials, setLoadingRawMaterials] = useState(true);

  // Fetch dropdown data on component mount
  useEffect(() => {
    fetchReadyItems();
    fetchRawMaterials();
  }, []);

  // Fetch ready items
  const fetchReadyItems = async () => {
    try {
      setLoadingReadyItems(true);
      const data = await getAllReadyItems();
      setReadyItems(data || []);
    } catch (err) {
      console.error('Error fetching ready items:', err);
      setError('Failed to load ready items. Please refresh the page.');
    } finally {
      setLoadingReadyItems(false);
    }
  };

  // Fetch raw materials
  const fetchRawMaterials = async () => {
    try {
      setLoadingRawMaterials(true);
      const data = await getAllRawMaterials();
      setRawMaterials(data || []);
    } catch (err) {
      console.error('Error fetching raw materials:', err);
      setError('Failed to load raw materials. Please refresh the page.');
    } finally {
      setLoadingRawMaterials(false);
    }
  };

  const addRawMaterialRow = () => {
    setRawMaterialEntries([...rawMaterialEntries, { rawMaterialId: '', expectedPercentage: '' }]);
  };

  const removeRawMaterialRow = (index) => {
    if (rawMaterialEntries.length > 1) {
      setRawMaterialEntries(rawMaterialEntries.filter((_, i) => i !== index));
    }
  };

  const handleRawMaterialChange = (index, field, value) => {
    const updated = [...rawMaterialEntries];
    updated[index] = { ...updated[index], [field]: value };
    setRawMaterialEntries(updated);
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Validation
      if (!readyItemId) {
        setError('Please select a Ready Item');
        return;
      }

      if (rawMaterialEntries.length === 0) {
        setError('Please add at least one raw material');
        return;
      }

      // Validate all entries
      for (let i = 0; i < rawMaterialEntries.length; i++) {
        const entry = rawMaterialEntries[i];
        if (!entry.rawMaterialId || !entry.expectedPercentage) {
          setError(`Please fill all fields for Raw Material entry ${i + 1}`);
          return;
        }
      }

      // Prepare batch payload
      const batchPayload = {
        readyItemId: Number(readyItemId),
        rawMaterialEntries: rawMaterialEntries.map(entry => ({
          rawMaterialId: Number(entry.rawMaterialId),
          expectedPercentage: Number(entry.expectedPercentage)
        }))
      };

      await upsertPropositionsBatch(batchPayload);
      setSuccess(`Successfully saved ${rawMaterialEntries.length} proposition(s)!`);
      
      // Clear form after 2 seconds
      setTimeout(() => {
        setReadyItemId('');
        setRawMaterialEntries([{ rawMaterialId: '', expectedPercentage: '' }]);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save propositions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUpIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <AddIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">Create Proposition</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">Create a new proposition</Typography>
      </Box>
      <Paper sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Ready Item Selection - Once at the top */}
            <Grid item xs={12}>
              <FormControl fullWidth required error={!!error && !readyItemId} disabled={loading || loadingReadyItems}>
                <InputLabel id="ready-item-select-label">Ready Item</InputLabel>
                <Select
                  labelId="ready-item-select-label"
                  id="ready-item-select"
                  value={readyItemId}
                  label="Ready Item"
                  onChange={(e) => setReadyItemId(e.target.value)}
                >
                  {loadingReadyItems ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading ready items...
                    </MenuItem>
                  ) : readyItems.length === 0 ? (
                    <MenuItem disabled>No ready items available</MenuItem>
                  ) : (
                    readyItems.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Raw Materials Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Raw Materials</Typography>
              {rawMaterialEntries.map((entry, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={5}>
                      <FormControl fullWidth required disabled={loading || loadingRawMaterials}>
                        <InputLabel>Raw Material</InputLabel>
                        <Select
                          value={entry.rawMaterialId}
                          label="Raw Material"
                          onChange={(e) => handleRawMaterialChange(index, 'rawMaterialId', e.target.value)}
                        >
                          {loadingRawMaterials ? (
                            <MenuItem disabled>
                              <CircularProgress size={20} sx={{ mr: 1 }} />
                              Loading raw materials...
                            </MenuItem>
                          ) : rawMaterials.length === 0 ? (
                            <MenuItem disabled>No raw materials available</MenuItem>
                          ) : (
                            rawMaterials.map((material) => (
                              <MenuItem key={material.id} value={material.id}>
                                {material.name}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <TextField
                        fullWidth
                        label="Expected Percentage"
                        value={entry.expectedPercentage}
                        onChange={(e) => handleRawMaterialChange(index, 'expectedPercentage', e.target.value)}
                        disabled={loading}
                        type="number"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      {rawMaterialEntries.length > 1 && (
                        <IconButton
                          onClick={() => removeRawMaterialRow(index)}
                          color="error"
                          disabled={loading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              ))}
              
              {/* Add Raw Material Button */}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addRawMaterialRow}
                disabled={loading || !readyItemId}
                sx={{ mb: 2 }}
              >
                Add Raw Material
              </Button>
            </Grid>

            {/* Submit Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={() => {
                    setReadyItemId('');
                    setRawMaterialEntries([{ rawMaterialId: '', expectedPercentage: '' }]);
                  }}
                  disabled={loading}
                  size="large"
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                  size="large"
                >
                  {loading ? 'Saving...' : 'Save All'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateProposition;

