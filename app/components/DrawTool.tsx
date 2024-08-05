// import React, { useEffect, useState, useRef } from "react";
// import Map from "ol/Map";
// import { Draw, Modify, Snap } from "ol/interaction";
// import VectorSource from "ol/source/Vector";
// import VectorLayer from "ol/layer/Vector";
// import { Options as DrawOptions } from "ol/interaction/Draw";
// import styles from "./ButtonWithImage.module.css";
// import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
// import { Polygon, Geometry, SimpleGeometry } from "ol/geom";
// import { SketchCoordType } from "ol/interaction/Draw";
// import { Coordinate } from "ol/coordinate";
// import GeoJSON from "ol/format/GeoJSON";
// import { fromCircle } from "ol/geom/Polygon";

// interface DrawToolProps {
//   mapObj: React.MutableRefObject<Map | undefined>;
//   source: VectorSource;
//   isDrawToolEnabled: boolean;
//   onDrawToolToggle: () => void;
// }

// const DrawTool: React.FC<DrawToolProps> = ({
//   mapObj,
//   source,
//   isDrawToolEnabled,
//   onDrawToolToggle,
// }) => {
//   const [drawType, setDrawType] = useState<
//     DrawOptions["type"] | "Square" | "Rectangle"
//   >("Point");
//   const [draw, setDraw] = useState<Draw | null>(null);
//   const [modify, setModify] = useState<Modify | null>(null);
//   const [snap, setSnap] = useState<Snap | null>(null);
//   const [currentFeature, setCurrentFeature] = useState<any>(null);
//   const [excludedFeatures, setExcludedFeatures] = useState<any[]>([]);

//   // Create a local VectorSource for this component
//   const localSource = useRef(new VectorSource()).current;
//   const vectorLayer = useRef(new VectorLayer({ source: localSource })).current;

//   const updateInteractions = () => {
//     if (!mapObj.current) return;

//     if (draw) {
//       mapObj.current.removeInteraction(draw);
//       draw.un("drawend", handleDrawEnd);
//     }
//     if (modify) mapObj.current.removeInteraction(modify);
//     if (snap) mapObj.current.removeInteraction(snap);

//     if (isDrawToolEnabled && !currentFeature) {
//       const newModify = new Modify({ source: localSource });
//       const newDraw = new Draw({
//         source: localSource,
//         type:
//           drawType === "Square" || drawType === "Rectangle"
//             ? "Circle"
//             : drawType,
//         geometryFunction:
//           drawType === "Square"
//             ? createSquareGeometryFunction()
//             : drawType === "Rectangle"
//             ? createRectangleGeometryFunction()
//             : undefined,
//         style: new Style({
//           fill: new Fill({ color: "rgba(255, 255, 255, 0.2)" }),
//           stroke: new Stroke({
//             color: "rgba(0, 0, 0, 0.5)",
//             lineDash: [10, 10],
//             width: 2,
//           }),
//           image: new CircleStyle({
//             radius: 5,
//             stroke: new Stroke({ color: "rgba(0, 0, 0, 0.7)" }),
//             fill: new Fill({ color: "rgba(255, 255, 255, 0.2)" }),
//           }),
//         }),
//       });
//       const newSnap = new Snap({ source: localSource });

//       newDraw.on("drawend", handleDrawEnd);

//       mapObj.current.addInteraction(newModify);
//       mapObj.current.addInteraction(newDraw);
//       mapObj.current.addInteraction(newSnap);

//       setModify(newModify);
//       setDraw(newDraw);
//       setSnap(newSnap);
//     } else {
//       setModify(null);
//       setDraw(null);
//       setSnap(null);
//     }
//   };

//   const handleDrawEnd = (event: any) => {
//     const feature = event.feature;
//     const geometry = feature.getGeometry();

//     if (geometry.getType() === "Circle") {
//       // Convert Circle to Polygon
//       const polygon = fromCircle(geometry);
//       feature.setGeometry(polygon);
//     }

//     setCurrentFeature(feature);
//     source.addFeature(feature.clone());

