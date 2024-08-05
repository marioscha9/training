// import React, {
//   forwardRef,
//   useEffect,
//   useImperativeHandle,
//   useRef,
// } from "react";
// import "ol/ol.css";
// import "ol-ext/dist/ol-ext.css";
// import Map from "ol/Map";
// import View from "ol/View";
// import TileLayer from "ol/layer/Tile";
// import Geoportail from "ol-ext/layer/Geoportail";
// import { defaults as defaultControls } from "ol/control";
// import LayerSwitcher from "ol-ext/control/LayerSwitcher";
// import CanvasAttribution from "ol-ext/control/CanvasAttribution";
// import CanvasTitle from "ol-ext/control/CanvasTitle";
// import Legend from "ol-ext/legend/Legend";
// import ControlLegend from "ol-ext/control/Legend";
// import CanvasScaleLine from "ol-ext/control/CanvasScaleLine";
// import PrintDialog from "ol-ext/control/PrintDialog";
// import { Style, Text, Icon } from "ol/style";
// import jsPDF from "jspdf";
// import { saveAs } from "file-saver";
// import styles from "./ButtonWithImage.module.css";

// interface PrintDialogProps {
//   map: Map | undefined;
// }

// // eslint-disable-next-line react/display-name
// const PrintComponent = forwardRef(({ map }: PrintDialogProps, ref) => {
//   const printControlRef = useRef<PrintDialog | null>(null);

//   useEffect(() => {
//     if (map) {
//       const printControl = new PrintDialog({
//         lang: "fr",
//       });
//       printControlRef.current = printControl;
//       printControl.setSize("A4");
//       map.addControl(printControl);

//       printControl.on(["print", "error"], (e: any) => {
//         if (e.image) {
//           if (e.pdf) {
//             const pdf = new jsPDF({
//               orientation: e.print.orientation,
//               unit: e.print.unit,
//               format: e.print.size,
//             });
//             pdf.addImage(
//               e.image,
//               "JPEG",
//               e.print.position[0],
//               e.print.position[1],
//               e.print.imageWidth,
//               e.print.imageHeight
//             );
//             pdf.save(e.print.legend ? "legend.pdf" : "map.pdf");
//           } else {
//             e.canvas.toBlob(
//               (blob: any) => {
//                 const name =
//                   (e.print.legend ? "legend." : "map.") +
//                   e.imageType.replace("image/", "");
//                 saveAs(blob, name);
//               },
//               e.imageType,
//               e.quality
//             );
//           }
//         } else {
//           console.warn("No canvas to export");
//         }
//       });
//     }

//     return () => {
//       if (map && printControlRef.current) {
//         map.removeControl(printControlRef.current);
//       }
//     };
//   }, [map]);

//   useImperativeHandle(ref, () => ({
//     showPrintDialog: () => {
//       if (printControlRef.current) {
//         // Trigger print dialog open here
//         printControlRef.current.print();
//       }
//     },
//   }));

//   const handlePrintClick = () => {
//     if (printControlRef.current) {
//       // Trigger print dialog open here
//       printControlRef.current.print();
//     }
//   };

//   return (
//     <div className={styles.fsButtonDiv}>
//       <button onClick={handlePrintClick} className={styles.myButton}>
//         <img
//           src="/images/printer.svg"
//           alt="Home"
//           style={{
//             width: "20px",
//             height: "20px",
//             filter: "brightness(0) invert(1)",
//             verticalAlign: "middle",
//           }}
//         />
//       </button>
//     </div>
//   );
// });

// export default PrintComponent;

// // eslint-disable-next-line react/display-name
// // import React, {
// //   forwardRef,
// //   useEffect,
// //   useImperativeHandle,
// //   useState,
// // } from "react";
// // import "ol/ol.css";
// // import "ol-ext/dist/ol-ext.css";
// // import Map from "ol/Map";
// // import jsPDF from "jspdf";
// // import { saveAs } from "file-saver";
// // import styles from "./ButtonWithImage.module.css";
// // import CustomPrintDialog from "./CustomPrintDialog";

// // interface PrintDialogProps {
// //   map: Map | undefined;
// // }

// // interface PrintOptions {
// //   orientation: "portrait" | "landscape";
// //   size: "A4" | "A3";
// //   format: "pdf" | "image";
// // }

// // // eslint-disable-next-line react/display-name
// // const PrintComponent = forwardRef(({ map }: PrintDialogProps, ref) => {
// //   const [printDialogOpen, setPrintDialogOpen] = useState(false);
// //   const [mapCanvasDataUrl, setMapCanvasDataUrl] = useState<string | null>(null);
// //   const [printOptions, setPrintOptions] = useState<PrintOptions>({
// //     orientation: "portrait",
// //     size: "A4",
// //     format: "pdf",
// //   });

