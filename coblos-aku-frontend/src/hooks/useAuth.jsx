import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = Guest, Object = Candidate
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // 1. Generate Guest ID jika belum ada (untuk tamu)
    let sid = localStorage.getItem('voter_session');
    if (!sid) {
      sid = 'guest-' + Date.now() + Math.random();
      localStorage.setItem('voter_session', sid);
    }
    setSessionId(sid);

    // 2. Cek apakah ada data kandidat yang login (tersimpan di localStorage)
    const savedUser = localStorage.getItem('candidate_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing user data", e);
        localStorage.removeItem('candidate_user');
      }
    }
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

// Custom Hook untuk menggunakan Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
};