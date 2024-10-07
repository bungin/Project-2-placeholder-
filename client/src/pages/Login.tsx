import { useState, type FormEvent, type ChangeEvent } from "react";
import Auth from "../utils/auth";
import { login } from "../api/authAPI";
import type { UserLogin } from "../interfaces/UserLogin";

interface LoginProps {
  onSuccess: () => void;
  onToggle: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess, onToggle }) => {
  const [loginData, setLoginData] = useState<UserLogin>({
    username: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(loginData); // Call the login API function
      Auth.login(data.token); // Log the user in with the received token
      onSuccess(); // Notify the parent component (`Home.tsx`) of successful login
    } catch (err) {
      console.error("Failed to login", err);
    }
  };

  return (
    <div className="formContainer">
      <div >
        <form onSubmit={handleSubmit}>
          <h1 className="center">Login</h1>
          <div style={{marginLeft:'40px'}}>
            <label>Username</label>
            <br />
            <input
              type="text"
              name="username"
              value={loginData.username || ""}
              onChange={handleChange}
            />
          </div>
          <div style={{marginLeft:'40px'}}>
            <label>Password</label>
            <br />
            <input
              type="password"
              name="password"
              value={loginData.password || ""}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="inButtonForm">
            Login
          </button>
          <p>
            Don't have an account?{" "}
            <span onClick={onToggle} className="link">
              Sign up here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
