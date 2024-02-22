import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div id="app" className="app-container">
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col flex-1 w-full">
          <main className="h-full overflow-y-auto">
            <div className="container grid px-6 mx-auto py-6">

              <Dashboard />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;