import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box
} from '@mui/material';
import { useColumns } from '../context/ColumnContext';

const columnTypes = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'currency', label: 'Currency' }
];

const AddColumnDialog = ({ open, onClose, spreadsheetId }) => {
  const { addColumn } = useColumns();
  const [columnData, setColumnData] = useState({
    name: '',
    type: 'text',
    defaultValue: '',
    validation: {
      required: false,
      min: '',
      max: '',
      pattern: ''
    }
  });
  const [error, setError] = useState('');

  const handleChange = (field) => (event) => {
    if (field.startsWith('validation.')) {
      const validationField = field.split('.')[1];
      setColumnData(prev => ({
        ...prev,
        validation: {
          ...prev.validation,
          [validationField]: event.target.value
        }
      }));
    } else {
      setColumnData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addColumn(spreadsheetId, columnData);
      onClose();
      setColumnData({
        name: '',
        type: 'text',
        defaultValue: '',
        validation: {
          required: false,
          min: '',
          max: '',
          pattern: ''
        }
      });
      setError('');
    } catch (err) {
      setError(err.message || 'Error adding column');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Column</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Column Name"
              value={columnData.name}
              onChange={handleChange('name')}
              required
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Column Type</InputLabel>
              <Select
                value={columnData.type}
                onChange={handleChange('type')}
                label="Column Type"
                required
              >
                {columnTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Default Value"
              value={columnData.defaultValue}
              onChange={handleChange('defaultValue')}
              fullWidth
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={columnData.validation.required}
                  onChange={(e) => handleChange('validation.required')(
                    { target: { value: e.target.checked } }
                  )}
                />
              }
              label="Required"
            />

            {(columnData.type === 'number' || columnData.type === 'currency') && (
              <>
                <TextField
                  label="Minimum Value"
                  type="number"
                  value={columnData.validation.min}
                  onChange={handleChange('validation.min')}
                  fullWidth
                />
                <TextField
                  label="Maximum Value"
                  type="number"
                  value={columnData.validation.max}
                  onChange={handleChange('validation.max')}
                  fullWidth
                />
              </>
            )}

            {columnData.type === 'text' && (
              <TextField
                label="Pattern (Regex)"
                value={columnData.validation.pattern}
                onChange={handleChange('validation.pattern')}
                fullWidth
                helperText="Optional: Enter a regular expression pattern for validation"
              />
            )}

            {error && (
              <Box sx={{ color: 'error.main' }}>
                {error}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add Column
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddColumnDialog; 