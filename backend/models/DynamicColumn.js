import mongoose from 'mongoose';

const dynamicColumnSchema = new mongoose.Schema({
  spreadsheetId: {
    type: String,
    required: true,
    index: true
  },
  columns: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['text', 'number', 'date', 'boolean', 'currency']
    },
    order: {
      type: Number,
      required: true
    },
    defaultValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    validation: {
      required: {
        type: Boolean,
        default: false
      },
      min: Number,
      max: Number,
      pattern: String
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
dynamicColumnSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const DynamicColumn = mongoose.model('DynamicColumn', dynamicColumnSchema);

export default DynamicColumn; 