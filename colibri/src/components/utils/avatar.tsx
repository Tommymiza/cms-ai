import React from "react";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ src, name, size = 40 }) => {
  const getInitials = (name: string) => {
    const names = name?.split(" ");
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
    return initials.slice(0, 2); // Limit to 2 initials
  };

  const avatarStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ccc",
    color: "#fff",
    fontSize: size / 2,
    fontWeight: "bold",
    overflow: "hidden",
  };

  return (
    <picture>
      {src ? (
        <img src={src} alt={name || "Avatar"} style={avatarStyle} />
      ) : (
        <div style={avatarStyle}>{name ? getInitials(name) : "?"}</div>
      )}
    </picture>
  );
};

export default Avatar;
