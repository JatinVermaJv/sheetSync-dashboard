import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import api from '../services/api';

const ColumnContext = createContext();

export const ColumnProvider = ({ children }) => {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socket = useSocket();

  const fetchColumns = async (spreadsheetId) => {
    try {
      setLoading(true);
      const response = await api.get(`/sheets/${spreadsheetId}/columns`);
      setColumns(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addColumn = async (spreadsheetId, columnData) => {
    try {
      const response = await api.post(`/sheets/${spreadsheetId}/columns`, columnData);
      setColumns(response.data.columns);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateColumn = async (spreadsheetId, columnName, updateData) => {
    try {
      const response = await api.put(`/sheets/${spreadsheetId}/columns/${columnName}`, updateData);
      setColumns(response.data.columns);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteColumn = async (spreadsheetId, columnName) => {
    try {
      const response = await api.delete(`/sheets/${spreadsheetId}/columns/${columnName}`);
      setColumns(response.data.columns);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const reorderColumns = async (spreadsheetId, columnOrder) => {
    try {
      const response = await api.put(`/sheets/${spreadsheetId}/columns/reorder`, { columnOrder });
      setColumns(response.data.columns);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('column_updated', ({ spreadsheetId, columnData }) => {
        switch (columnData.type) {
          case 'add':
          case 'update':
          case 'delete':
          case 'reorder':
            fetchColumns(spreadsheetId);
            break;
          default:
            break;
        }
      });

      return () => {
        socket.off('column_updated');
      };
    }
  }, [socket]);

  const value = {
    columns,
    loading,
    error,
    fetchColumns,
    addColumn,
    updateColumn,
    deleteColumn,
    reorderColumns
  };

  return (
    <ColumnContext.Provider value={value}>
      {children}
    </ColumnContext.Provider>
  );
};

export const useColumns = () => {
  const context = useContext(ColumnContext);
  if (!context) {
    throw new Error('useColumns must be used within a ColumnProvider');
  }
  return context;
}; 