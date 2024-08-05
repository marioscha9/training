// import { unByKey as ol_Observable_unByKey } from "ol/Observable";
// import Control from "ol/control/Control";
// import Stroke from "ol/style/Stroke";
// import ol_ext_element from "./utils/element";
// import Dialog from "./Dialog";
// import Legend from "./Legend";
// import Print from "./Print";
// import CanvasTitle from "./CamvasTItle";
// import { getMapScale as ol_sphere_getMapScale } from "../geom/sphere.js";
// import { setMapScale as ol_sphere_setMapScale } from "../geom/sphere.js";
// import Compass from "./Compass";

// interface Options {
//   className?: string;
//   title?: string;
//   lang?: string;
//   target?: HTMLElement | string;
//   targetDialog?: HTMLElement | string;
//   imageType?: string;
//   quality?: number;
//   orientation?: string;
//   immediate?: boolean;
//   openWindow?: boolean;
//   copy?: boolean;
//   save?: boolean;
//   pdf?: boolean;
//   saveAs?: (blob: Blob, name: string) => void;
//   jsPDF?: any;
//   northImage?: string;
// }

// class PrintDialog extends Control {
//   private _lang: string;
//   private _printCtrl: Print;
//   private _compass: Compass;
//   private _printDialog: Dialog;
//   private _input: any;
//   private _pages: HTMLElement[];
//   private formats: any[];
//   private paperSize: { [key: string]: number[] | null };
//   private marginSize: { [key: string]: number };
//   private scales: { [key: string]: string };

//   constructor(options: Options = {}) {
//     const element = ol_ext_element.create("DIV", {
//       className:
//         (options.className || "ol-print") + " ol-unselectable ol-control",
//     });
//     super({ element });

//     this._lang = options.lang || "en";
//     if (!options.target) {
//       ol_ext_element.create("BUTTON", {
//         type: "button",
//         title: options.title || "Print",
//         click: () => this.print(),
//         parent: element,
//       });
//     }

//     if (options.openWindow) {
//       this.on("print", (e: any) => {
//         if (e.canvas) {
//           window
//             .open()
//             .document.write('<img src="' + e.canvas.toDataURL() + '"/>');
//         }
//       });
//     }

//     options.target = ol_ext_element.create("DIV");
//     this._printCtrl = new Print(options);
//     this._printCtrl.on(["print", "error", "printing"], (e: any) =>
//       this._printing(e)
//     );

//     this._compass = new Compass({
//       src: options.northImage || "compact",
//       visible: false,
//       className: "olext-print-compass",
//       style: new Stroke({ color: "#333", width: 0 }),
//     });

//     this._printDialog = new Dialog({
//       target: options.targetDialog || document.body,
//       closeBox: true,
//       className: "ol-ext-print-dialog",
//     });

//     this._input = {};
//     this._pages = [ol_ext_element.create("DIV", { className: "ol-page" })];
//     const printMap = ol_ext_element.create("DIV", {
//       className: "ol-map",
//       parent: this._pages[0],
//     });

//     ol_ext_element.create("DIV", {
//       html: this._pages[0],
//       className: "ol-print-map",
//       parent: this._printDialog.getContentElement(),
//     });
//     ol_ext_element.create("H2", {
//       html: this.i18n("title"),
//       parent: this._printDialog.getContentElement(),
//     });
//     const ul = ol_ext_element.create("UL", {
//       parent: this._printDialog.getContentElement(),
//     });

//     const li = ol_ext_element.create("LI", {
//       className: "ol-orientation",
//       parent: ul,
//     });
//     this._input.orientation = { list: li };
//     let label = ol_ext_element.create("LABEL", {
//       className: "portrait",
//       parent: li,
//     });
//     this._input.orientation.portrait = ol_ext_element.create("INPUT", {
//       type: "radio",
//       name: "ol-print-orientation",
//       value: "portrait",
//       checked: true,
//       on: {
//         change: (e: Event) =>
//           this.setOrientation((e.target as HTMLInputElement).value),
//       },
//       parent: label,
//     });
//     ol_ext_element.create("SPAN", {
//       html: this.i18n("portrait"),
//       parent: label,
//     });

