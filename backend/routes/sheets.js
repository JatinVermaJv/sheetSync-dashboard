import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  createSpreadsheet,
  getSpreadsheetData,
  updateSpreadsheetData,
  appendSpreadsheetData,
  addColumn,
  getColumns,
  updateColumn,
  deleteColumn,
  reorderColumns,
  getTableData,
  addRow,
  updateRow,
  deleteRow
} from '../controllers/sheetsController.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Spreadsheet operations
router.post('/create', createSpreadsheet);
router.get('/:spreadsheetId/:range', getSpreadsheetData);
router.put('/:spreadsheetId/:range', updateSpreadsheetData);
router.post('/:spreadsheetId/:range', appendSpreadsheetData);

// Dynamic column operations
router.get('/:spreadsheetId/columns', getColumns);
router.post('/:spreadsheetId/columns', addColumn);
router.put('/:spreadsheetId/columns/:columnName', updateColumn);
router.delete('/:spreadsheetId/columns/:columnName', deleteColumn);
router.put('/:spreadsheetId/columns/reorder', reorderColumns);

// Table data operations
router.get('/:spreadsheetId/data', getTableData);
router.post('/:spreadsheetId/data', addRow);
router.put('/:spreadsheetId/data/:rowIndex', updateRow);
router.delete('/:spreadsheetId/data/:rowIndex', deleteRow);

export default router; 