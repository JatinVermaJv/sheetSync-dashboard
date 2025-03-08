import TableData from '../models/TableData.js';
import dynamicColumnService from './dynamicColumnService.js';

class TableDataService {
  async getTableData(spreadsheetId) {
    try {
      const tableData = await TableData.findOne({ spreadsheetId });
      const columns = await dynamicColumnService.getColumns(spreadsheetId);
      
      return {
        columns,
        rows: tableData?.rows || []
      };
    } catch (error) {
      console.error('Error getting table data:', error);
      throw error;
    }
  }

  async addRow(spreadsheetId, rowData) {
    try {
      let tableData = await TableData.findOne({ spreadsheetId });
      
      if (!tableData) {
        tableData = new TableData({
          spreadsheetId,
          rows: []
        });
      }

      // Validate row data against columns
      const columns = await dynamicColumnService.getColumns(spreadsheetId);
      this.validateRowData(rowData, columns);

      // Add the new row
      tableData.rows.push({
        data: new Map(Object.entries(rowData))
      });

      await tableData.save();
      return tableData.rows;
    } catch (error) {
      console.error('Error adding row:', error);
      throw error;
    }
  }

  async updateRow(spreadsheetId, rowIndex, rowData) {
    try {
      const tableData = await TableData.findOne({ spreadsheetId });
      if (!tableData || !tableData.rows[rowIndex]) {
        throw new Error('Row not found');
      }

      // Validate row data against columns
      const columns = await dynamicColumnService.getColumns(spreadsheetId);
      this.validateRowData(rowData, columns);

      // Update the row
      tableData.rows[rowIndex].data = new Map(Object.entries(rowData));
      tableData.rows[rowIndex].updatedAt = new Date();

      await tableData.save();
      return tableData.rows;
    } catch (error) {
      console.error('Error updating row:', error);
      throw error;
    }
  }

  async deleteRow(spreadsheetId, rowIndex) {
    try {
      const tableData = await TableData.findOne({ spreadsheetId });
      if (!tableData || !tableData.rows[rowIndex]) {
        throw new Error('Row not found');
      }

      tableData.rows.splice(rowIndex, 1);
      await tableData.save();
      
      return tableData.rows;
    } catch (error) {
      console.error('Error deleting row:', error);
      throw error;
    }
  }

  validateRowData(rowData, columns) {
    for (const column of columns) {
      const value = rowData[column.name];

      // Check required fields
      if (column.validation?.required && (value === undefined || value === null || value === '')) {
        throw new Error(`${column.name} is required`);
      }

      if (value !== undefined && value !== null) {
        // Type validation
        switch (column.type) {
          case 'number':
          case 'currency':
            if (isNaN(Number(value))) {
              throw new Error(`${column.name} must be a number`);
            }
            if (column.validation?.min !== undefined && value < column.validation.min) {
              throw new Error(`${column.name} must be at least ${column.validation.min}`);
            }
            if (column.validation?.max !== undefined && value > column.validation.max) {
              throw new Error(`${column.name} must be at most ${column.validation.max}`);
            }
            break;

          case 'date':
            if (isNaN(Date.parse(value))) {
              throw new Error(`${column.name} must be a valid date`);
            }
            break;

          case 'boolean':
            if (typeof value !== 'boolean') {
              throw new Error(`${column.name} must be a boolean`);
            }
            break;

          case 'text':
            if (typeof value !== 'string') {
              throw new Error(`${column.name} must be text`);
            }
            if (column.validation?.pattern) {
              const regex = new RegExp(column.validation.pattern);
              if (!regex.test(value)) {
                throw new Error(`${column.name} does not match the required pattern`);
              }
            }
            break;
        }
      }
    }
  }
}

export default new TableDataService(); 