// Import React and CSS styles
import React from "react";
import "./contactCardStyle.css"; // Import your CSS file for styling

// Card component
const ContactCard = ({ name, email, phoneNumber }) => {
  return (
    // <>
    //   <div className="card">
    //     <div className="card-header">
    //       <h2 className="card-name">{name}</h2>
    //     </div>
    //     <div className="card-body">
    //       <p>Email: {email}</p>
    //       <p>Phone: {phoneNumber}</p>
    //     </div>
    //   </div>
    //   <br/>
    // </>
    <div className="card">
      <h5 className="card-heading">{name}</h5>
      <p className="card-text">
        {phoneNumber} , {email}
      </p>
    </div>
  );
};

export default ContactCard;
