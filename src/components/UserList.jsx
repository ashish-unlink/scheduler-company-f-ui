import React, { useState } from "react";
import { userName } from "../utils/general";

const UserList = ({ users }) => {
  const [searchString, setSearchString] = useState("");

  const handleSearchChange = (e) => {
    setSearchString(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchString.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phoneNumber.includes(searchString)
    );
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name, email, or phone number"
        value={searchString}
        onChange={handleSearchChange}
      />
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id}>
           {userName(user?.firstName, user?.lastName)} - {user.email} - {user.phoneNumber}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
