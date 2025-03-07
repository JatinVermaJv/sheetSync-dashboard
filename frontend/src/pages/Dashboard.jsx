import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CreateTableForm } from '../components/CreateTableForm';
import { TablesList } from '../components/TablesList';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const handleCreateTable = (tableData) => {
    const newTable = {
      id: Date.now().toString(),
      ...tableData,
    };
    setTables([...tables, newTable]);
    setShowCreateForm(false);
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header with Create Table button */}
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Tables</h2>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage your data tables
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
          >
            Create New Table
          </button>
        </div>

        {/* Main content area */}
        <div className="px-4 py-6 sm:px-0">
          {showCreateForm ? (
            <CreateTableForm
              onSubmit={handleCreateTable}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : (
            <TablesList
              tables={tables}
              onTableSelect={handleTableSelect}
            />
          )}
        </div>
      </main>
    </div>
  );
}; 