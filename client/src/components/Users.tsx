import React from "react";
import '../index.css';
import type { UserData } from "../interfaces/UserData";
import auth from "../utils/auth";

// Define the props for the component
interface UserListProps {
  users: UserData[] | null; // users can be an array of UserData objects or null
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <>
      <div className="mainCont">
        <h2 className="">
          Hey {auth.getProfile().username}, Check out all your friends!
        </h2>
        {users &&
          users.map((user) => (
            <div className="" key={user.id}>
              <div className="">
                <h3>
                  {user.id}. {user.username}
                </h3>
              </div>
              <div className="">
                <h4>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </h4>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default UserList;
