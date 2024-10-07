import { useState, type FormEvent, type ChangeEvent } from 'react';
import Auth from '../utils/auth';
import { signup } from '../api/authAPI';
import type { UserSignup } from '../interfaces/UserSign';

interface SignUpProps {
  onSuccess: () => void;  // A callback to notify the parent component (e.g., Home.tsx)
  onToggle: () => void;  // A callback to toggle between Login and Sign-Up
}

const SignUp: React.FC<SignUpProps> = ({ onSuccess, onToggle }) => {
  const [signupData, setSignupData] = useState<UserSignup>({ username: '', email: '', password: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Send the signup data to the backend
      const response = await signup(signupData);

      // Ensure the response is correctly formatted
      if (response && response.token) {
        console.log('Signup successful, received token:', response.token);
        Auth.login(response.token);  // Log the user in with the received token
        onSuccess();  // Notify the parent component
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (err) {
      console.error('Failed to sign up:', err);
    }
  };

  return (
    <form className='formContainer' onSubmit={handleSubmit}>
      <h1>Create an Account</h1>
      <div>
        <label>Username</label><br />
        <input
          type='text'
          name='username'
          placeholder='Enter your username'
          value={signupData.username ?? ''}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email</label><br />
        <input
          type='email'
          name='email'
          placeholder='Enter your email'
          value={signupData.email ?? ''}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password</label><br />
        <input
          type='password'
          name='password'
          placeholder='Enter your password'
          value={signupData.password ?? ''}
          onChange={handleChange}
          required
        />
      </div>
      <button type='submit' className='suBtn'>Sign Up</button>
      <p>
        Already have an account?{' '}
        <span onClick={onToggle} 
              className='link'>
          Login here
        </span>
      </p>
    </form>
  );
};

export default SignUp;
