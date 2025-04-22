import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LogPage from './pages/LogPage'
import Navbar from './components/Navbar'
import AdminPage from './pages/AdminPage';
import SignInPage from './pages/SignInPage';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route 
              path="/logpage"
              element={<LogPage />}
            />
            <Route
              path="/adminpage"
              element={<AdminPage />}
            />
            <Route 
              path="/"
              element={<SignInPage />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
