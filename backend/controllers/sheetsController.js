import GoogleSheetsService from '../services/googleSheetsService.js';

// Initialize Google Sheets service with credentials
const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');
const sheetsService = new GoogleSheetsService(credentials);

export const createSpreadsheet = async (req, res) => {
  try {
    const { title } = req.body;
    const spreadsheet = await sheetsService.createSpreadsheet(title);
    res.json(spreadsheet);
  } catch (error) {
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