// //   useImperativeHandle(ref, () => ({
// //     showPrintDialog: () => {
// //       captureMapPreview(printOptions);
// //       setPrintDialogOpen(true);
// //     },
// //   }));

// //   const handlePrintClick = () => {
// //     captureMapPreview(printOptions);
// //     setPrintDialogOpen(true);
// //   };

// //   const captureMapPreview = (options: PrintOptions) => {
// //     if (map) {
// //       map.once("rendercomplete", () => {
// //         const mapCanvas = document.createElement("canvas");
// //         const size = map.getSize();
// //         if (size) {
// //           mapCanvas.width = size[0];
// //           mapCanvas.height = size[1];
// //         }
// //         const mapContext = mapCanvas.getContext("2d");
// //         if (mapContext) {
// //           document.querySelectorAll(".ol-layer canvas").forEach((canvas) => {
// //             if (canvas.width > 0) {
// //               const opacity = canvas.parentElement?.style.opacity;
// //               mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
// //               const transform = canvas.style.transform;
// //               const matrix = transform
// //                 .match(/^matrix\(([^\(]*)\)$/)?.[1]
// //                 .split(",")
// //                 .map(Number);
// //               if (matrix) {
// //                 mapContext.setTransform(
// //                   matrix[0],
// //                   matrix[1],
// //                   matrix[2],
// //                   matrix[3],
// //                   matrix[4],
// //                   matrix[5]
// //                 );
// //               }
// //               mapContext.drawImage(canvas, 0, 0);
// //             }
// //           });
// //           setMapCanvasDataUrl(mapCanvas.toDataURL("image/png"));
// //         }
// //       });
// //       map.renderSync();
// //     }
// //   };

// //   useEffect(() => {
// //     if (printDialogOpen) {
// //       captureMapPreview(printOptions);
// //     }
// //   }, [printOptions, printDialogOpen]);

// //   const handleOptionsChange = (options: PrintOptions) => {
// //     setPrintOptions(options);
// //   };

// //   const handlePrint = (options: PrintOptions) => {
// //     if (map) {
// //       map.once("rendercomplete", () => {
// //         const mapCanvas = document.createElement("canvas");
// //         const size = map.getSize();
// //         if (size) {
// //           mapCanvas.width = size[0];
// //           mapCanvas.height = size[1];
// //         }
// //         const mapContext = mapCanvas.getContext("2d");
// //         if (mapContext) {
// //           document.querySelectorAll(".ol-layer canvas").forEach((canvas) => {
// //             if (canvas.width > 0) {
// //               const opacity = canvas.parentElement?.style.opacity;
// //               mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
// //               const transform = canvas.style.transform;
// //               const matrix = transform
// //                 .match(/^matrix\(([^\(]*)\)$/)?.[1]
// //                 .split(",")
// //                 .map(Number);
// //               if (matrix) {
// //                 mapContext.setTransform(
// //                   matrix[0],
// //                   matrix[1],
// //                   matrix[2],
// //                   matrix[3],
// //                   matrix[4],
// //                   matrix[5]
// //                 );
// //               }
// //               mapContext.drawImage(canvas, 0, 0);
// //             }
// //           });

// //           if (options.format === "pdf") {
// //             const pdf = new jsPDF({
// //               orientation: options.orientation,
// //               unit: "px",
// //               format: options.size,
// //             });
// //             pdf.addImage(mapCanvas.toDataURL("image/jpeg"), "JPEG", 0, 0);
// //             pdf.save("map.pdf");
// //           } else {
// //             mapCanvas.toBlob((blob) => {
// //               saveAs(blob, "map.png");
// //             });
// //           }
// //         }
// //       });
// //       map.renderSync();
// //     }
// //   };

// //   return (
// //     <div className={styles.fsButtonDiv}>
// //       <button onClick={handlePrintClick} className={styles.myButton}>
// //         <img
// //           src="/images/printer.svg"
// //           alt="Print"
// //           style={{
// //             width: "20px",
// //             height: "20px",
// //             filter: "brightness(0) invert(1)",
// //             verticalAlign: "middle",
// //           }}
// //         />
// //       </button>
// //       <CustomPrintDialog
// //         open={printDialogOpen}
// //         onClose={() => setPrintDialogOpen(false)}
// //         onPrint={handlePrint}
// //         onOptionsChange={handleOptionsChange}
// //         mapCanvasDataUrl={mapCanvasDataUrl}
// //       />
// //     </div>
// //   );
// // });

// // export default PrintComponent;
