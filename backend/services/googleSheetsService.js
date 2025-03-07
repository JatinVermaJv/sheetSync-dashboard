import { google } from 'googleapis';

class GoogleSheetsService {
  constructor(credentials) {
    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async createSpreadsheet(title) {
    try {
      const response = await this.sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title
          }
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating spreadsheet:', error);
      throw error;
    }
  }

  async getSpreadsheetData(spreadsheetId, range) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
      return response.data.values;
    } catch (error) {
      console.error('Error reading spreadsheet:', error);
      throw error;
    }
  }

  async updateSpreadsheetData(spreadsheetId, range, values) {
    try {
      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating spreadsheet:', error);
      throw error;
    }
  }

  async appendSpreadsheetData(spreadsheetId, range, values) {
    try {
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error appending to spreadsheet:', error);
      throw error;
    }
  }
}

export default GoogleSheetsService; 