import React, { useRef, useState, useEffect } from "react";
import "ol/ol.css";
import "ol-layerswitcher/dist/ol-layerswitcher.css";
import useMap from "./hooks/useMap";
import ResetZoomButton from "./resetZoomButton";
import ScaleLine from "ol/control/ScaleLine";
import PrevNextButtons from "./PrevNextButtons";
import GeoLocationButton from "./GeoLocationButton";
import DragPanButton from "./DragPanButton";
import FullScreenButton from "./FullScreenButton";
import MeasureToolButton from "./MeasurementToolButtons";
import DrawTool from "./DrawTool";
import SelectDeleteTool from "./SelectDeleteTool";
import ZoomComponent from "./CustomZoomButtons";
import styles from "./ButtonWithImage.module.css";
import LayerSwitcher from "ol-ext/control/LayerSwitcher";
// import PrintDialogComponent from "./MapWithPrintDialog";
// import PrintComponent from "./MapWithPrintDialog";
import PrintDialog, { PrintSettings } from "./PrintDIalog";
import PrintDialogForm from "./PrintDIalog";
import DrawNoteTool from "./DrawNote";
import VectorSource from "ol/source/Vector";
import { color } from "html2canvas/dist/types/css/types/color";
import Select from "ol/interaction/Select";

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<number[][]>([]);
  const [currentPositionIndex, setCurrentPositionIndex] = useState<number>(-1);
  const [swipeOrientation, setSwipeOrientation] = useState<
    "vertical" | "horizontal"
  >("vertical");

  const [activeTool, setActiveTool] = useState<
    "draw" | "select" | "length" | "area" | "drawNote" | null
  >(null);
  const [isSwipeEnabled, setIsSwipeEnabled] = useState<boolean>(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#FF0000");
  const [labelText, setLabelText] = useState<string>("");
  const [isLabel, setIsLabel] = useState<boolean>(false);
  const [drawType, setDrawType] = useState<
    "Point" | "LineString" | "Polygon" | "Text"
  >("Point");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [featureToEdit, setFeatureToEdit] = useState<any | null>(null);

  const handleDrawToolToggle = () => {
    setActiveTool((prev) => (prev === "draw" ? null : "draw"));
  };

  const handleSelectToolToggle = () => {
    setActiveTool((prev) => (prev === "select" ? null : "select"));
  };

  const handleLengthToolToggle = () => {
    setActiveTool((prev) => (prev === "length" ? null : "length"));
  };

  const handleAreaToolToggle = () => {
    setActiveTool((prev) => (prev === "area" ? null : "area"));
  };
  const handleDrawNoteToolToggle = () => {
    setActiveTool((prev) => (prev === "drawNote" ? null : "drawNote"));
  };

  const handleMove = (pos: number[]) => {
    setPositions((prev) => {
      let newPositions = [...prev, pos];
      if (newPositions.length > 10) {
        newPositions = newPositions.slice(-10);
      }
      return newPositions;
    });
    setCurrentPositionIndex((prev) => {
      const newIndex = prev + 1;
      return newIndex >= 10 ? 9 : newIndex;
    });
  };

  const handleZoom = () => {
    const intialposition = mapObj.current?.getView().getCenter() ?? [0, 0];
    setPositions([intialposition]);
    setCurrentPositionIndex(0);
    console.log("marios");
  };

  const {
    mapObj,
    positionFeature,
    vectorSource,
    toggleSwipe,
    updateSwipeOrientation,
  } = useMap(
    mapRef,
    "oWq4e6cA8kIU9b8KltZS",
    (pos: number[]) => {
      handleMove(pos);
    },
    handleZoom
  );

  const handlePrev = () => {
    if (currentPositionIndex > 0) {
      const newIndex = currentPositionIndex - 1;
      setCurrentPositionIndex(newIndex);
      mapObj.current?.getView().setCenter(positions[newIndex]);
    }
  };

  const handleNext = () => {
    if (currentPositionIndex < positions.length - 1) {
      const newIndex = currentPositionIndex + 1;
      setCurrentPositionIndex(newIndex);
      mapObj.current?.getView().setCenter(positions[newIndex]);
    }
  };

  const handleOrientationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrientation = e.target.value as "vertical" | "horizontal";
    setSwipeOrientation(newOrientation);
    updateSwipeOrientation(newOrientation);
  };

  const handleToggleSwipe = () => {
    toggleSwipe();
    setIsSwipeEnabled((prev) => !prev);
  };
  const handleEditFeature = (feature: any) => {
    setFeatureToEdit(feature);
    setActiveTool((prev) => (prev === "drawNote" ? null : "drawNote"));
    // setIsDrawNoteToolEnabled(true);
  };
  // const handleDrawTypeChange = (
  //   type: "Point" | "LineString" | "Polygon" | "Text"
  // ) => {
  //   setDrawType(type);
  //   // setLabelText(""); // Clear the label text field
  // };

  useEffect(() => {
    if (mapObj.current && mapObj.current?.getView()) {
      const intialposition = mapObj.current?.getView().getCenter() ?? [0, 0];
      setPositions([intialposition]);
      setCurrentPositionIndex(0);
    }
  }, [mapObj]);
  // const handleFeatureSelect = (event: any) => {
  //   const selected = event.selected[0];
  //   if (selected) {
  //     setSelectedFeature(selected);
  //     console.log(selectedFeature);

  //     // onSelectFeature(selected);

  //     if (selectedFeature) {
  //       // console.log(selectedFeature);
  //       // console.log("Selected Feature Properties:");
  //       // console.log("Type:", selectedFeature.get("geometry"));
  //       // console.log("Color:", selectedFeature.get("color"));
  //       // console.log("Label:", selectedFeature.get("label"));
  //     }
  //   } else {
  //     setSelectedFeature(null);
  //   }
  // };
  // const select = new Select();
  // mapObj.current?.addInteraction(select);
  // select.on("select", handleFeatureSelect);
  // const handleSelectFeature = (feature: any) => {
  //   setSelectedFeature(feature);
  //   if (selectedFeature) {
  //     console.log(selectedFeature);

  //     // setSelectedColor(selectedFeature.get("color"));
  //     // setLabelText(selectedFeature.get("label"));
  //     // setIsLabel(!!selectedFeature.get("label"));
  //     // console.log(selectedFeature.getGeometry().getType());
  //     // setEditMode(true);
  //     // // setDrawType(selectedFeature.getGeometry().getType());
  //     // setActiveTool("drawNote"); // Open the DrawNote panel
  //   }
  //   // handleDrawNoteToolToggle;
  // };

  return (
    <div>
      <div ref={mapRef} className="map-container" />

      <div className="buttonContainer">
        <ResetZoomButton mapObj={mapObj} onZoom={handleZoom} />
        <FullScreenButton mapObj={mapObj} />
        <DragPanButton mapObj={mapObj} />
        <PrevNextButtons
          currentPositionIndex={currentPositionIndex}
          positions={positions}
          onPrev={handlePrev}
          onNext={handleNext}
        />
        <GeoLocationButton
          mapObj={mapObj}
          positionFeature={positionFeature}
          vectorSource={vectorSource}
          onZoom={handleZoom}
        />
        <div className={styles.fsButtonDiv}>
          <button className={styles.myButton} onClick={handleToggleSwipe}>
            <img
              src="/images/compare.png"
              alt="Home"
              style={{
                width: "20px",
                height: "20px",
                filter: "brightness(0) invert(1)",
                verticalAlign: "middle",
              }}
            />
          </button>
          {isSwipeEnabled && (
            <select value={swipeOrientation} onChange={handleOrientationChange}>
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          )}
        </div>
        <ZoomComponent mapObj={mapObj} onZoom={handleZoom} />
        <SelectDeleteTool
          mapObj={mapObj}
          source={vectorSource}
          onEditFeature={handleEditFeature}
          isSelectToolEnabled={activeTool === "select"}
          onSelectToolToggle={handleSelectToolToggle}
        />

        <DrawTool
          mapObj={mapObj}
          source={vectorSource}
          isDrawToolEnabled={activeTool === "draw"}
          onDrawToolToggle={handleDrawToolToggle}
        />
        <DrawNoteTool
          mapObj={mapObj}
          source={vectorSource}
          // drawType={drawType}
          // color={selectedColor}
          // label={labelText}
          // isLabel={isLabel}
          isDrawNoteToolEnabled={activeTool === "drawNote"}
          onDrawNoteToolToggle={handleDrawNoteToolToggle}
          featureToEdit={featureToEdit}

          // onSelectFeature={handleSelectFeature}
        />
        <MeasureToolButton
          mapObj={mapObj}
          source={vectorSource}
          isMeasureToolEnabled={
            activeTool === "length" || activeTool === "area"
          }
          onLengthToolToggle={handleLengthToolToggle}
          onAreaToolToggle={handleAreaToolToggle}
          activeTool={activeTool}
        />
        {/* <PrintComponent map={mapObj.current} /> */}
      </div>
    </div>
  );
};

export default MapComponent;
