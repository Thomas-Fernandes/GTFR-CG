import { SkeletonProps } from "./types";

const Skeleton: React.FC<SkeletonProps> = ({ w, h, ...divProps }) => {
  return (
    <div
      className="animate-pulse rounded"
      style={{
        width: w, height: h,
        backgroundColor: "rgba(32,32,32,.9)"
      }}
      {...divProps}
    />
  );
};

export default Skeleton;