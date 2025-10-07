import React from "react";
import { UserContext } from "./UserContext";

import { useContext } from "react";

export default function Results({ element, artwork }) {
  // reference the context for the "name".
  const { name } = useContext(UserContext);

  return (
    <div>
     
      <p>
        <strong>{name}</strong>, Tu elemento es: {element}
      </p>
      {artwork ? (
        <div className="artwork">
          <h2>{artwork.title}</h2>
          <img src={artwork.primaryImage} alt={artwork.title} />
          <p>{artwork.artistDisplayName}</p>
          <p>{artwork.objectDate}</p>
        </div>
      ) : (
        <p>no se encontró ninguna obra de arte.</p>
      )}
    </div>
  );
}