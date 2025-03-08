import mongoose from 'mongoose';

const tableDataSchema = new mongoose.Schema({
  spreadsheetId: {
    type: String,
    required: true,
    index: true
  },
  rows: [{
    _id: false,
    data: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: new Map()
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
tableDataSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.rows) {
    this.rows.forEach(row => {
      row.updatedAt = new Date();
    });
  }
  next();
});

const TableData = mongoose.model('TableData', tableDataSchema);

export default TableData; 