//     label = ol_ext_element.create("LABEL", {
//       className: "landscape",
//       parent: li,
//     });
//     this._input.orientation.landscape = ol_ext_element.create("INPUT", {
//       type: "radio",
//       name: "ol-print-orientation",
//       value: "landscape",
//       on: {
//         change: (e: Event) =>
//           this.setOrientation((e.target as HTMLInputElement).value),
//       },
//       parent: label,
//     });
//     ol_ext_element.create("SPAN", {
//       html: this.i18n("landscape"),
//       parent: label,
//     });

//     const s: string = "";
//     const liSize = ol_ext_element.create("LI", {
//       html: ol_ext_element.create("LABEL", { html: this.i18n("size") }),
//       className: "ol-size",
//       parent: ul,
//     });
//     const size = (this._input.size = ol_ext_element.create("SELECT", {
//       on: {
//         change: () => this.setSize(size.value || originalSize),
//       },
//       parent: liSize,
//     }));
//     for (s in this.paperSize) {
//       ol_ext_element.create("OPTION", {
//         html:
//           s +
//           (this.paperSize[s]
//             ? " - " +
//               this.paperSize[s]![0] +
//               "x" +
//               this.paperSize[s]![1] +
//               " mm"
//             : this.i18n("custom")),
//         value: s,
//         parent: size,
//       });
//     }

//     const liMargin = ol_ext_element.create("LI", {
//       html: ol_ext_element.create("LABEL", { html: this.i18n("margin") }),
//       className: "ol-margin",
//       parent: ul,
//     });
//     const margin = (this._input.margin = ol_ext_element.create("SELECT", {
//       on: {
//         change: () => this.setMargin(margin.value),
//       },
//       parent: liMargin,
//     }));
//     for (s in this.marginSize) {
//       ol_ext_element.create("OPTION", {
//         html: this.i18n(s) + " - " + this.marginSize[s] + " mm",
//         value: this.marginSize[s],
//         parent: margin,
//       });
//     }

//     const liScale = ol_ext_element.create("LI", {
//       html: ol_ext_element.create("LABEL", { html: this.i18n("scale") }),
//       className: "ol-scale",
//       parent: ul,
//     });
//     const scale = (this._input.scale = ol_ext_element.create("SELECT", {
//       on: {
//         change: () => this.setScale(parseInt(scale.value)),
//       },
//       parent: liScale,
//     }));
//     Object.keys(this.scales).forEach((s: string) => {
//       ol_ext_element.create("OPTION", {
//         html: this.scales[s],
//         value: s,
//         parent: scale,
//       });
//     });

//     const liLegend = ol_ext_element.create("LI", {
//       className: "ol-legend",
//       parent: ul,
//     });
//     const legend = ol_ext_element.createSwitch({
//       html: this.i18n("legend"),
//       checked: false,
//       on: {
//         change: () => extraCtrl.legend.control.setCanvas(legend.checked),
//       },
//       parent: liLegend,
//     });

//     const liNorth = ol_ext_element.create("LI", {
//       className: "ol-print-north",
//       parent: ul,
//     });
//     const north = (this._input.north = ol_ext_element.createSwitch({
//       html: this.i18n("north"),
//       checked: "checked",
//       on: {
//         change: () => {
//           if (north.checked)
//             this._compass.element.classList.add("ol-print-compass");
//           else this._compass.element.classList.remove("ol-print-compass");
//           this.getMap().render();
//         },
//       },
//       parent: liNorth,
//     }));

//     const liTitle = ol_ext_element.create("LI", {
//       className: "ol-print-title",
//       parent: ul,
//     });
//     const title = ol_ext_element.createSwitch({
//       html: this.i18n("mapTitle"),
//       checked: false,
//       on: {
//         change: (e: Event) =>
//           extraCtrl.title.control.setVisible(
//             (e.target as HTMLInputElement).checked
//           ),
//       },
//       parent: liTitle,
//     });
//     const titleText = ol_ext_element.create("INPUT", {
//       type: "text",
//       placeholder: this.i18n("mapTitle"),
//       on: {
//         keydown: (e: KeyboardEvent) => {
//           if (e.keyCode === 13) e.preventDefault();
//         },
//         keyup: () => extraCtrl.title.control.setTitle(titleText.value),
//         change: () => extraCtrl.title.control.setTitle(titleText.value),
//       },
//       parent: liTitle,
//     });

