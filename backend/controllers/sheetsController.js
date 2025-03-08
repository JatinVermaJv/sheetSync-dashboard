import GoogleSheetsService from '../services/googleSheetsService.js';
import dynamicColumnService from '../services/dynamicColumnService.js';
import tableDataService from '../services/tableDataService.js';
import socketService from '../services/socketService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Google Sheets service with credentials
let credentials;
try {
  const credentialsString = process.env.GOOGLE_SHEETS_CREDENTIALS;
  if (!credentialsString) {
    throw new Error('GOOGLE_SHEETS_CREDENTIALS environment variable is not set');
  }
  credentials = JSON.parse(credentialsString);
  
  if (!credentials.client_email) {
    throw new Error('client_email is missing in the credentials');
  }
  if (!credentials.private_key) {
    throw new Error('private_key is missing in the credentials');
  }
} catch (error) {
  console.error('Error parsing Google Sheets credentials:', error);
  throw error;
}

const sheetsService = new GoogleSheetsService(credentials);

export const createSpreadsheet = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const spreadsheet = await sheetsService.createSpreadsheet(title);
    
    // Emit the new spreadsheet creation event
    socketService.emitSpreadsheetUpdate(spreadsheet.spreadsheetId, {
      type: 'create',
      data: spreadsheet
    });
    
    res.json(spreadsheet);
  } catch (error) {
    console.error('Error in createSpreadsheet:', error);
    res.status(500).json({ message: 'Error creating spreadsheet', error: error.message });
  }
};

export const getSpreadsheetData = async (req, res) => {
  try {
    const { spreadsheetId, range } = req.params;
    const data = await sheetsService.getSpreadsheetData(spreadsheetId, range);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error reading spreadsheet', error: error.message });
  }
};

export const updateSpreadsheetData = async (req, res) => {
  try {
    const { spreadsheetId, range } = req.params;
    const { values } = req.body;
    const result = await sheetsService.updateSpreadsheetData(spreadsheetId, range, values);
    
    // Emit the update event
    socketService.emitSpreadsheetUpdate(spreadsheetId, {
      type: 'update',
      range,
      data: values
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating spreadsheet', error: error.message });
  }
};

export const appendSpreadsheetData = async (req, res) => {
  try {
    const { spreadsheetId, range } = req.params;
    const { values } = req.body;
    const result = await sheetsService.appendSpreadsheetData(spreadsheetId, range, values);
    
    // Emit the append event
    socketService.emitSpreadsheetUpdate(spreadsheetId, {
      type: 'append',
      range,
      data: values
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error appending to spreadsheet', error: error.message });
  }
};

// Dynamic Column Operations
export const addColumn = async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const { name, type, defaultValue, validation } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ 
        message: 'Column name and type are required' 
      });
    }

    // Add the column to our dynamic columns storage
    const columns = await dynamicColumnService.addColumn(spreadsheetId, {
      name,
      type,
      defaultValue,
      validation
    });
    
    // Emit the column addition event
    socketService.emitColumnUpdate(spreadsheetId, {
      type: 'add',
      column: { name, type, defaultValue, validation }
    });
    
    res.json({ 
      message: 'Column added successfully',
      columns
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error adding column', 
      error: error.message 
    });
  }
};

export const getColumns = async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const columns = await dynamicColumnService.getColumns(spreadsheetId);
    res.json(columns);
  } catch (error) {
    res.status(500).json({
      message: 'Error getting columns',
      error: error.message
    });
  }
};

export const updateColumn = async (req, res) => {
  try {
    const { spreadsheetId, columnName } = req.params;
    const updateData = req.body;

    const columns = await dynamicColumnService.updateColumn(spreadsheetId, columnName, updateData);
    
    // Emit the column update event
    socketService.emitColumnUpdate(spreadsheetId, {
      type: 'update',
      columnName,
      updateData
    });

    res.json({
      message: 'Column updated successfully',
      columns
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating column',
      error: error.message
    });
  }
};

export const deleteColumn = async (req, res) => {
  try {
    const { spreadsheetId, columnName } = req.params;
    
    const columns = await dynamicColumnService.deleteColumn(spreadsheetId, columnName);
    
    // Emit the column deletion event
    socketService.emitColumnUpdate(spreadsheetId, {
      type: 'delete',
      columnName
    });

    res.json({
      message: 'Column deleted successfully',
      columns
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting column',
      error: error.message
    });
  }
};

export const reorderColumns = async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const { columnOrder } = req.body;

    if (!Array.isArray(columnOrder)) {
      return res.status(400).json({
        message: 'Column order must be an array of column names'
      });
    }

    const columns = await dynamicColumnService.reorderColumns(spreadsheetId, columnOrder);
    
    // Emit the column reorder event
    socketService.emitColumnUpdate(spreadsheetId, {
      type: 'reorder',
      columnOrder
    });

    res.json({
      message: 'Columns reordered successfully',
      columns
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error reordering columns',
      error: error.message
    });
  }
};

// Table Data Operations
export const getTableData = async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const data = await tableDataService.getTableData(spreadsheetId);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Error getting table data',
      error: error.message
    });
  }
};

export const addRow = async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const rowData = req.body;

    const rows = await tableDataService.addRow(spreadsheetId, rowData);
    
    // Emit the row addition event
    socketService.emitSpreadsheetUpdate(spreadsheetId, {
      type: 'row_add',
      data: rows
    });

    res.json({
      message: 'Row added successfully',
      rows
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding row',
      error: error.message
    });
  }
};

export const updateRow = async (req, res) => {
  try {
    const { spreadsheetId, rowIndex } = req.params;
    const rowData = req.body;

    const rows = await tableDataService.updateRow(spreadsheetId, parseInt(rowIndex), rowData);
    
    // Emit the row update event
    socketService.emitSpreadsheetUpdate(spreadsheetId, {
      type: 'row_update',
      rowIndex: parseInt(rowIndex),
      data: rows
    });

    res.json({
      message: 'Row updated successfully',
      rows
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating row',
      error: error.message
    });
  }
};

export const deleteRow = async (req, res) => {
  try {
    const { spreadsheetId, rowIndex } = req.params;

    const rows = await tableDataService.deleteRow(spreadsheetId, parseInt(rowIndex));
    
    // Emit the row deletion event
    socketService.emitSpreadsheetUpdate(spreadsheetId, {
      type: 'row_delete',
      rowIndex: parseInt(rowIndex),
      data: rows
    });

    res.json({
      message: 'Row deleted successfully',
      rows
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting row',
      error: error.message
    });
  }
}; 