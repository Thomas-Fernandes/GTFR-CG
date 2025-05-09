import { getArrayOfSize } from "@/common/utils/arrayUtils";

import { CardStackProps } from "./types";

import "./CardStack.scss";

const CardStack = ({ label, imgSrc, stackSize, ...divProps }: CardStackProps) => {
  return (
    <div className="card-stack" {...divProps}>
      <div className="card-stack--card top-card">
        <span className="card-stack--card--label">{label}</span>

        <div className="card-stack--card--img">
          <img src={imgSrc} alt={imgSrc} />
        </div>
      </div>

      {stackSize &&
        getArrayOfSize(stackSize).map((_, idx) => (
          <div key={idx} className={`card-stack--card absolute top-${(stackSize - idx) * 2}`} />
        ))}
    </div>
  );
};

export default CardStack;