//     const userElt = ol_ext_element.create("DIV", {
//       className: "ol-user-param",
//       parent: this._printDialog.getContentElement(),
//     });

//     const liSave = ol_ext_element.create("LI", {
//       className: "ol-saveas",
//       parent: ul,
//     });
//     ol_ext_element.create("DIV", {
//       html: this.i18n("copied"),
//       className: "ol-clipboard-copy",
//       parent: liSave,
//     });
//     const save = ol_ext_element.create("SELECT", {
//       on: {
//         change: () => {
//           const saveas = save.value;
//           save.value = "";
//           if (this.formats[saveas].clipboard) {
//             if (this._copyMap(saveas)) return;
//           }
//           const format =
//             typeof this.getSize() === "string" ? this.getSize() : null;
//           const opt = Object.assign(
//             {
//               format: format,
//               size: format ? this.paperSize[format] : null,
//               orient: this.getOrientation(),
//               margin: this.getMargin(),
//             },
//             this.formats[saveas]
//           );
//           printCtrl.print(opt);
//         },
//       },
//       parent: liSave,
//     });
//     ol_ext_element.create("OPTION", {
//       html: this.i18n("saveas"),
//       style: { display: "none" },
//       value: "",
//       parent: save,
//     });
//     this.formats.forEach((format, i) => {
//       if (format.pdf) {
//         if (options.pdf === false) return;
//       } else if (format.clipboard) {
//         if (options.copy === false) return;
//       } else if (options.save === false) {
//         return;
//       }
//       ol_ext_element.create("OPTION", {
//         html: this.i18n(format.title),
//         value: i,
//         parent: save,
//       });
//     });

//     const liSaveLegend = ol_ext_element.create("LI", {
//       className: "ol-savelegend",
//       parent: ul,
//     });
//     const copylegend = ol_ext_element.create("DIV", {
//       html: this.i18n("copied"),
//       className: "ol-clipboard-copy",
//       parent: liSaveLegend,
//     });
//     const saveLegend = ol_ext_element.create("SELECT", {
//       on: {
//         change: () => {
//           const clegend = extraCtrl.legend.control.getLegend().getCanvas();
//           const canvas = document.createElement("CANVAS");
//           canvas.width = clegend.width;
//           canvas.height = clegend.height;
//           const ctx = canvas.getContext("2d");
//           ctx.fillStyle = "#fff";
//           ctx.fillRect(0, 0, canvas.width, canvas.height);
//           ctx.drawImage(clegend, 0, 0);

//           if (this.formats[saveLegend.value].clipboard) {
//             canvas.toBlob((blob) => {
//               try {
//                 navigator.clipboard.write([
//                   new window.ClipboardItem(
//                     Object.defineProperty({}, blob.type, {
//                       value: blob,
//                       enumerable: true,
//                     })
//                   ),
//                 ]);
//                 copylegend.classList.add("visible");
//                 setTimeout(() => copylegend.classList.remove("visible"), 1000);
//               } catch (err) {}
//             }, "image/png");
//           } else {
//             try {
//               const image = canvas.toDataURL(
//                 this.formats[saveLegend.value].imageType,
//                 this.formats[saveLegend.value].quality
//               );
//               const format =
//                 typeof this.getSize() === "string" ? this.getSize() : "A4";
//               const w = (canvas.width / 96) * 25.4;
//               const h = (canvas.height / 96) * 25.4;
//               const size = this.paperSize[format];
//               if (this.getOrientation() === "landscape")
//                 size = [size[1], size[0]];
//               const position = [(size[0] - w) / 2, (size[1] - h) / 2];
//               this.dispatchEvent({
//                 type: "print",
//                 print: {
//                   legend: true,
//                   format: format,
//                   orientation: this.getOrientation(),
//                   unit: "mm",
//                   size: this.paperSize[format],
//                   position: position,
//                   imageWidth: w,
//                   imageHeight: h,
//                 },
//                 image: image,
//                 imageType: this.formats[saveLegend.value].imageType,
//                 pdf: this.formats[saveLegend.value].pdf,
//                 quality: this.formats[saveLegend.value].quality,
//                 canvas: canvas,
//               });
//             } catch (err) {}
//           }
//           saveLegend.value = "";
//         },
//       },
//       parent: liSaveLegend,
//     });
//     ol_ext_element.create("OPTION", {
//       html: this.i18n("saveLegend"),
//       style: { display: "none" },
//       value: "",
//       parent: saveLegend,
//     });
//     this.formats.forEach((format, i) =>
//       ol_ext_element.create("OPTION", {
//         html: this.i18n(format.title),
//         value: i,
//         parent: saveLegend,
//       })
//     );

