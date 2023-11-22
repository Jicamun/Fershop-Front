import React from 'react';
import ReactDOM from 'react-dom/client';
import '././styles/index.css';
import '././styles/header.css';
import '././styles/worker.css';
import '././styles/filter.css';
import '././styles/tasks-workers.css';
import App from './App';
import { TareasContextProvider } from './context/TareaContext';
import { WorkersContextProvider } from './context/WorkerContext';
import { AuthContextProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <TareasContextProvider>
        <WorkersContextProvider>
          <App />
        </WorkersContextProvider>
      </TareasContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);