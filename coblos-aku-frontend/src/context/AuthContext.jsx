import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = Guest, Object = Candidate
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Generate Guest ID jika belum ada
    let sid = localStorage.getItem('voter_session');
    if (!sid) {
      sid = 'guest-' + Date.now() + Math.random();
      localStorage.setItem('voter_session', sid);
    }
    setSessionId(sid);

    // Cek sesi kandidat
    const savedUser = localStorage.getItem('candidate_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const loginCandidate = (userData) => {
    setUser(userData);
    localStorage.setItem('candidate_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('candidate_user');
  };

  return (
    <AuthContext.Provider value={{ user, sessionId, loginCandidate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);