//     const prButtons = ol_ext_element.create("DIV", {
//       className: "ol-ext-buttons",
//       parent: this._printDialog.getContentElement(),
//     });
//     ol_ext_element.create("BUTTON", {
//       html: this.i18n("printBt"),
//       type: "submit",
//       click: (e: Event) => {
//         e.preventDefault();
//         window.print();
//       },
//       parent: prButtons,
//     });
//     ol_ext_element.create("BUTTON", {
//       html: this.i18n("cancel"),
//       type: "button",
//       click: () => this._printDialog.hide(),
//       parent: prButtons,
//     });
//     ol_ext_element.create("DIV", {
//       html: this.i18n("errorMsg"),
//       className: "ol-error",
//       parent: this._printDialog.getContentElement(),
//     });

//     let originalTarget: HTMLElement | null;
//     let originalSize: any;
//     let scalelistener: any;
//     let extraCtrl: any = {};
//     this._printDialog.on("show", () => {
//       this.dispatchEvent({
//         type: "show",
//         userElement: userElt,
//         dialog: this._printDialog,
//         page: this.getPage(),
//       });
//       const map = this.getMap();
//       if (!map) return;
//       document.body.classList.add("ol-print-document");
//       originalTarget = map.getTargetElement();
//       originalSize = map.getSize();
//       if (typeof this.getSize() === "string") {
//         this.setSize(this.getSize());
//       } else {
//         this.setSize(originalSize);
//       }
//       map.setTarget(printMap);

//       if (scalelistener) ol_Observable_unByKey(scalelistener);
//       scalelistener = map.on("moveend", () =>
//         this.setScale(ol_sphere_getMapScale(map))
//       );
//       this.setScale(ol_sphere_getMapScale(map));

//       extraCtrl = {};
//       this.getMap()
//         .getControls()
//         .forEach((c) => {
//           if (c instanceof Legend) {
//             extraCtrl.legend = { control: c };
//           }
//           if (c instanceof CanvasTitle) {
//             extraCtrl.title = { control: c };
//           }
//           if (c instanceof Compass) {
//             if (extraCtrl.compass) {
//               c.element.classList.remove("ol-print-compass");
//             } else {
//               if (this._input.north.checked)
//                 c.element.classList.add("ol-print-compass");
//               else c.element.classList.remove("ol-print-compass");
//               this._compass = c;
//               extraCtrl.compass = { control: c };
//             }
//           }
//         });

//       if (extraCtrl.title) {
//         title.checked = extraCtrl.title.isVisible =
//           extraCtrl.title.control.getVisible();
//         titleText.value = extraCtrl.title.control.getTitle();
//         title.parentNode!.parentNode!.classList.remove("hidden");
//       } else {
//         title.parentNode!.parentNode!.classList.add("hidden");
//       }

//       if (extraCtrl.legend) {
//         extraCtrl.legend.ison = extraCtrl.legend.control.onCanvas();
//         extraCtrl.legend.collapsed = extraCtrl.legend.control.isCollapsed();
//         extraCtrl.legend.control.collapse(false);
//         saveLegend.parentNode!.classList.remove("hidden");
//         legend.parentNode!.parentNode!.classList.remove("hidden");
//         legend.checked = !extraCtrl.legend.collapsed;
//         extraCtrl.legend.control.setCanvas(!extraCtrl.legend.collapsed);
//       } else {
//         saveLegend.parentNode!.classList.add("hidden");
//         legend.parentNode!.parentNode!.classList.add("hidden");
//       }
//     });

