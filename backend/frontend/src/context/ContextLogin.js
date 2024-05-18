/* eslint-disable react/prop-types */
// context/ContextLogin.js
import { createContext, useContext, useState } from 'react';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [userLogin, setUserLogin] = useState(false);

  return (
    <LoginContext.Provider value={{ userLogin, setUserLogin }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
