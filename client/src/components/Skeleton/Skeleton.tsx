import React from "react";

interface SkeletonProps {
  w: string;
  h: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ w, h }) => {
  return (
    <div
      className="card-container--card animate-pulse rounded"
      style={{
        width: w, height: h,
        backgroundColor: "rgba(32,32,32,.9)"
      }}
    />
  );
};

export default Skeleton;