import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';

const TableContext = createContext();

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};

export const TableProvider = ({ children }) => {
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('spreadsheet_update', (update) => {
      switch (update.type) {
        case 'row_add':
        case 'row_update':
        case 'row_delete':
          setTableData(prev => ({ ...prev, rows: update.data }));
          break;
        default:
          break;
      }
    });

    return () => {
      socket.off('spreadsheet_update');
    };
  }, [socket]);

  const fetchTableData = async (spreadsheetId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sheets/${spreadsheetId}/data`);
      if (!response.ok) throw new Error('Failed to fetch table data');
      const data = await response.json();
      setTableData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addRow = async (spreadsheetId, rowData) => {
    try {
      const response = await fetch(`/api/sheets/${spreadsheetId}/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rowData)
      });

      if (!response.ok) throw new Error('Failed to add row');
      const { rows } = await response.json();
      setTableData(prev => ({ ...prev, rows }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateRow = async (spreadsheetId, rowIndex, rowData) => {
    try {
      const response = await fetch(`/api/sheets/${spreadsheetId}/data/${rowIndex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rowData)
      });

      if (!response.ok) throw new Error('Failed to update row');
      const { rows } = await response.json();
      setTableData(prev => ({ ...prev, rows }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteRow = async (spreadsheetId, rowIndex) => {
    try {
      const response = await fetch(`/api/sheets/${spreadsheetId}/data/${rowIndex}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete row');
      const { rows } = await response.json();
      setTableData(prev => ({ ...prev, rows }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <TableContext.Provider
      value={{
        tableData,
        loading,
        error,
        fetchTableData,
        addRow,
        updateRow,
        deleteRow,
        clearError
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export default TableProvider; 