//     if (draw) {
//       mapObj.current?.removeInteraction(draw);
//     }
//   };

//   const handleKeepAndPrint = () => {
//     if (currentFeature) {
//       // Add the current feature to the global source for display on the map
//       source.addFeature(currentFeature.clone());

//       const features = localSource.getFeatures();

//       const format = new GeoJSON();
//       const geoJsonFeatures = features.map((feature) =>
//         format.writeFeatureObject(feature)
//       );
//       // // Remove the first feature from the array
//       // if (geoJsonFeatures.length > 0) {
//       //   geoJsonFeatures.shift();
//       // }

//       const featureCollection = {
//         type: "FeatureCollection",
//         features: geoJsonFeatures,
//       };

//       console.log(
//         "Feature Collection GeoJSON:",
//         JSON.stringify(featureCollection, null, 2)
//       );
//       setCurrentFeature(null);
//       updateInteractions(); // Re-enable drawing
//     }
//   };

//   const handleDeleteAndContinue = () => {
//     if (currentFeature) {
//       // // Exclude the feature from local and global sources
//       // localSource.removeFeature(currentFeature);
//       // source.removeFeature(currentFeature);

//       setExcludedFeatures([...excludedFeatures, currentFeature]);
//       setCurrentFeature(null);
//       updateInteractions(); // Re-enable drawing
//     }
//   };

//   const createSquareGeometryFunction = (): ((
//     arg0: SketchCoordType,
//     arg1?: SimpleGeometry
//   ) => SimpleGeometry) => {
//     return (coordinates: SketchCoordType, geometry?: SimpleGeometry) => {
//       if (!Array.isArray(coordinates) || coordinates.length === 0) {
//         return geometry as SimpleGeometry;
//       }

//       const firstCoordinate = coordinates[0];
//       if (!Array.isArray(firstCoordinate)) {
//         return geometry as SimpleGeometry;
//       }

//       const center = firstCoordinate as Coordinate;
//       const last = coordinates[coordinates.length - 1] as Coordinate;
//       const dx = last[0] - center[0];
//       const dy = last[1] - center[1];
//       const length = Math.sqrt(dx * dx + dy * dy);
//       const rotation = Math.atan2(dy, dx);

//       const squareCoordinates = [];
//       for (let i = 0; i < 4; ++i) {
//         const angle = rotation + (i * Math.PI) / 2;
//         const offsetX = length * Math.cos(angle);
//         const offsetY = length * Math.sin(angle);
//         squareCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
//       }
//       squareCoordinates.push(squareCoordinates[0].slice());

//       if (!geometry) {
//         geometry = new Polygon([squareCoordinates]);
//       } else {
//         (geometry as Polygon).setCoordinates([squareCoordinates]);
//       }
//       return geometry as SimpleGeometry;
//     };
//   };

//   const createRectangleGeometryFunction = (): ((
//     arg0: SketchCoordType,
//     arg1?: SimpleGeometry
//   ) => SimpleGeometry) => {
//     return (coordinates: SketchCoordType, geometry?: SimpleGeometry) => {
//       if (!Array.isArray(coordinates) || coordinates.length === 0) {
//         return geometry as SimpleGeometry;
//       }

//       const firstCoordinate = coordinates[0];
//       if (!Array.isArray(firstCoordinate)) {
//         return geometry as SimpleGeometry;
//       }

//       const start = firstCoordinate as Coordinate;
//       const end = coordinates[coordinates.length - 1] as Coordinate;
//       const dx = end[0] - start[0];
//       const dy = end[1] - start[1];

//       const rectangleCoordinates: number[][] = [
//         start,
//         [start[0] + dx, start[1]],
//         [start[0] + dx, start[1] + dy],
//         [start[0], start[1] + dy],
//         start,
//       ];

//       if (!geometry) {
//         geometry = new Polygon([rectangleCoordinates]);
//       } else {
//         (geometry as Polygon).setCoordinates([rectangleCoordinates]);
//       }
//       return geometry as SimpleGeometry;
//     };
//   };

