import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import auth from "../utils/auth";

import Button from "react-bootstrap/Button";

const Navbar = () => {
  const [loginCheck, setLoginCheck] = useState(false);

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  useEffect(() => {
    console.log(loginCheck);
    checkLogin();
  }, [loginCheck]);
  return (
    <div>
      <div className="navBG">
        <h1 className="center">SoundScaped</h1>
        <div>
          {!loginCheck ? (
            <div className="">
              <p className="center" style={{ fontSize: "20px" }}>
                //--------------------------\\
                <br />
                //\__//\__//d--b//\__//\__/\\
                <br />
                \----------------------------/
              </p>
              {/* display: 'none' to hide unnecesary btn */}
              <Button style={{ display: "none" }}>
                <Link to="/login">Login</Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="center" style={{ fontSize: "20px" }}>
                //--------------------------\\
                <br />
                //\__//\__//d**b//\__//\__/\\
                <br />
                \----------------------------/
              </p>
              <Button
                className="outButton"
                onClick={() => {
                  auth.logout();
                }}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
