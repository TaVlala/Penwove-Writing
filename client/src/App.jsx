import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Start from './pages/Start';
import Room from './pages/Room';

export const UserContext = createContext(null);

export function useUser() {
  return useContext(UserContext);
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  useEffect(() => {
    const storedUser = localStorage.getItem('collab_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parsedUser.id, name: parsedUser.name, color: parsedUser.color })
      })
        .then(response => response.json())
        .then(updatedUser => {
          setUser(updatedUser);
          localStorage.setItem('collab_user', JSON.stringify(updatedUser));
        })
        .catch(() => setUser(parsedUser))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (name, existingId, color) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, id: existingId, color })
    });
    const loggedInUser = await response.json();
    setUser(loggedInUser);
    localStorage.setItem('collab_user', JSON.stringify(loggedInUser));
    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('collab_user');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, login, logout, theme, toggleTheme }}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start" element={<Start />} />
          <Route path="/room/:id" element={<Room />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
