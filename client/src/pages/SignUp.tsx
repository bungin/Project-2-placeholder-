import { useState, type FormEvent, type ChangeEvent } from 'react';

import Auth from '../utils/auth';
import { signup } from '../api/authAPI';
import type { UserSignup } from '../interfaces/UserSign';

const SignUp = () => {
  const [signupData, setSignupData] = useState<UserSignup>({ username: '', email: '', password: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await signup(signupData);
      Auth.login(data.token);
    } catch (err) {
      console.error('Failed to sign up', err);
    }
  };

  return (
    <form className='form signup-form' onSubmit={handleSubmit}>
      <h1>Create an Account</h1>
      <div className='form-group'>
        <label>Username</label>
        <input
          className='form-input'
          type='text'
          name='username'
          placeholder='Enter your username'
          value={signupData.username ?? ''}
          onChange={handleChange}
          required
        />
      </div>
      <div className='form-group'>
        <label>Email</label>
        <input
          className='form-input'
          type='email'
          name='email'
          placeholder='Enter your email'
          value={signupData.email ?? ''}
          onChange={handleChange}
          required
        />
      </div>
      <div className='form-group'>
        <label>Password</label>
        <input
          className='form-input'
          type='password'
          name='password'
          placeholder='Enter your password'
          value={signupData.password ?? ''}
          onChange={handleChange}
          required
        />
      </div>
      <button type='submit' className='btn'>Sign Up</button>
    </form>
  );
};

export default SignUp;
