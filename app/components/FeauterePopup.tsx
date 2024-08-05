import React from "react";

interface FeaturePopupProps {
  onCancel: () => void;
  onDelete: () => void;
  x: number;
  y: number;
}

const FeaturePopup: React.FC<FeaturePopupProps> = ({
  onCancel,
  onDelete,
  x,
  y,
}) => {
  return (
    <div className="feature-popup">
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onDelete}>Delete</button>
      <style jsx>{`
        .feature-popup {
          background: white;
          border: 1px solid #ccc;
          padding: 5px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }
        .feature-popup button {
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
};

export default FeaturePopup;
