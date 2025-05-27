import React, { useContext } from "react";
import { UserContext } from "./UserContext";

export default function Results({ element, artwork }) {
  const { name } = useContext(UserContext);

  return (
    <div>
      <p>
        <strong>{name}</strong>, your element is: {element}
      </p>
      {artwork ? (
        <div className="artwork">
          <img src={artwork.message} alt={artwork.status} />
        </div>
      ) : (
        <p>No artwork found.</p>
      )}
    </div>
  );
}