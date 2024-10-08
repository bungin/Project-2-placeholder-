import { useState, useEffect, useLayoutEffect } from "react";
import type { UserData } from "../interfaces/UserData"; 
import { retrieveUsers } from "../api/userAPI";
import { retrieveSongs } from "../api/songsAPI";
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
  const [songs, setSongs] = useState<any[]>([]); // Storing song data

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

  const handleSongSearch = async (query: string) => {
    try {
      const data = await retrieveSongs(query);
      const songList = data.track_list;
      setSongs(songList);
    } catch (error) {
      console.error("Error fetching songs:", error);
      setError(true);
    }
  };

  if (error) {
    return <ErrorPage />;
  }

  return (
    <>
      {!loginCheck ? (
        <div>
          {showSignUp ? (
            <SignUp onSuccess={() => setLoginCheck(true)} onToggle={() => setShowSignUp(false)} />
          ) : (
            <Login 
              onSuccess={() => setLoginCheck(true)}
              onToggle={() => setShowSignUp(true)}
            />
          )}
        </div>
      ) : (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
          <div style={{ flex: 1, marginRight: "20px", overflowY: "auto" }}>
            <UserList users={users} />
          </div>
          <div style={{ width: "300px", marginLeft: "20px", overflowY: "auto", borderLeft: "1px solid #ccc" }}>
            <SearchBar onSearch={handleSongSearch} />
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              {songs.map((song: any, index: number) => (
                <li key={index} style={{ margin: "10px 0", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
                  <strong>{song.track.track_name}</strong> by {song.track.artist_name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
