import React, { useState } from "react";
import { Map } from "ol";
import Control from "ol/control/Control";
import DragPan from "ol/interaction/DragPan";
import styles from "./ButtonWithImage.module.css";

interface DragPanButtonProps {
  mapObj: React.RefObject<Map | undefined>;
}

const DragPanButton: React.FC<DragPanButtonProps> = ({ mapObj }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleDragPan = () => {
    if (mapObj.current) {
      const interactions = mapObj.current.getInteractions();
      const dragPanInteraction = interactions
        .getArray()
        .find((interaction) => interaction instanceof DragPan) as DragPan;

      if (dragPanInteraction) {
        dragPanInteraction.setActive(!isActive);
      } else {
        const newDragPanInteraction = new DragPan();
        mapObj.current.addInteraction(newDragPanInteraction);
        newDragPanInteraction.setActive(true);
      }

      setIsActive(!isActive);
    }
  };

  return (
    <div className={styles.fsButtonDiv}>
      <button onClick={toggleDragPan} className={styles.myButton}>
        <img
          src="/images/drag-hand.svg"
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

export default DragPanButton;