//     this._printDialog.on("hide", () => {
//       document.body.classList.remove("ol-print-document");
//       if (!originalTarget) return;
//       this.getMap().setTarget(originalTarget);
//       originalTarget = null;
//       if (scalelistener) ol_Observable_unByKey(scalelistener);

//       if (extraCtrl.title) {
//         extraCtrl.title.control.setVisible(extraCtrl.title.isVisible);
//       }
//       if (extraCtrl.legend) {
//         extraCtrl.legend.control.setCanvas(extraCtrl.legend.ison);
//         extraCtrl.legend.control.collapse(extraCtrl.legend.collapsed);
//       }
//       this.dispatchEvent({ type: "hide" });
//     });

//     window.addEventListener("resize", () => this.setSize());

//     if (options.saveAs) {
//       this.on("print", (e: any) => {
//         if (!e.pdf) {
//           e.canvas.toBlob(
//             (blob: Blob) => {
//               const name =
//                 (e.print.legend ? "legend." : "map.") +
//                 e.imageType.replace("image/", "");
//               options.saveAs!(blob, name);
//             },
//             e.imageType,
//             e.quality
//           );
//         }
//       });
//     }

//     if (options.jsPDF) {
//       this.on("print", (e: any) => {
//         if (e.pdf) {
//           const pdf = new options.jsPDF({
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
//         }
//       });
//     }
//   }

//   static addLang(lang: string, labels: any) {
//     PrintDialog.prototype._labels[lang] = labels;
//   }

//   isOpen() {
//     return this._printDialog.isOpen();
//   }

//   i18n(what: string) {
//     let rep = this._labels.en[what] || what;
//     if (this._labels[this._lang] && this._labels[this._lang][what]) {
//       rep = this._labels[this._lang][what];
//     }
//     return rep;
//   }

//   getOrientation() {
//     return this._orientation || "portrait";
//   }

//   setOrientation(ori: string) {
//     this._orientation = ori === "landscape" ? "landscape" : "portrait";
//     this._printDialog.element.dataset.orientation = this._orientation;
//     this._input.orientation[this._orientation].checked = true;
//     this.setSize();
//   }

//   getMargin() {
//     return this._margin || 0;
//   }

//   setMargin(margin: number) {
//     this._margin = margin;
//     this._input.margin.value = margin;
//     this.setSize();
//   }

//   getSize() {
//     return this._size;
//   }

//   setSize(size?: string | [number, number]) {
//     this._printDialog.getContentElement().dataset.status = "";

//     if (size) {
//       this._size = size;
//     } else {
//       size = this._size;
//     }
//     if (!size) return;

//     if (typeof size === "string") {
//       for (const k in this.paperSize) {
//         if (k && new RegExp(k, "i").test(size)) {
//           size = k;
//         }
//       }
//       if (!this.paperSize[size]) size = this._size = "A4";
//       this._input.size.value = size;
//       size = [
//         Math.trunc((this.paperSize[size]![0] * 96) / 25.4),
//         Math.trunc((this.paperSize[size]![1] * 96) / 25.4),
//       ];
//       if (this.getOrientation() === "landscape") {
//         size = [size[1], size[0]];
//       }
//       this.getPage().classList.remove("margin");
//     } else {
//       this._input.size.value = "";
//       this.getPage().classList.add("margin");
//     }

//     const printElement = this.getPage();
//     const s = printElement.parentNode!.getBoundingClientRect();
//     const scx = (s.width - 40) / size[0];
//     const scy = (s.height - 40) / size[1];
//     const sc = Math.min(scx, scy, 1);
//     printElement.style.width = size[0] + "px";
//     printElement.style.height = size[1] + "px";
//     printElement.style["-webkit-transform"] = printElement.style.transform =
//       "translate(-50%,-50%) scale(" + sc + ")";
//     const px = Math.round(5 / sc);
//     printElement.style["-webkit-box-shadow"] = printElement.style[
//       "box-shadow"
//     ] = px + "px " + px + "px " + px + "px rgba(0,0,0,.6)";
//     printElement.style["padding"] = (this.getMargin() * 96) / 25.4 + "px";

