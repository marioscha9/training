// import React, { useState } from "react";
// import styles from "./CustomPrintDialog.module.css";

// interface CustomPrintDialogProps {
//   open: boolean;
//   onClose: () => void;
//   onPrint: (options: PrintOptions) => void;
// }

// interface PrintOptions {
//   orientation: "portrait" | "landscape";
//   size: "A4" | "A3";
//   format: "pdf" | "image";
//   legend: boolean;
//   northArrow: boolean;
//   title: string;
// }

// const CustomPrintDialog: React.FC<CustomPrintDialogProps> = ({
//   open,
//   onClose,
//   onPrint,
// }) => {
//   const [orientation, setOrientation] = useState<"portrait" | "landscape">(
//     "portrait"
//   );
//   const [size, setSize] = useState<"A4" | "A3">("A4");
//   const [format, setFormat] = useState<"pdf" | "image">("pdf");
//   const [legend, setLegend] = useState(false);
//   const [northArrow, setNorthArrow] = useState(false);
//   const [title, setTitle] = useState("");

//   if (!open) {
//     return null;
//   }

//   const handlePrint = () => {
//     onPrint({ orientation, size, format, legend, northArrow, title });
//     onClose();
//   };

//   return (
//     <div className={styles.dialog}>
//       <div className={styles.dialogContent}>
//         <h2>Print Options</h2>
//         <label>
//           Orientation:
//           <select
//             value={orientation}
//             onChange={(e) =>
//               setOrientation(e.target.value as "portrait" | "landscape")
//             }
//           >
//             <option value="portrait">Portrait</option>
//             <option value="landscape">Landscape</option>
//           </select>
//         </label>
//         <label>
//           Size:
//           <select
//             value={size}
//             onChange={(e) => setSize(e.target.value as "A4" | "A3")}
//           >
//             <option value="A4">A4</option>
//             <option value="A3">A3</option>
//           </select>
//         </label>
//         <label>
//           Format:
//           <select
//             value={format}
//             onChange={(e) => setFormat(e.target.value as "pdf" | "image")}
//           >
//             <option value="pdf">PDF</option>
//             <option value="image">Image</option>
//           </select>
//         </label>
//         <label>
//           Legend:
//           <input
//             type="checkbox"
//             checked={legend}
//             onChange={(e) => setLegend(e.target.checked)}
//           />
//         </label>
//         <label>
//           North Arrow:
//           <input
//             type="checkbox"
//             checked={northArrow}
//             onChange={(e) => setNorthArrow(e.target.checked)}
//           />
//         </label>
//         <label>
//           Title:
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//         </label>
//         <button onClick={handlePrint}>Print</button>
//         <button onClick={onClose}>Cancel</button>
//       </div>
//     </div>
//   );
// };

// export default CustomPrintDialog;

// components/CustomPrintDialog.ts
import PrintDialog from "ol-ext/control/PrintDialog";
import { Map } from "ol";

class CustomPrintDialog extends PrintDialog {
  constructor(map: Map) {
    super({
      className: "custom-print-dialog",
    });
    map.addControl(this);
    this.addSubtitleField();
  }

  addSubtitleField() {}
}

export default CustomPrintDialog;
