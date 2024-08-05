// components/resetZoomButton.tsx
import React from "react";
import { Map } from "ol";
import { fromLonLat } from "ol/proj";
import styles from "./ButtonWithImage.module.css";

interface ResetZoomButtonProps {
  mapObj: React.MutableRefObject<Map | undefined>;
  onZoom: () => void;
}

const ResetZoomButton: React.FC<ResetZoomButtonProps> = ({
  mapObj,
  onZoom,
}) => {
  const resetZoom = () => {
    onZoom();
    if (mapObj.current) {
      mapObj.current.getView().setCenter(fromLonLat([33, 35]));
      mapObj.current.getView().setZoom(8);
    }
  };

  return (
    <div className={styles.homeButtonDiv}>
      <button className={styles.myButton} onClick={resetZoom}>
        <img
          src="/images/homeButton.svg"
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

export default ResetZoomButton;
