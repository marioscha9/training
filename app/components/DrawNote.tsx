import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import { Draw } from "ol/interaction";
import VectorSource from "ol/source/Vector";

import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";
import styles from "./ButtonWithImage.module.css";
import "ol/ol.css";
import KML from "ol/format/KML";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface DrawNoteToolProps {
  mapObj: React.MutableRefObject<Map | undefined>;
  source: VectorSource;
  isDrawNoteToolEnabled: boolean;
  onDrawNoteToolToggle: () => void;
  featureToEdit?: any; // Add this prop
}
type DrawType = "Point" | "LineString" | "Polygon" | "Text" | null;

const DrawNoteTool: React.FC<DrawNoteToolProps> = ({
  mapObj,
  source,
  isDrawNoteToolEnabled,
  onDrawNoteToolToggle,
  featureToEdit,
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [drawType, setDrawType] = useState<DrawType>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#FF0000");
  const [labelText, setLabelText] = useState<string>("");
  const [isLabel, setIsLabel] = useState<boolean>(false);
  const drawRef = useRef<Draw | null>(null);

  // Create a local VectorSource for this component
  const localSource = useRef<VectorSource>(new VectorSource()).current;

  useEffect(() => {
    if (!mapObj.current) return;

    const map = mapObj.current;

    if (drawRef.current) {
      map.removeInteraction(drawRef.current);
      drawRef.current = null;
    }

    if (!isDrawNoteToolEnabled || !drawType) return;

    const createStyle = () => {
      return new Style({
        fill: new Fill({ color: "rgba(255, 255, 255, 0.2)" }),
        stroke: new Stroke({ color: selectedColor, width: 2 }),
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: selectedColor }),
          stroke: new Stroke({ color: selectedColor, width: 2 }),
        }),
        text: isLabel
          ? new Text({
              text: labelText,
              font: "20px Calibri,sans-serif",
              fill: new Fill({ color: selectedColor }),
              stroke: new Stroke({ color: "#fff", width: 3 }),
              offsetY: drawType !== "Text" ? 15 : 0,
              textAlign: "center",
            })
          : undefined,
      });
    };

    if (drawType !== "Text") {
      drawRef.current = new Draw({
        source: localSource,
        type: drawType,
        style: createStyle(),
      });

      drawRef.current.on("drawend", (event) => {
        const feature = event.feature;

        feature.setStyle(createStyle());
        feature.set("color", selectedColor);
        feature.set("label", labelText);
        feature.set("isLabel", isLabel);
        feature.set("geometryType", drawType);
        feature.set("drawNote", true);

        // Add the feature to the global source to ensure it's visible on the map
        source.addFeature(feature.clone());
        console.log(feature);
      });
    } else {
      drawRef.current = new Draw({
        source: localSource,
        type: "Point",
        style: new Style({
          text: new Text({
            text: labelText,
            font: "20px Calibri,sans-serif",
            fill: new Fill({ color: selectedColor }),
            stroke: new Stroke({ color: "#fff", width: 3 }),
            offsetY: 0,
            textAlign: "center",
          }),
        }),
      });

      drawRef.current.on("drawend", (event) => {
        const feature = event.feature;
        feature.setStyle(
          new Style({
            text: new Text({
              text: labelText,
              font: "20px Calibri,sans-serif",
              fill: new Fill({ color: selectedColor }),
              stroke: new Stroke({ color: "#fff", width: 3 }),
              offsetY: 0,
              textAlign: "center",
            }),
          })
        );
        feature.set("color", selectedColor);
        feature.set("label", labelText);
        feature.set("isLabel", isLabel);
        feature.set("geometryType", drawType);
        feature.set("drawNote", true);
        // Add the feature to the global source to ensure it's visible on the map
        source.addFeature(feature.clone());
        console.log(feature);
      });
    }

    if (drawRef.current) {
      map.addInteraction(drawRef.current);
    }

    return () => {
      if (drawRef.current) {
        map.removeInteraction(drawRef.current);
      }
    };
  }, [
    mapObj,
    localSource,
    source,
    drawType,
    selectedColor,
    labelText,
    isLabel,
    isDrawNoteToolEnabled,
  ]);

  useEffect(() => {
    if (featureToEdit) {
      const isLabel = featureToEdit.values_.isLabel;
      const label = featureToEdit.values_.label;
      const color = featureToEdit.values_.color;

      setDrawType(null);
      setSelectedColor(color || "#FF0000");

      if (isLabel) {
        setIsLabel(true);
        setLabelText(label);
      } else if (!isLabel && label) {
        setIsLabel(false);
        setLabelText(label);
      } else {
        setIsLabel(false);
        setLabelText("");
      }
    }
  }, [featureToEdit]);

  const handleDrawNote = () => {
    onDrawNoteToolToggle();
  };

  const handleDrawTypeChange = (type: DrawType) => {
    setDrawType(type);
  };

  const applyChanges = () => {
    if (featureToEdit) {
      const type = featureToEdit.values_.geometryType;
      var style;
      if (type === "Point") {
        style = new Style({
          fill: new Fill({ color: "rgba(255, 255, 255, 0.2)" }),
          stroke: new Stroke({ color: selectedColor, width: 2 }),
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({ color: selectedColor }),
            stroke: new Stroke({ color: selectedColor, width: 2 }),
          }),
          text: isLabel
            ? new Text({
                text: labelText,
                font: "20px Calibri,sans-serif",
                fill: new Fill({ color: selectedColor }),
                stroke: new Stroke({ color: "#fff", width: 3 }),
                offsetY: drawType !== "Text" ? 15 : 0,
                textAlign: "center",
              })
            : undefined,
        });
      } else if (type === "Text") {
        style = new Style({
          fill: new Fill({ color: "rgba(255, 255, 255, 0.2)" }),
          stroke: new Stroke({ color: selectedColor, width: 2 }),
          text: new Text({
            text: labelText,
            font: "20px Calibri,sans-serif",
            fill: new Fill({ color: selectedColor }),
            stroke: new Stroke({ color: "#fff", width: 3 }),
            offsetY: 0,
            textAlign: "center",
          }),
        });
      } else {
        style = new Style({
          fill: new Fill({ color: "rgba(255, 255, 255, 0.2)" }),
          stroke: new Stroke({ color: selectedColor, width: 2 }),
          text: isLabel
            ? new Text({
                text: labelText,
                font: "20px Calibri,sans-serif",
                fill: new Fill({ color: selectedColor }),
                stroke: new Stroke({ color: "#fff", width: 3 }),
                offsetY: drawType !== "Text" ? 15 : 0,
                textAlign: "center",
              })
            : undefined,
        });
      }
      featureToEdit.setStyle(style);
      featureToEdit.set("color", selectedColor);
      featureToEdit.set("label", labelText);
    }
    onDrawNoteToolToggle();
  };

  const exportToKMZ = () => {
    const kmlFormat = new KML({
      extractStyles: true,
    });
    // Filter features created by this tool
    const features = localSource.getFeatures();
    const kml = kmlFormat.writeFeatures(features, {
      featureProjection: "EPSG:3857",
    });

    const zip = new JSZip();
    zip.file("doc.kml", kml);
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "geometries.kmz");
    });
  };
  function stringToBoolean(str: string): boolean {
    return str.toLowerCase() === "true";
  }
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);
      const kmlContent = await content.file("doc.kml")?.async("text");
      if (kmlContent) {
        const kmlFormat = new KML();
        const features = kmlFormat.readFeatures(kmlContent, {
          featureProjection: "EPSG:3857",
        });

        features.forEach((feature) => {
          const isLabel = feature.get("isLabel");
          const color = feature.get("color");
          const label = feature.get("label");
          const type = feature.get("geometryType");
          var style;

          const baseStyle = {
            fill: new Fill({ color: "rgba(255, 255, 255, 0.2)" }),
            stroke: new Stroke({ color: color, width: 2 }),
          };

          const booleanValue = stringToBoolean(isLabel);
          const textStyle = booleanValue
            ? new Text({
                text: label,
                font: "20px Calibri,sans-serif",
                fill: new Fill({ color: color }),
                stroke: new Stroke({ color: "#fff", width: 3 }),
                offsetY: drawType !== "Text" ? 15 : 0,
                textAlign: "center",
              })
            : undefined;

          if (type === "Point") {
            style = new Style({
              ...baseStyle,
              image: new CircleStyle({
                radius: 5,
                fill: new Fill({ color: color }),
                stroke: new Stroke({ color: color, width: 2 }),
              }),
              text: textStyle,
            });
          } else if (type === "Text") {
            style = new Style({
              ...baseStyle,
              text: new Text({
                text: label,
                font: "20px Calibri,sans-serif",
                fill: new Fill({ color: color }),
                stroke: new Stroke({ color: "#fff", width: 3 }),
                offsetY: 0,
                textAlign: "center",
              }),
            });
          } else {
            style = new Style({
              ...baseStyle,
              text: textStyle,
            });
          }

          feature.setStyle(style);
          console.log("Feature properties:", {
            isLabel,
            label,
            color,
            type,
          });
          // Add feature to sources
          source.addFeature(feature.clone());
          localSource.addFeature(feature);
        });
      }
    }
  };

  return (
    <div>
      {isDrawNoteToolEnabled && (
        <div ref={panelRef} className="custom-panel">
          <h3>Notes</h3>
          <div>
            <label>Drawing tools</label>
            <button
              onClick={() => handleDrawTypeChange("Point")}
              style={{
                backgroundColor: drawType === "Point" ? "lightblue" : "white",
                marginRight: "10px",
              }}
            >
              Marker
            </button>
            <button
              onClick={() => handleDrawTypeChange("LineString")}
              style={{
                backgroundColor:
                  drawType === "LineString" ? "lightblue" : "white",
                marginRight: "10px",
              }}
            >
              Line
            </button>
            <button
              onClick={() => handleDrawTypeChange("Polygon")}
              style={{
                backgroundColor: drawType === "Polygon" ? "lightblue" : "white",
                marginRight: "10px",
              }}
            >
              Polygon
            </button>
            <button
              onClick={() => handleDrawTypeChange("Text")}
              style={{
                backgroundColor: drawType === "Text" ? "lightblue" : "white",
              }}
            >
              Text
            </button>
          </div>
          <div>
            <label>Color</label>
            <div>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label>Label</label>
            <input
              type="checkbox"
              checked={isLabel}
              onChange={(e) => setIsLabel(e.target.checked)}
            />
            {isLabel && (
              <>
                <label>Set Label</label>
                <input
                  type="text"
                  value={labelText}
                  onChange={(e) => setLabelText(e.target.value)}
                />
              </>
            )}
          </div>
          <div>
            <button onClick={applyChanges}>Apply Changes</button>
          </div>
          <div>
            <button onClick={exportToKMZ}>Export to KMZ</button>
          </div>
          <div>
            <label>Upload KMZ</label>
            <input type="file" accept=".kmz" onChange={handleFileUpload} />
          </div>
        </div>
      )}
      <div className={styles.fsButtonDiv}>
        <button className={styles.myButton} onClick={handleDrawNote}>
          <img
            src="/images/edit-button.svg"
            alt="Draw Tool"
            style={{
              width: "20px",
              height: "20px",
              filter: "brightness(0) invert(1)",
              verticalAlign: "middle",
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default DrawNoteTool;
