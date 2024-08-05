import React from "react";
import styles from "./ButtonWithImage.module.css";

interface PrevNextButtonsProps {
  currentPositionIndex: number;
  positions: number[][];
  onPrev: () => void;
  onNext: () => void;
}

const PrevNextButtons: React.FC<PrevNextButtonsProps> = ({
  currentPositionIndex,
  positions,
  onPrev,
  onNext,
}) => {
  return (
    // <div>
    //   <button
    //     onClick={onPrev}
    //     disabled={currentPositionIndex <= 0}
    //     className="reset-zoom-button"
    //   >
    //     Prev
    //   </button>
    <div className={styles.previousButtonDiv}>
      <button
        className={styles.myButton}
        onClick={onPrev}
        disabled={currentPositionIndex <= 0}
      >
        <img
          src="/images/next-button-icon.svg"
          alt="Home"
          style={{
            width: "20px",
            height: "20px",
            filter: "brightness(0) invert(1)",
            rotate: "180deg",
            verticalAlign: "middle",
          }}
        />
      </button>

      <button
        onClick={onNext}
        disabled={currentPositionIndex >= positions.length - 1}
        className={styles.myButton}
      >
        <img
          src="/images/next-button-icon.svg"
          alt="Home"
          style={{
            width: "20px",
            height: "20px",
            filter: "brightness(0) invert(1)",
            verticalAlign: "middle",
          }}
        />
      </button>
    </div>
  );
};

export default PrevNextButtons;
