import React, {useState} from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';

// Pages & Components
import Home from './pages/Home'
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Worker from './pages/Worker'
import Task from './pages/Tasks'
import Monitor from './pages/Monitor'

function App() {
  const [workMode, setWorkMode] = useState(true)
  const [isAdmin, setIsAdmin] = useState(true)
  const [pinCode, setPinCode] = useState('0000')

  const enableWorkMode = (enteredPin) => {
    if (enteredPin === pinCode) {
      setWorkMode(!workMode);
    } else {
      alert('Invalid PIN code');
    }
  }

  const { user } = useAuthContext()
  
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar workMode={workMode} isAdmin={isAdmin} enableWorkMode={enableWorkMode}/>
          <div className="pages">
            <Routes>
              <Route
                path="/"
                element={user ? <Home workMode={workMode} /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/" />}
              />
              <Route
                path="/workers"
                element={user ? <Worker workMode={workMode} /> : <Navigate to="/login" />}
              />
              <Route
                path="/tasks"
                element={user ? <Task workMode={workMode} /> : <Navigate to="/login" />}
              />
              <Route
                path="/monitor"
                element={user ? <Monitor workMode={workMode} /> : <Navigate to="/login" />}
              />
            </Routes>
          </div>      
      </BrowserRouter>
    </div>
  );
}

export default App;
