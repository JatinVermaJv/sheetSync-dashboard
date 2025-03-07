import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  createSpreadsheet,
  getSpreadsheetData,
  updateSpreadsheetData,
  appendSpreadsheetData
} from '../controllers/sheetsController.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create a new spreadsheet
router.post('/create', createSpreadsheet);

// Get data from a spreadsheet
router.get('/:spreadsheetId/:range', getSpreadsheetData);

// Update data in a spreadsheet
router.put('/:spreadsheetId/:range', updateSpreadsheetData);

// Append data to a spreadsheet
router.post('/:spreadsheetId/:range', appendSpreadsheetData);

export default router; 