//     if (this.getMap()) {
//       this.getMap().updateSize();
//     }

//     this.dispatchEvent({ type: "dialog:refresh" });
//   }

//   private _printing(e: any) {
//     this._printDialog.getContentElement().dataset.status = e.type;
//     if (!e.clipboard) {
//       this.dispatchEvent(e);
//     }
//   }

//   private _copyMap(format: string) {
//     const copied =
//       this._printDialog.element.querySelector(".ol-clipboard-copy")!;
//     this._printCtrl.copyMap(this.formats[format], (isok: boolean) => {
//       if (isok) {
//         copied.classList.add("visible");
//         setTimeout(() => copied.classList.remove("visible"), 1000);
//       }
//     });
//     return true;
//   }

//   getContentElement() {
//     return this._printDialog.getContentElement();
//   }

//   getUserElement() {
//     return this._printDialog
//       .getContentElement()
//       .querySelector(".ol-user-param")!;
//   }

//   getPage() {
//     return this._pages[0];
//   }

//   setMap(map: any) {
//     if (this.getMap()) {
//       this.getMap().removeControl(this._compass);
//       this.getMap().removeControl(this._printCtrl);
//       this.getMap().removeControl(this._printDialog);
//     }
//     super.setMap(map);
//     if (this.getMap()) {
//       this.getMap().addControl(this._compass);
//       this.getMap().addControl(this._printCtrl);
//       this.getMap().addControl(this._printDialog);
//     }
//   }

//   setScale(value: number | string) {
//     ol_sphere_setMapScale(this.getMap(), value);
//     this._input.scale.value = " " + Math.round(value / 100) * 100;
//   }

//   getScale() {
//     return ol_sphere_getMapScale(this.getMap());
//   }

//   print(options: any) {
//     options = options || {};
//     if (options.size) this.setSize(options.size);
//     if (options.scale) this.setScale(options.scale);
//     if (options.orientation) this.setOrientation(options.orientation);
//     if (options.margin) this.setMargin(options.margin);
//     this._printDialog.show();
//   }

//   getPrintControl() {
//     return this._printCtrl;
//   }