//   useEffect(() => {
//     if (!mapObj.current) return;

//     if (!mapObj.current.getLayers().getArray().includes(vectorLayer)) {
//       mapObj.current.addLayer(vectorLayer);
//     }

//     updateInteractions();

//     return () => {
//       if (mapObj.current) {
//         if (draw) {
//           mapObj.current.removeInteraction(draw);
//           draw.un("drawend", handleDrawEnd);
//         }
//         if (modify) mapObj.current.removeInteraction(modify);
//         if (snap) mapObj.current.removeInteraction(snap);
//       }
//     };
//   }, [
//     mapObj,
//     drawType,
//     isDrawToolEnabled,
//     vectorLayer,
//     // source,
//     localSource, // Ensure dependencies include the local source
//     currentFeature,
//   ]);

//   const handleDrawTypeChange = (
//     type: DrawOptions["type"] | "Square" | "Rectangle"
//   ) => {
//     setDrawType(type);
//     // onDrawToolToggle();
//   };

//   return (
//     <div className={styles.fsButtonDiv}>
//       <button className={styles.myButton} onClick={onDrawToolToggle}>
//         <img
//           src="/images/draw.svg"
//           alt="Draw Tool"
//           style={{
//             width: "20px",
//             height: "20px",
//             filter: "brightness(0) invert(1)",
//             verticalAlign: "middle",
//           }}
//         />
//       </button>
//       {isDrawToolEnabled && (
//         <div className={styles.subbar}>
//           <button
//             onClick={() => handleDrawTypeChange("Point")}
//             style={{ border: "2px solid #888", padding: "3px", margin: "2px" }}
//           >
//             Point
//           </button>

//           <button
//             onClick={() => handleDrawTypeChange("LineString")}
//             style={{ border: "2px solid #888", padding: "3px", margin: "2px" }}
//           >
//             Line
//           </button>
//           <button
//             onClick={() => handleDrawTypeChange("Circle")}
//             style={{ border: "2px solid #888", padding: "3px", margin: "2px" }}
//           >
//             Circle
//           </button>
//           <button
//             onClick={() => handleDrawTypeChange("Polygon")}
//             style={{ border: "2px solid #888", padding: "3px", margin: "2px" }}
//           >
//             Polygon
//           </button>
//           <button
//             onClick={() => handleDrawTypeChange("Square")}
//             style={{ border: "2px solid #888", padding: "3px", margin: "2px" }}
//           >
//             Square
//           </button>
//           <button
//             onClick={() => handleDrawTypeChange("Rectangle")}
//             style={{ border: "2px solid #888", padding: "3px", margin: "2px" }}
//           >
//             Rectangle
//           </button>
//           {currentFeature && (
//             <div className={styles.subbar}>
//               <button
//                 onClick={handleKeepAndPrint}
//                 style={{
//                   border: "2px solid #888",
//                   padding: "3px",
//                   margin: "2px",
//                 }}
//               >
//                 Add
//               </button>
//               <button
//                 onClick={handleDeleteAndContinue}
//                 style={{
//                   border: "2px solid #888",
//                   padding: "3px",
//                   margin: "2px",
//                 }}
//               >
//                 No Add
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DrawTool;

import React, { useEffect, useState, useRef } from "react";
import Map from "ol/Map";
import { Draw, Modify, Snap } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Options as DrawOptions } from "ol/interaction/Draw";
import styles from "./ButtonWithImage.module.css";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { Polygon, Geometry, SimpleGeometry } from "ol/geom";
import { SketchCoordType } from "ol/interaction/Draw";
import { Coordinate } from "ol/coordinate";
import GeoJSON from "ol/format/GeoJSON";
import { fromCircle } from "ol/geom/Polygon";

interface DrawToolProps {
  mapObj: React.MutableRefObject<Map | undefined>;
  source: VectorSource;
  isDrawToolEnabled: boolean;
  onDrawToolToggle: () => void;
}

