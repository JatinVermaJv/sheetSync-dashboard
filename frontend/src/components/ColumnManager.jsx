import React, { useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useColumns } from '../context/ColumnContext';
import SortableColumn from './SortableColumn';
import AddColumnForm from './AddColumnForm';

const ColumnManager = ({ spreadsheetId }) => {
  const {
    columns,
    loading,
    error,
    fetchColumns,
    reorderColumns,
    deleteColumn
  } = useColumns();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchColumns(spreadsheetId);
  }, [spreadsheetId]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = columns.findIndex(col => col.name === active.id);
      const newIndex = columns.findIndex(col => col.name === over.id);
      
      const newColumns = arrayMove(columns, oldIndex, newIndex);
      const columnOrder = newColumns.map(col => col.name);
      
      try {
        await reorderColumns(spreadsheetId, columnOrder);
      } catch (error) {
        console.error('Error reordering columns:', error);
      }
    }
  };

  const handleDeleteColumn = async (columnName) => {
    try {
      await deleteColumn(spreadsheetId, columnName);
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading columns...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-4">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">Manage Columns</h2>
        </div>
        
        <div className="p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={columns.map(col => col.name)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {columns.map((column) => (
                  <SortableColumn
                    key={column.name}
                    column={column}
                    onDelete={() => handleDeleteColumn(column.name)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">Add New Column</h2>
        </div>
        <AddColumnForm
          spreadsheetId={spreadsheetId}
          onSuccess={() => fetchColumns(spreadsheetId)}
        />
      </div>
    </div>
  );
};

export default ColumnManager; 