//   private _labels: any = {
//     en: {
//       title: "Print",
//       orientation: "Orientation",
//       portrait: "Portrait",
//       landscape: "Landscape",
//       size: "Page size",
//       custom: "screen size",
//       margin: "Margin",
//       scale: "Scale",
//       legend: "Legend",
//       north: "North arrow",
//       mapTitle: "Map title",
//       saveas: "Save as...",
//       saveLegend: "Save legend...",
//       copied: "✔ Copied to clipboard",
//       errorMsg: "Can't save map canvas...",
//       printBt: "Print...",
//       clipboardFormat: "copy to clipboard...",
//       jpegFormat: "save as jpeg",
//       pngFormat: "save as png",
//       pdfFormat: "save as pdf",
//       none: "none",
//       small: "small",
//       large: "large",
//       cancel: "cancel",
//     },
//     gr: {
//       title: "Εκτύπωση",
//       orientation: "Προσανατολισμός",
//       portrait: "Κατακόρυφος",
//       landscape: "Οριζόντιος",
//       size: "Μέγεθος σελίδας",
//       custom: "μέγεθος οθόνης",
//       margin: "Περιθώριο",
//       scale: "Κλίμακα",
//       legend: "Υπόμνημα",
//       north: "Βέλος Βορρά",
//       mapTitle: "Τίτλος χάρτη",
//       saveas: "Αποθήκευση ως...",
//       saveLegend: "Αποθήκευση υπομνήματος...",
//       copied: "✔ Αντιγράφηκε στο πρόχειρο",
//       errorMsg: "Δεν είναι δυνατή η αποθήκευση του καμβά του χάρτη...",
//       printBt: "Εκτύπωση...",
//       clipboardFormat: "αντιγραφή στο πρόχειρο...",
//       jpegFormat: "αποθήκευση ως jpeg",
//       pngFormat: "αποθήκευση ως png",
//       pdfFormat: "αποθήκευση ως pdf",
//       none: "κανένα",
//       small: "μικρό",
//       large: "μεγάλο",
//       cancel: "ακύρωση",
//     },
//     fr: {
//       title: "Imprimer",
//       orientation: "Orientation",
//       portrait: "Portrait",
//       landscape: "Paysage",
//       size: "Taille du papier",
//       custom: "taille écran",
//       margin: "Marges",
//       scale: "Echelle",
//       legend: "Légende",
//       north: "Flèche du nord",
//       mapTitle: "Titre de la carte",
//       saveas: "Enregistrer sous...",
//       saveLegend: "Enregistrer la légende...",
//       copied: "✔ Carte copiée",
//       errorMsg: "Impossible d'enregistrer la carte",
//       printBt: "Imprimer",
//       clipboardFormat: "copier dans le presse-papier...",
//       jpegFormat: "enregistrer un jpeg",
//       pngFormat: "enregistrer un png",
//       pdfFormat: "enregistrer un pdf",
//       none: "aucune",
//       small: "petites",
//       large: "larges",
//       cancel: "annuler",
//     },
//     de: {
//       title: "Drucken",
//       orientation: "Ausrichtung",
//       portrait: "Hochformat",
//       landscape: "Querformat",
//       size: "Papierformat",
//       custom: "Bildschirmgröße",
//       margin: "Rand",
//       scale: "Maßstab",
//       legend: "Legende",
//       north: "Nordpfeil",
//       mapTitle: "Kartentitel",
//       saveas: "Speichern als...",
//       saveLegend: "Legende speichern...",
//       copied: "✔ In die Zwischenablage kopiert",
//       errorMsg: "Kann Karte nicht speichern...",
//       printBt: "Drucken...",
//       clipboardFormat: "in die Zwischenablage kopieren...",
//       jpegFormat: "speichern als jpeg",
//       pngFormat: "speichern als png",
//       pdfFormat: "speichern als pdf",
//       none: "kein",
//       small: "klein",
//       large: "groß",
//       cancel: "abbrechen",
//     },
//     zh: {
//       title: "打印",
//       orientation: "方向",
//       portrait: "纵向",
//       landscape: "横向",
//       size: "页面大小",
//       custom: "屏幕大小",
//       margin: "外边距",
//       scale: "尺度",
//       legend: "图例",
//       north: "指北针",
//       mapTitle: "地图名字",
//       saveas: "保存为...",
//       saveLegend: "保存图例为...",
//       copied: "✔ 已复制到剪贴板",
//       errorMsg: "无法保存地图...",
//       printBt: "打印...",
//       cancel: "取消",
//     },
//   };

//   private paperSize: { [key: string]: number[] | null } = {
//     "": null,
//     A0: [841, 1189],
//     A1: [594, 841],
//     A2: [420, 594],
//     A3: [297, 420],
//     A4: [210, 297],
//     "US Letter": [215.9, 279.4],
//     A5: [148, 210],
//     B4: [257, 364],
//     B5: [182, 257],
//   };

//   private marginSize: { [key: string]: number } = {
//     none: 0,
//     small: 5,
//     large: 10,
//   };

//   private formats: any[] = [
//     {
//       title: "clipboardFormat",
//       imageType: "image/png",
//       clipboard: true,
//     },
//     {
//       title: "jpegFormat",
//       imageType: "image/jpeg",
//       quality: 0.8,
//     },
//     {
//       title: "pngFormat",
//       imageType: "image/png",
//       quality: 0.8,
//     },
//     {
//       title: "pdfFormat",
//       imageType: "image/jpeg",
//       pdf: true,
//     },
//   ];

//   private scales: { [key: string]: string } = {
//     " 5000": "1/5.000",
//     " 10000": "1/10.000",
//     " 25000": "1/25.000",
//     " 50000": "1/50.000",
//     " 100000": "1/100.000",
//     " 250000": "1/250.000",
//     " 1000000": "1/1.000.000",
//   };
// }

// export default PrintDialog;
