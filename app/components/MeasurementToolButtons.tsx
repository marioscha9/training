import React, { useState, useEffect, useRef } from "react";
import { Map } from "ol";
import Draw from "ol/interaction/Draw";
import Overlay from "ol/Overlay";
import { LineString, Polygon } from "ol/geom";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { getArea, getLength } from "ol/sphere";
import { unByKey } from "ol/Observable";
import styles from "./MeasurementTool.module.css";
import "ol/ol.css";

interface LengthMeasureToolButtonProps {
  mapObj: React.MutableRefObject<Map | undefined>;
  source: VectorSource;
  isMeasureToolEnabled: boolean;
  onLengthToolToggle: () => void;
  onAreaToolToggle: () => void;
  activeTool:
    | "draw"
    | "drawnote"
    | "select"
    | "length"
    | "area"
    | "drawNote"
    | null;
}

const LengthMeasureToolButton: React.FC<LengthMeasureToolButtonProps> = ({
  mapObj,
  source,
  isMeasureToolEnabled,
  onLengthToolToggle,
  onAreaToolToggle,
  activeTool,
}) => {
  const [isActive, setIsActive] = useState<"length" | "area" | null>(null);
  const draw = useRef<Draw | null>(null);
  const vectorLayer = useRef<VectorLayer<VectorSource> | null>(null);
  const overlay = useRef<Overlay | null>(null);
  const helpTooltipElement = useRef<HTMLDivElement | null>(null);
  const helpTooltip = useRef<Overlay | null>(null);
  const measureTooltipElement = useRef<HTMLDivElement | null>(null);
  const measureTooltip = useRef<Overlay | null>(null);
  const sketch = useRef<any>(null);
  const listener = useRef<any>(null);
  // Create a local VectorSource for this component
  // const localSource = useRef(new VectorSource()).current;
  useEffect(() => {
    if (!mapObj.current) return;

    vectorLayer.current = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new Stroke({
          color: "#ffcc33",
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: "#ffcc33",
          }),
        }),
      }),
    });

    mapObj.current.addLayer(vectorLayer.current);

    const pointerMoveHandler = (evt: any) => {
      if (helpTooltipElement.current) {
        helpTooltipElement.current.classList.remove("hidden");
      }
    };

    mapObj.current.on("pointermove", pointerMoveHandler);

    mapObj.current.getViewport().addEventListener("mouseout", function () {
      if (helpTooltipElement.current) {
        helpTooltipElement.current.classList.add("hidden");
      }
    });

    const createHelpTooltip = () => {
      if (helpTooltipElement.current) {
        helpTooltipElement.current.parentNode?.removeChild(
          helpTooltipElement.current
        );
      }
      helpTooltipElement.current = document.createElement("div");
      helpTooltipElement.current.className = "ol-tooltip hidden";
      helpTooltip.current = new Overlay({
        element: helpTooltipElement.current,
        offset: [15, 0],
        positioning: "center-left",
      });
      mapObj.current?.addOverlay(helpTooltip.current);
    };

    const createMeasureTooltip = () => {
      if (measureTooltipElement.current) {
        measureTooltipElement.current.parentNode?.removeChild(
          measureTooltipElement.current
        );
      }
      measureTooltipElement.current = document.createElement("div");
      measureTooltipElement.current.className = "ol-tooltip ol-tooltip-measure";
      measureTooltip.current = new Overlay({
        element: measureTooltipElement.current,
        offset: [0, -15],
        positioning: "bottom-center",
        stopEvent: false,
        insertFirst: false,
      });
      mapObj.current?.addOverlay(measureTooltip.current);
    };

    const formatLength = (line: LineString) => {
      const length = getLength(line);
      let output;
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + " km";
      } else {
        output = Math.round(length * 100) / 100 + " m";
      }
      return output;
    };

    const formatArea = (polygon: Polygon) => {
      const area = getArea(polygon);
      let output;
      if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + " km²";
      } else {
        output = Math.round(area * 100) / 100 + " m²";
      }
      return output;
    };

    if (isMeasureToolEnabled) {
      if (isActive) {
        // const source = vectorLayer.current.getSource() as VectorSource;
        const type = isActive === "length" ? "LineString" : "Polygon";

        draw.current = new Draw({
          source: source,
          type: type,
          style: new Style({
            fill: new Fill({
              color: "rgba(255, 255, 255, 0.2)",
            }),
            stroke: new Stroke({
              color: "rgba(0, 0, 0, 0.5)",
              lineDash: [10, 10],
              width: 2,
            }),
            image: new CircleStyle({
              radius: 5,
              stroke: new Stroke({
                color: "rgba(0, 0, 0, 0.7)",
              }),
              fill: new Fill({
                color: "rgba(255, 255, 255, 0.2)",
              }),
            }),
          }),
        });

        createHelpTooltip();
        createMeasureTooltip();

        draw.current.on("drawstart", (evt) => {
          sketch.current = evt.feature;
          let tooltipCoord = sketch.current.getGeometry().getLastCoordinate();

          listener.current = sketch.current
            .getGeometry()
            .on("change", (evt: any) => {
              const geom = evt.target;
              let output;
              if (geom instanceof Polygon) {
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
              } else if (geom instanceof LineString) {
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
              }
              if (measureTooltipElement.current) {
                measureTooltipElement.current.innerHTML = output ?? "";
                measureTooltip.current?.setPosition(tooltipCoord);
              }
            });
        });

        draw.current.on("drawend", (evt) => {
          const feature = evt.feature;
          const id = Date.now().toString();
          feature.setId(id);
          if (measureTooltipElement.current) {
            measureTooltipElement.current.className =
              "ol-tooltip ol-tooltip-static";
            measureTooltip.current?.setOffset([0, -7]);
            measureTooltip.current?.set("featureId", id);
          }

          sketch.current = null;
          measureTooltipElement.current = null;
          createMeasureTooltip();
          unByKey(listener.current);
        });

        mapObj.current.addInteraction(draw.current);
      }
    }

    return () => {
      if (mapObj.current) {
        mapObj.current.un("pointermove", pointerMoveHandler);
        if (draw.current) {
          mapObj.current.removeInteraction(draw.current);
        }
      }
    };
  }, [isActive, mapObj, isMeasureToolEnabled]);

  useEffect(() => {
    if (activeTool !== "length" && activeTool !== "area") {
      setIsActive(null);
    }
  }, [activeTool]);

  return (
    <div>
      <div className={styles.LengthButtonDiv}>
        <button
          className={styles.myButton}
          onClick={() => {
            onLengthToolToggle();
            setIsActive((prev) => (prev === "length" ? null : "length"));
          }}
        >
          <img
            src="/images/measurement-icon.svg"
            alt="Home"
            style={{
              width: "20px",
              height: "20px",
              filter: "brightness(0) invert(1)",
              verticalAlign: "middle",
            }}
          />
        </button>
      </div>
      <div className={styles.LengthButtonDiv}>
        <button
          className={styles.myButton}
          onClick={() => {
            onAreaToolToggle();
            setIsActive((prev) => (prev === "area" ? null : "area"));
          }}
        >
          <img
            src="/images/measure-area.svg"
            alt="Home"
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

export default LengthMeasureToolButton;
