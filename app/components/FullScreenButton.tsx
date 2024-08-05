import React from "react";
import { Map } from "ol";
import { fromLonLat } from "ol/proj";
import styles from "./ButtonWithImage.module.css";
import { FullScreen, defaults as defaultControls } from "ol/control.js";

interface FullScreenButtonProps {
  mapObj: React.MutableRefObject<Map | undefined>;
}

const FullScreenButton: React.FC<FullScreenButtonProps> = ({ mapObj }) => {
  const fullScreen = () => {
    if (mapObj.current) {
      const mapElement = mapObj.current.getTargetElement(); // Get the DOM element containing the map
      if (mapElement.requestFullscreen) {
        mapElement.requestFullscreen();
      } else if ((mapElement as any).msRequestFullscreen) {
        (mapElement as any).msRequestFullscreen();
      } else if ((mapElement as any).mozRequestFullScreen) {
        (mapElement as any).mozRequestFullScreen();
      } else if ((mapElement as any).webkitRequestFullscreen) {
        (mapElement as any).webkitRequestFullscreen();
      }
    }
  };

  return (
    <div className={styles.fsButtonDiv}>
      <button className={styles.myButton} onClick={fullScreen}>
        <img
          src="/images/fullscreen.svg"
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

export default FullScreenButton;
