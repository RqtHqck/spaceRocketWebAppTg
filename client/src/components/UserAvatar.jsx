import React from 'react';
import "../styles/components/UserAvatar.css";

const UserAvatar = ({ src }) => {

  return (
    <div className="avatar-wrapper">
      <img
      src={src ? src : "/icons/profile.png"}
      className="avatar no-interaction"/>
    </div>
  )
};

export default UserAvatar;