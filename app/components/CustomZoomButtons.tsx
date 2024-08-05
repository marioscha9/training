import React, { useEffect, useRef, useState } from "react";
import { Map as OLMap, View } from "ol";
import DragBox from "ol/interaction/DragBox";
import Control from "ol/control/Control";
import { getCenter } from "ol/extent";
import "ol/ol.css";
import styles from "./ButtonWithImage.module.css";

interface ZoomComponentProps {
  mapObj: React.MutableRefObject<OLMap | undefined>;
  onZoom: () => void;
}

const ZoomComponent: React.FC<ZoomComponentProps> = ({ mapObj, onZoom }) => {
  const [zoomInFlag, setZoomInFlag] = useState(false);
  const zoomInInteraction = useRef<DragBox | null>(null);
  const [zoomOutFlag, setZoomOutFlag] = useState(false);
  const zoomOutInteraction = useRef<DragBox | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && mapObj.current) {
      if (!zoomInInteraction.current) {
        zoomInInteraction.current = new DragBox();
        zoomInInteraction.current.on("boxend", () => {
          const zoomInExtend = zoomInInteraction
            .current!.getGeometry()
            .getExtent();
          mapObj.current?.getView().fit(zoomInExtend);
        });
      }

      if (!zoomOutInteraction.current) {
        zoomOutInteraction.current = new DragBox();
        zoomOutInteraction.current.on("boxend", () => {
          const zoomOutExtend = zoomOutInteraction
            .current!.getGeometry()
            .getExtent();
          const view = mapObj.current?.getView();
          if (view) {
            view.setCenter(getCenter(zoomOutExtend));

            const currentZoom = view.getZoom();
            if (typeof currentZoom === "number") {
              view.setZoom(currentZoom - 1);
            }
          }
        });
      }

      const element = mapObj.current.getTargetElement();
      if (element) {
        if (zoomInFlag) {
          onZoom();
          element.style.cursor = "zoom-in";
          mapObj.current?.addInteraction(zoomInInteraction.current);
          mapObj.current?.removeInteraction(zoomOutInteraction.current);
        } else if (zoomOutFlag) {
          onZoom();
          element.style.cursor = "zoom-out";
          mapObj.current?.addInteraction(zoomOutInteraction.current);
          mapObj.current?.removeInteraction(zoomInInteraction.current);
        } else {
          element.style.cursor = "";
          mapObj.current?.removeInteraction(zoomInInteraction.current);
          mapObj.current?.removeInteraction(zoomOutInteraction.current);
        }
      }
    }
  }, [zoomInFlag, zoomOutFlag, mapObj]);

  const handleZoomIn = () => {
    setZoomInFlag((prevIn) => !prevIn);
    if (!zoomInFlag) {
      setZoomOutFlag(false);
    }
  };

  const handleZoomOut = () => {
    setZoomOutFlag((prevOut) => !prevOut);
    if (!zoomOutFlag) {
      setZoomInFlag(false);
    }
  };

  return (
    <div className={styles.previousButtonDiv}>
      <button className={styles.myButton} onClick={handleZoomIn}>
        <img
          src="/images/zoom-in.svg"
          alt="Zoom In"
          style={{
            width: "20px",
            height: "20px",
            filter: "brightness(0) invert(1)",
            verticalAlign: "middle",
          }}
        />
      </button>
      <button className={styles.myButton} onClick={handleZoomOut}>
        <img
          src="/images/zoomOut.png"
          alt="Zoom Out"
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

export default ZoomComponent;