const DrawTool: React.FC<DrawToolProps> = ({
  mapObj,
  source,
  isDrawToolEnabled,
  onDrawToolToggle,
}) => {
  const [drawType, setDrawType] = useState<
    DrawOptions["type"] | "Square" | "Rectangle"
  >("Point");

  const [currentFeature, setCurrentFeature] = useState<any>(null);
  const [excludedFeatures, setExcludedFeatures] = useState<any[]>([]);
  const drawRef = useRef<Draw | null>(null);

  // Create a local VectorSource for this component
  const localSource = useRef(new VectorSource()).current;
  useEffect(() => {
    if (!mapObj.current) return;

    const map = mapObj.current;

    if (drawRef.current) {
      map.removeInteraction(drawRef.current);
      drawRef.current = null;
    }

    if (!isDrawToolEnabled || !drawType) return;

    const createStyle = () => {
      return new Style({
        fill: new Fill({ color: "rgba(255, 255, 255, 0.2)" }),
        stroke: new Stroke(),
        image: new CircleStyle({
          radius: 5,
          fill: new Fill(),
          stroke: new Stroke(),
        }),
      });
    };

    if (drawType !== "Square" && drawType !== "Rectangle") {
      drawRef.current = new Draw({
        source: localSource,
        type: drawType,
        style: createStyle(),
      });
    } else {
      drawRef.current = new Draw({
        source: localSource,
        type:
          drawType === "Square" || drawType === "Rectangle"
            ? "Circle"
            : drawType,
        geometryFunction:
          drawType === "Square"
            ? createSquareGeometryFunction()
            : drawType === "Rectangle"
            ? createRectangleGeometryFunction()
            : undefined,
        style: createStyle(),
      });
    }
    drawRef.current.on("drawend", (event) => {
      const feature = event.feature;

      feature.setStyle(createStyle());
      setCurrentFeature(feature);

      // Add the feature to the global source to ensure it's visible on the map
      source.addFeature(feature.clone());
      console.log(feature);
    });

    if (drawRef.current) {
      map.addInteraction(drawRef.current);
    }

    return () => {
      if (drawRef.current) {
        map.removeInteraction(drawRef.current);
      }
    };
  }, [mapObj, localSource, source, drawType, isDrawToolEnabled]);

  const handleDrawTypeChange = (
    type: DrawOptions["type"] | "Square" | "Rectangle"
  ) => {
    setDrawType(type);
  };
  const handleKeepAndPrint = () => {
    if (currentFeature) {
      // // Add the current feature to the global source for display on the map
      // source.addFeature(currentFeature.clone());

      const features = localSource.getFeatures();

      const format = new GeoJSON();
      const geoJsonFeatures = features.map((feature) =>
        format.writeFeatureObject(feature)
      );
      // // Remove the first feature from the array
      // if (geoJsonFeatures.length > 0) {
      //   geoJsonFeatures.shift();
      // }

      const featureCollection = {
        type: "FeatureCollection",
        features: geoJsonFeatures,
      };

      console.log(
        "Feature Collection GeoJSON:",
        JSON.stringify(featureCollection, null, 2)
      );
      setCurrentFeature(null);
      // updateInteractions(); // Re-enable drawing
    }
  };

  const handleDeleteAndContinue = () => {
    if (currentFeature) {
      // // Exclude the feature from local and global sources
      localSource.removeFeature(currentFeature);
      source.removeFeature(currentFeature);

      setExcludedFeatures([...excludedFeatures, currentFeature]);
      setCurrentFeature(null);
      // updateInteractions(); // Re-enable drawing
    }
  };
  const createSquareGeometryFunction = (): ((
    arg0: SketchCoordType,
    arg1?: SimpleGeometry
  ) => SimpleGeometry) => {
    return (coordinates: SketchCoordType, geometry?: SimpleGeometry) => {
      if (!Array.isArray(coordinates) || coordinates.length === 0) {
        return geometry as SimpleGeometry;
      }

      const firstCoordinate = coordinates[0];
      if (!Array.isArray(firstCoordinate)) {
        return geometry as SimpleGeometry;
      }

      const center = firstCoordinate as Coordinate;
      const last = coordinates[coordinates.length - 1] as Coordinate;
      const dx = last[0] - center[0];
      const dy = last[1] - center[1];
      const length = Math.sqrt(dx * dx + dy * dy);
      const rotation = Math.atan2(dy, dx);

      const squareCoordinates = [];
      for (let i = 0; i < 4; ++i) {
        const angle = rotation + (i * Math.PI) / 2;
        const offsetX = length * Math.cos(angle);
        const offsetY = length * Math.sin(angle);
        squareCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
      }
      squareCoordinates.push(squareCoordinates[0].slice());

      if (!geometry) {
        geometry = new Polygon([squareCoordinates]);
      } else {
        (geometry as Polygon).setCoordinates([squareCoordinates]);
      }
      return geometry as SimpleGeometry;
    };
  };

  const createRectangleGeometryFunction = (): ((
    arg0: SketchCoordType,
    arg1?: SimpleGeometry
  ) => SimpleGeometry) => {
    return (coordinates: SketchCoordType, geometry?: SimpleGeometry) => {
      if (!Array.isArray(coordinates) || coordinates.length === 0) {
        return geometry as SimpleGeometry;
      }

      const firstCoordinate = coordinates[0];
      if (!Array.isArray(firstCoordinate)) {
        return geometry as SimpleGeometry;
      }

      const start = firstCoordinate as Coordinate;
      const end = coordinates[coordinates.length - 1] as Coordinate;
      const dx = end[0] - start[0];
      const dy = end[1] - start[1];

      const rectangleCoordinates: number[][] = [
        start,
        [start[0] + dx, start[1]],
        [start[0] + dx, start[1] + dy],
        [start[0], start[1] + dy],
        start,
      ];

      if (!geometry) {
        geometry = new Polygon([rectangleCoordinates]);
      } else {
        (geometry as Polygon).setCoordinates([rectangleCoordinates]);
      }
      return geometry as SimpleGeometry;
    };
  };

  return (
    <div className={styles.fsButtonDiv}>
      <button className={styles.myButton} onClick={onDrawToolToggle}>
        <img
          src="/images/draw.svg"
          alt="Draw Tool"
          style={{
            width: "20px",
            height: "20px",
            filter: "brightness(0) invert(1)",
            verticalAlign: "middle",
          }}
        />
      </button>
      {isDrawToolEnabled && (
        <div className={styles.subbar}>
          <button
            onClick={() => handleDrawTypeChange("Point")}
            style={{ border: "2px solid #888", padding: "3px", margin: "2px" }}
          >
            Point
          </button>

          <button
            onClick={() => handleDrawTypeChange("LineString")}
            style={{ border: "2px solid #888", padding: "3px", margin: "2px" }}
          >
            Line
          </button>
          <button
            onClick={() => handleDrawTypeChange("Circle")}
            style={{ border: "2px solid #888", padding: "3px", margin: "2px" }}
          >
            Circle
          </button>
          <button
            onClick={() => handleDrawTypeChange("Polygon")}
            style={{ border: "2px solid #888", padding: "3px", margin: "2px" }}
          >
            Polygon
          </button>
          <button
            onClick={() => handleDrawTypeChange("Square")}
            style={{ border: "2px solid #888", padding: "3px", margin: "2px" }}
          >
            Square
          </button>
          <button
            onClick={() => handleDrawTypeChange("Rectangle")}
            style={{ border: "2px solid #888", padding: "3px", margin: "2px" }}
          >
            Rectangle
          </button>
          {currentFeature && (
            <div className={styles.subbar}>
              <button
                onClick={handleKeepAndPrint}
                style={{
                  border: "2px solid #888",
                  padding: "3px",
                  margin: "2px",
                }}
              >
                Add
              </button>
              <button
                onClick={handleDeleteAndContinue}
                style={{
                  border: "2px solid #888",
                  padding: "3px",
                  margin: "2px",
                }}
              >
                No Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DrawTool;
