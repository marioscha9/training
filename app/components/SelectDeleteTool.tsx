import React, { useEffect, useState } from "react";
import { Select } from "ol/interaction";
import { Map } from "ol";
import { singleClick } from "ol/events/condition";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style, Text, Circle as CircleStyle } from "ol/style";
import styles from "./ButtonWithImage.module.css";

interface SelectDeleteToolProps {
  mapObj: React.RefObject<Map | undefined>;
  source: VectorSource;
  isSelectToolEnabled: boolean;
  onSelectToolToggle: () => void;
  onEditFeature: (feature: any) => void;
}

const SelectDeleteTool: React.FC<SelectDeleteToolProps> = ({
  mapObj,
  source,
  isSelectToolEnabled,
  onSelectToolToggle,
  onEditFeature,
}) => {
  const [select, setSelect] = useState<Select | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);

  useEffect(() => {
    if (!mapObj.current) return;

    if (isSelectToolEnabled) {
      const newSelect = new Select({ condition: singleClick, hitTolerance: 5 });
      mapObj.current.addInteraction(newSelect);
      newSelect.on("select", (e) => {
        if (e.selected.length > 0) {
          setSelectedFeature(e.selected[0]);
        } else {
          setSelectedFeature(null);
        }
      });

      setSelect(newSelect);
    } else if (select) {
      mapObj.current.removeInteraction(select);
      setSelect(null);
      setSelectedFeature(null);
    }
  }, [mapObj, isSelectToolEnabled]);

  const cancelSelection = () => {
    setSelectedFeature(null);
  };

  const deleteFeature = () => {
    if (selectedFeature) {
      const overlays = mapObj.current?.getOverlays().getArray() || [];
      overlays.forEach((overlay) => {
        if (overlay.get("featureId") === selectedFeature.getId()) {
          mapObj.current?.removeOverlay(overlay);
        }
      });
      source.removeFeature(selectedFeature);
      setSelectedFeature(null);
    }
  };
  const editFeature = () => {
    if (selectedFeature) {
      console.log(selectedFeature);
      const isDrawNote = selectedFeature.values_.drawNote;
      if (isDrawNote) {
        onEditFeature(selectedFeature);
      } else {
        alert(
          "can't edit this feature because is not part of the Draw Note Tool"
        );
      }
    }
  };

  return (
    <div className={styles.fsButtonDiv}>
      <button className={styles.myButton} onClick={onSelectToolToggle}>
        <img
          src="/images/cursor-selection.svg"
          alt="Select Tool"
          style={{
            width: "20px",
            height: "20px",
            filter: "brightness(0) invert(1)",
            verticalAlign: "middle",
          }}
        />
      </button>
      {selectedFeature && (
        <div className={styles.previousButtonDiv}>
          <button className={styles.myButton} onClick={cancelSelection}>
            <img
              src="/images/cancel.svg"
              alt="Cancel"
              style={{
                width: "20px",
                height: "20px",
                filter: "brightness(0) invert(1)",
                verticalAlign: "middle",
              }}
            />
          </button>
          <button className={styles.myButton} onClick={deleteFeature}>
            <img
              src="/images/delete.svg"
              alt="Delete"
              style={{
                width: "20px",
                height: "20px",
                filter: "brightness(0) invert(1)",
                verticalAlign: "middle",
              }}
            />
          </button>
          <button className={styles.myButton} onClick={editFeature}>
            <img
              src="/images/edit-button.svg"
              alt="Edit"
              style={{
                width: "20px",
                height: "20px",
                filter: "brightness(0) invert(1)",
                verticalAlign: "middle",
              }}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectDeleteTool;
