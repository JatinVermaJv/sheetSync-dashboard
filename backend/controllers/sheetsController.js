import GoogleSheetsService from '../services/googleSheetsService.js';
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
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error appending to spreadsheet', error: error.message });
  }
}; 