import React from "react";
import styles from "./DrawOptionsForm.module.css";

interface DrawOptionsFormProps {
  drawType: string;
  setDrawType: React.Dispatch<React.SetStateAction<string>>;
  label: string;
  setLabel: React.Dispatch<React.SetStateAction<string>>;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  startDrawing: () => void;
}

const DrawOptionsForm: React.FC<DrawOptionsFormProps> = ({
  drawType,
  setDrawType,
  label,
  setLabel,
  color,
  setColor,
  startDrawing,
}) => {
  return (
    <div className={styles.formContainer}>
      <h3>Draw Options</h3>
      <div>
        <label>Geometry Type</label>
        <select value={drawType} onChange={(e) => setDrawType(e.target.value)}>
          <option value="Point">Point</option>
          <option value="LineString">Line</option>
          <option value="Polygon">Polygon</option>
        </select>
      </div>
      <div>
        <label>Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>
      <div>
        <label>Color</label>
        <select value={color} onChange={(e) => setColor(e.target.value)}>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="white">White</option>
          <option value="yellow">Yellow</option>
        </select>
      </div>
      <button onClick={startDrawing}>Start Drawing</button>
    </div>
  );
};

export default DrawOptionsForm;
