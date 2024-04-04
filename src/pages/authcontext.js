import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './FirebaseConfig';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false)

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('user', user)
      setIsAuthenticated(user)
      setLoading(true)
    });
    return () => unsubscribe();
  }, []);


  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
export { AuthContext }