import React from 'react';
import { useForm } from 'react-hook-form';
import { useColumns } from '../context/ColumnContext';

const columnTypes = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'currency', label: 'Currency' }
];

const AddColumnForm = ({ spreadsheetId, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { addColumn } = useColumns();

  const onSubmit = async (data) => {
    try {
      await addColumn(spreadsheetId, {
        name: data.name,
        type: data.type,
        defaultValue: data.defaultValue,
        validation: {
          required: data.required,
          min: data.type === 'number' ? Number(data.min) : undefined,
          max: data.type === 'number' ? Number(data.max) : undefined,
          pattern: data.type === 'text' ? data.pattern : undefined
        }
      });
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error adding column:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Column Name</label>
        <input
          type="text"
          {...register('name', { required: 'Column name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Column Type</label>
        <select
          {...register('type', { required: 'Column type is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select a type</option>
          {columnTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Default Value</label>
        <input
          type="text"
          {...register('defaultValue')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('required')}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">Required</label>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Column
      </button>
    </form>
  );
};

export default AddColumnForm; 