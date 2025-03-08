import React, { useState, useEffect } from 'react';
import { useColumns } from '../context/ColumnContext';
import { useTable } from '../context/TableContext';
import AddColumnDialog from './AddColumnDialog';
import { IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const TableView = ({ spreadsheetId }) => {
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const { columns } = useColumns();
  const { tableData, loading, error, fetchTableData, addRow, updateRow, deleteRow } = useTable();

  useEffect(() => {
    fetchTableData(spreadsheetId);
  }, [spreadsheetId, fetchTableData]);

  const handleAddRow = async () => {
    try {
      const defaultRow = {};
      columns.forEach(column => {
        defaultRow[column.name] = column.defaultValue || '';
      });
      await addRow(spreadsheetId, defaultRow);
    } catch (err) {
      console.error('Error adding row:', err);
    }
  };

  const handleUpdateRow = async (rowIndex, rowData) => {
    try {
      await updateRow(spreadsheetId, rowIndex, rowData);
      setEditingRow(null);
    } catch (err) {
      console.error('Error updating row:', err);
    }
  };

  const handleDeleteRow = async (rowIndex) => {
    try {
      await deleteRow(spreadsheetId, rowIndex);
    } catch (err) {
      console.error('Error deleting row:', err);
    }
  };

  const formatCellValue = (value, type) => {
    if (value === null || value === undefined) return '';
    switch (type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      default:
        return value.toString();
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading table data...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-4">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddRow}
        >
          Add Row
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setIsAddColumnDialogOpen(true)}
        >
          Add Column
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.name}>{column.name}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map(column => (
                  <TableCell key={column.name}>
                    {editingRow === rowIndex ? (
                      <input
                        type={column.type === 'number' || column.type === 'currency' ? 'number' : 'text'}
                        value={row.data.get(column.name) || ''}
                        onChange={e => {
                          const newRows = [...tableData.rows];
                          newRows[rowIndex].data.set(column.name, e.target.value);
                          setTableData(prev => ({ ...prev, rows: newRows }));
                        }}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      formatCellValue(row.data.get(column.name), column.type)
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex space-x-2">
                    <IconButton
                      onClick={() => editingRow === rowIndex
                        ? handleUpdateRow(rowIndex, Object.fromEntries(row.data))
                        : setEditingRow(rowIndex)
                      }
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteRow(rowIndex)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddColumnDialog
        open={isAddColumnDialogOpen}
        onClose={() => setIsAddColumnDialogOpen(false)}
        spreadsheetId={spreadsheetId}
      />
    </div>
  );
};

export default TableView; 