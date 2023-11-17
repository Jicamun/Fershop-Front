import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Worker from "./pages/Worker";
import Task from "./pages/Tasks";
import Monitor from "./pages/Monitor";
import { usePinCheck } from "./hooks/usePinCheck";

function App() {
  const { user } = useAuthContext();
  const { pinCheck } = usePinCheck();

  const [workMode, setWorkMode] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");

  const enableWorkMode = async (pin) => {
    try {
      console.log("enableWorkMode");
      console.log(pin, user.email);
      const isValidPin = await pinCheck(pin, user.email);
      console.log("isValidPin: " + isValidPin);
      if (isValidPin) {
        setWorkMode(!workMode);
      } else {
        alert("Wrong PIN code");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar
          workMode={workMode}
          enableWorkMode={enableWorkMode}
        />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={user ? <Home workMode={workMode} /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
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