export const TablesList = ({ tables, onTableSelect }) => {
  if (!tables.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tables created yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tables.map((table) => (
        <div
          key={table.id}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onTableSelect(table)}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{table.name}</h3>
          <p className="text-sm text-gray-500 mb-4">{table.columns.length} columns</p>
          <div className="space-y-1">
            {table.columns.map((column, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{column.name}</span>
                <span className="text-gray-400">{column.type}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 