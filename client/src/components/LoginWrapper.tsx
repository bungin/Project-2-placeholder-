import { useState } from 'react';
import Login from '../pages/Login';

const LoginWrapper = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  // Define the onSuccess function to handle a successful login
  const handleSuccess = () => {
    console.log('Login successful!');
  };

  return (
    <Login
      onSuccess={handleSuccess}
      onToggle={() => setShowSignUp(!showSignUp)}  // Toggle between sign-up and login
    />
  );
};

export default LoginWrapper;
