import React, { useState } from "react";
import Map from "ol/Map";

interface PrintDialogFormProps {
  onPrint: (settings: PrintSettings) => void;
  onClose: () => void;
}

export interface PrintSettings {
  paperSize: "A4" | "A3";
  orientation: "portrait" | "landscape";
  format: "PDF" | "Image";
  includeLegend: boolean;

  mapTitle: string;
}

const PrintDialogForm: React.FC<PrintDialogFormProps> = ({
  onPrint,
  onClose,
}) => {
  const [paperSize, setPaperSize] = useState<"A4" | "A3">("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );
  const [format, setFormat] = useState<"PDF" | "Image">("PDF");
  const [includeLegend, setIncludeLegend] = useState<boolean>(false);
  const [scale, setScale] = useState<"1/5000" | "1/10000" | "1/25000">();
  const [mapTitle, setMapTitle] = useState<string>("");

  const handlePrint = () => {
    onPrint({
      paperSize,
      orientation,
      format,
      includeLegend,
      //   scale,
      mapTitle,
    });
    onClose();
  };

  return (
    <div className="print-dialog">
      <h2>Print Settings</h2>
      <label>
        Paper Size:
        <select
          value={paperSize}
          onChange={(e) => setPaperSize(e.target.value as "A4" | "A3")}
        >
          <option value="A4">A4</option>
          <option value="A3">A3</option>
        </select>
      </label>
      <label>
        Orientation:
        <select
          value={orientation}
          onChange={(e) =>
            setOrientation(e.target.value as "portrait" | "landscape")
          }
        >
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </label>
      <label>
        Format:
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as "PDF" | "Image")}
        >
          <option value="PDF">PDF</option>
          <option value="Image">Image</option>
        </select>
      </label>
      <label>
        Include Legend:
        <input
          type="checkbox"
          checked={includeLegend}
          onChange={(e) => setIncludeLegend(e.target.checked)}
        />
      </label>
      <label>
        Scale:
        <select
          value={scale}
          onChange={(e) =>
            setScale(e.target.value as "1/5000" | "1/10000" | "1/25000")
          }
        ></select>
        <option value="1/5000">1/5000</option>
        <option value="Image"></option>
      </label>
      <label>
        Map Title:
        <input
          type="text"
          value={mapTitle}
          onChange={(e) => setMapTitle(e.target.value)}
        />
      </label>
      <button onClick={handlePrint}>Print</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default PrintDialogForm;
