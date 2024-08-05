// import React, { useEffect, useState } from "react";
// import { Map } from "ol";
// import printDialog from "ol-ext/control/PrintDialog";
// import styles from "./ButtonWithImage.module.css";
// import PrintDialog from "ol-ext/control/PrintDialog";
// import jsPDF from "jspdf";
// import saveAs from "file-saver";

// interface MapExportProps {
//   mapObj: React.RefObject<Map | undefined>;
// }

// const MapExport: React.FC<MapExportProps> = ({ mapObj }) => {
//   useEffect(() => {
//     const printControl = new printDialog({});
//     printControl.setSize("A4");
//     mapObj.current?.addControl(printControl);

//     const handlePrint = (e: any) => {
//       // Print success
//       if (e.image) {
//         if (e.pdf) {
//           // Export PDF using the print info
//           const pdf = new jsPDF({
//             orientation: e.print.orientation,
//             unit: e.print.unit,
//             format: e.print.size,
//           });
//           pdf.addImage(
//             e.image,
//             "JPEG",
//             e.print.position[0],
//             e.print.position[0],
//             e.print.imageWidth,
//             e.print.imageHeight
//           );
//           pdf.save(e.print.legend ? "legend.pdf" : "map.pdf");
//         } else {
//           // Save image as file
//           e.canvas.toBlob(
//             (blob: Blob) => {
//               const name =
//                 (e.print.legend ? "legend." : "map.") +
//                 e.imageType.replace("image/", "");
//               saveAs(blob, name);
//             },
//             e.imageType,
//             e.quality
//           );
//         }
//       } else {
//         console.warn("No canvas to export");
//       }
//     };

//     printControl.on("print" as any, handlePrint);
//     printControl.on("error" as any, handlePrint);

//     return () => {
//       mapObj.current?.setTarget(undefined);
//     };
//   }, []);

//   return null;
//   //   (
//   //     // <div className={styles.fsButtonDiv}>
//   //     //   <button className={styles.myButton}>
//   //     //     <img
//   //     //       src="/images/printer.svg"
//   //     //       alt="Home"
//   //     //       style={{
//   //     //         width: "20px",
//   //     //         height: "20px",
//   //     //         filter: "brightness(0) invert(1)",
//   //     //         verticalAlign: "middle",
//   //     //       }}
//   //     //     />
//   //     //   </button>
//   //     // </div>
//   //   );
// };

// export default MapExport;
