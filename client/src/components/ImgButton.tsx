import React, { useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onClick?: () => void;
};

const ImgButton: React.FC<Props> = ({ src, alt, className, onLoad, onClick }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="img-button">
      <button
        ref={buttonRef}
        style={{
          border: "none",
          background: "none",
          padding: isHovered ? "5px" : "0",
          cursor: "pointer",
        }}
        onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
        onLoad={onLoad}
        onClick={onClick}
      >
        <img
          src={src}
          alt={alt}
          style={{ display: 'block' }}
          className={className}
        />
      </button>
    </div>
  );
};

export default ImgButton;
