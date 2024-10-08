import { useState, useEffect, useLayoutEffect } from "react";
import type { UserData } from "../interfaces/UserData"; 
import { retrieveUsers } from "../api/userAPI";
import { retrieveSongs } from "../api/songsAPI";
import SearchBar from "../components/SearchBar";
import SampleCard from "../components/SampleCard";
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
      // Request to your backend for song search
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
            <SearchBar onSearch={handleSongSearch} />
          </div>
          {/* UserList(?) and SampleCard will be deleted once we start rendering. 
              container/containerBG may need to be changed*/}
          <div style={{ marginTop: "-20px" }}> 
            <UserList users={users} />
          </div>
          <div className="container">
            {songs.map((song: any, index: number) => (
              <div key={index} className="container containerBG" style={{ margin: "0 10px" }}>
                <SampleCard title={song.track.track_name} artist={song.track.artist_name} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
