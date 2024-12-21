import { SkeletonProps } from "./types";

const Skeleton: React.FC<SkeletonProps> = ({ w, h, className }) => {
  return (
    <div
      className={`animate-pulse rounded ${className ?? ""}`}
      style={{
        width: w, height: h,
        backgroundColor: "rgba(32,32,32,.9)"
      }}
    />
  );
};

export default Skeleton;