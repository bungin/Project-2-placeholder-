// SampleCard.tsx
import React from "react";

interface SampleCardProps {
  title: string;
  artist: string;
}

const SampleCard: React.FC<SampleCardProps> = ({ title, artist }) => {
  return (
    <div className="sample-card">
      <h3>{title}</h3>
      <p>{artist}</p>
    </div>
  );
};

export default SampleCard;
