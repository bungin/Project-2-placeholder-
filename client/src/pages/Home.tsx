import { useState, useEffect, useLayoutEffect } from "react";
import type { UserData } from "../interfaces/UserData"; 
import { retrieveUsers } from "../api/userAPI";

import SearchBar from "../components/SearchBar";
import auth from "../utils/auth";
import Login from "./Login";
import SignUp from "./SignUp";
import ErrorPage from "./ErrorPage";
import UserList from "../components/Users";

const Home = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [error, setError] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    if (loginCheck) {
      fetchUsers();
    }
  }, [loginCheck]);

  useLayoutEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await retrieveUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to retrieve users:", err);
      setError(true);
    }
  };



  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className="bg1 bg2 bg3">
    {/* If not logged in, show Login or Sign-Up notice */}
    {!loginCheck ? (
        <div>
        {/* Show either Login or Sign-Up based on state */}
          {showSignUp ? (
            <SignUp onSuccess={() => setLoginCheck(true)} onToggle={() => setShowSignUp(false)} />
          ) : (
            <>
              <Login 
                onSuccess={() => setLoginCheck(true)}
                onToggle={() => setShowSignUp(true)}
              />
            </>
          )}
        </div>
      ) : (
        <>
          <div>
            <SearchBar />
          </div>
          <div> 
            <UserList users={users} />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
