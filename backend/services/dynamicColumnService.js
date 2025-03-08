import DynamicColumn from '../models/DynamicColumn.js';

class DynamicColumnService {
  async getColumns(spreadsheetId) {
    try {
      const columnData = await DynamicColumn.findOne({ spreadsheetId });
      return columnData?.columns || [];
    } catch (error) {
      console.error('Error getting columns:', error);
      throw error;
    }
  }

  async addColumn(spreadsheetId, columnData) {
    try {
      const { name, type, defaultValue, validation } = columnData;
      
      let document = await DynamicColumn.findOne({ spreadsheetId });
      
      if (!document) {
        document = new DynamicColumn({
          spreadsheetId,
          columns: []
        });
      }

      // Get the next order number
      const nextOrder = document.columns.length > 0 
        ? Math.max(...document.columns.map(col => col.order)) + 1 
        : 0;

      // Add the new column
      document.columns.push({
        name,
        type,
        order: nextOrder,
        defaultValue,
        validation
      });

      await document.save();
      return document.columns;
    } catch (error) {
      console.error('Error adding column:', error);
      throw error;
    }
  }

  async updateColumn(spreadsheetId, columnName, updateData) {
    try {
      const document = await DynamicColumn.findOne({ spreadsheetId });
      if (!document) {
        throw new Error('Spreadsheet not found');
      }

      const columnIndex = document.columns.findIndex(col => col.name === columnName);
      if (columnIndex === -1) {
        throw new Error('Column not found');
      }

      // Update the column properties
      Object.assign(document.columns[columnIndex], updateData);
      await document.save();
      
      return document.columns;
    } catch (error) {
      console.error('Error updating column:', error);
      throw error;
    }
  }

  async deleteColumn(spreadsheetId, columnName) {
    try {
      const document = await DynamicColumn.findOne({ spreadsheetId });
      if (!document) {
        throw new Error('Spreadsheet not found');
      }

      document.columns = document.columns.filter(col => col.name !== columnName);
      await document.save();
      
      return document.columns;
    } catch (error) {
      console.error('Error deleting column:', error);
      throw error;
    }
  }

  async reorderColumns(spreadsheetId, columnOrder) {
    try {
      const document = await DynamicColumn.findOne({ spreadsheetId });
      if (!document) {
        throw new Error('Spreadsheet not found');
      }

      // Update the order of each column
      columnOrder.forEach((columnName, index) => {
        const column = document.columns.find(col => col.name === columnName);
        if (column) {
          column.order = index;
        }
      });

      // Sort columns by order
      document.columns.sort((a, b) => a.order - b.order);
      await document.save();
      
      return document.columns;
    } catch (error) {
      console.error('Error reordering columns:', error);
      throw error;
    }
  }
}

export default new DynamicColumnService(); 