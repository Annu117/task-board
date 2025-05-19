import React from 'react';
import Board from './components/Board';
import { Layout } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">TaskBoard</h1>
          </div>
          <div className="text-sm text-gray-500">
            Your Kanban-style task manager
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Board />
      </main>
      
      <footer className="mt-auto py-4 px-6 bg-white border-t">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          TaskBoard App &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

export default App;