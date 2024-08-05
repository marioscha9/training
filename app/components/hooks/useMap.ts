import { useRef, useEffect, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import LayerGroup from "ol/layer/Group";
import {
  Control,
  defaults as defaultControls,
  MousePosition,
} from "ol/control";

import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Geoportail from "ol-ext/layer/Geoportail";
import ImageWMS from "ol/source/ImageWMS";

import LayerSwitcher from "ol-ext/control/LayerSwitcher";
import CanvasAttribution from "ol-ext/control/CanvasAttribution";
import CanvasTitle from "ol-ext/control/CanvasTitle";
import Legend from "ol-ext/legend/Legend";
import ControlLegend from "ol-ext/control/Legend";
import CanvasScaleLine from "ol-ext/control/CanvasScaleLine";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

import ControlBar from "ol-ext/control/Bar";
import styles from "./ButtonWithImage.module.css";
import {
  defaults as defaultInteractions,
  MouseWheelZoom,
  Select,
} from "ol/interaction";
import Swipe from "ol-ext/control/Swipe";
import Toggle from "ol-ext/control/Toggle";

import Bar from "ol-ext/control/Bar";

// import PrintDialog from "ol-ext/control/PrintDialog";
import { Style } from "ol/style";
import jsPDF from "jspdf";

import { PrintSettings } from "../PrintDIalog";

import ImageLayer from "ol/layer/Image";
import { singleClick } from "ol/events/condition";

let dims = {
  A0: [1189, 841],
  A1: [841, 594],
  A2: [594, 420],
  A3: [420, 297],
  A4: [297, 210],
  A5: [210, 148],
};
const useMap = (
  mapRef: React.RefObject<HTMLDivElement>,
  key: string,
  onMove: (pos: number[]) => void,
  onZoom: () => void
) => {
  const mapObj = useRef<Map | undefined>(undefined);
  const lastCenter = useRef<number[]>([0, 0]);
  const lastZoom = useRef<number | undefined>(undefined);
  const positionFeature = useRef(
    new Feature(new Point(fromLonLat([0, 0])))
  ).current;
  const vectorSource = useRef(
    new VectorSource({ features: [positionFeature] })
  ).current;
  const [swipe, setSwipe] = useState<Swipe | null>(null);
  const imageLayer = useRef(new ImageLayer());

  useEffect(() => {
    const satelliteLayer = new TileLayer({
      source: new XYZ({
        url: `https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${key}`,
        tileSize: 512,
        maxZoom: 20,
      }),
      visible: false,
      title: "Satellite",
      type: "none",
    });
    const osmLayer = new TileLayer({
      source: new OSM(),
      title: "OpenStreetMap",
      type: "none",
      visible: true,
    });

    const imageLayer = new ImageLayer({
      source: new ImageWMS({
        url: "http://ocecprgis1.poc.lan:8080/geoserver/ocecpr/wms",
        params: { LAYERS: "ocecpr:dls_districts" },
        ratio: 1,
        serverType: "geoserver",
      }),
    });

    // const noneTile = new TileLayer({
    //   title: "None",
    //   type: "base",
    //   visible: false,
    // });

    const BaseGroup = new LayerGroup({
      title: "Base Maps",
      layers: [osmLayer, imageLayer],
    });

    const overlaysGroup = new LayerGroup({
      title: "Overlays",
      fold: true,
      layers: [satelliteLayer, imageLayer],
    });

    if (mapRef.current) {
      mapObj.current = new Map({
        target: mapRef.current,
        layers: [BaseGroup, overlaysGroup],
        view: new View({
          center: fromLonLat([33, 35]),
          zoom: 8,
        }),
        controls: defaultControls({ zoom: false, attribution: false }), // Disable default zoom controls
        interactions: defaultInteractions({
          // mouseWheelZoom: false,
          dragPan: false,
        }),
      });
      mapObj.current.addControl(new LayerSwitcher());
      mapObj.current.addControl(new CanvasAttribution({ canvas: true }));
      const titleControl = new CanvasTitle({
        title: "",
        visible: false,
      });

      // titleControlRef.current = titleControl;
      mapObj.current.addControl(titleControl);
      const legend = new Legend({
        title: "Legend",
        margin: 5,
        items: [
          {
            title: "Marios",
          },
          {
            title: "Giorgos",
          },
        ],
      });

      const legendCtrl = new ControlLegend({ legend });
      // legendControlRef.current = legendCtrl;
      mapObj.current.addControl(legendCtrl);

      const scaleControl = new CanvasScaleLine();

      // scaleControlRef.current = scaleControl;
      mapObj.current.addControl(scaleControl);
    }

    const mousePosition = new MousePosition({
      className: "mousePosition",
      projection: "EPSG:4326",
      coordinateFormat: (coordinate?: number[]) => {
        if (!coordinate) {
          return ""; // Return an empty string or some default value when there is no coordinate.
        }
        // Assuming coordinate is an array of [longitude, latitude]
        return `${coordinate[1].toFixed(6)} , ${coordinate[0].toFixed(6)}`;
      },
    });

    mapObj.current?.addControl(mousePosition);
    // const sub1 = new Bar({
    //   toggleOne: true,
    //   controls: [
    //     new Toggle({
    //       html: "1",
    //       autoActive: true,
    //     }),
    //     new Toggle({
    //       html: "2",
    //     }),
    //   ],
    // });
    // const controlBar = new Bar({
    //   controls: [
    //     new Toggle({
    //       html: '<img src="/images/compare.png" />',
    //       bar: sub1,
    //     }),
    //   ],
    // });

    // // controlBar.addControl(button);
    // mapObj.current?.addControl(controlBar);

    let isDragging = false;

    const handleMouseDown = () => {
      isDragging = true;
    };

    const handleMouseUp = () => {
      if (isDragging) {
        const view = mapObj.current?.getView();
        const newCenter = view?.getCenter();
        const newZoom = view?.getZoom();
        if (newCenter && lastCenter.current) {
          if (
            newZoom === lastZoom.current &&
            (newCenter[0] !== lastCenter.current[0] ||
              newCenter[1] !== lastCenter.current[1])
          ) {
            onMove(newCenter);
          }
          lastCenter.current = newCenter;
          lastZoom.current = newZoom;
        }

        isDragging = false;
      }
    };

    const handleMoveEnd = () => {
      const view = mapObj.current?.getView();
      if (view) {
        const center = view.getCenter();
        if (center) {
          lastCenter.current = center;
          lastZoom.current = view.getZoom();
        }
      }
    };

    mapObj.current
      ?.getTargetElement()
      ?.addEventListener("mousedown", handleMouseDown);
    mapObj.current
      ?.getTargetElement()
      ?.addEventListener("mouseup", handleMouseUp);
    mapObj.current?.on("moveend", handleMoveEnd);

    // Add position feature and layer
    positionFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({
            color: "#3399CC",
          }),
          stroke: new Stroke({
            color: "#fff",
            width: 2,
          }),
        }),
      })
    );

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    mapObj.current?.addLayer(vectorLayer);

    // Add Swipe control
    const swipe = new Swipe({
      layers: [osmLayer],
      rightLayers: [satelliteLayer],
      orientation: "vertical", // Default orientation
      // orientation: orientation,
      className: "ol-swipe",
    });

    // mapObj.current?.addControl(swipe);
    setSwipe(swipe);

    return () => {
      mapObj.current
        ?.getTargetElement()
        ?.removeEventListener("mousedown", handleMouseDown);
      mapObj.current
        ?.getTargetElement()
        ?.removeEventListener("mouseup", handleMouseUp);
      mapObj.current?.un("moveend", handleMoveEnd);
      mapObj.current?.dispose();
    };
  }, [mapRef, key]);

  const toggleSwipe = () => {
    if (swipe && mapObj.current) {
      if (mapObj.current.getControls().getArray().includes(swipe)) {
        mapObj.current.removeControl(swipe);
      } else {
        mapObj.current.addControl(swipe);
      }
    }
  };
  const updateSwipeOrientation = (orientation: "vertical" | "horizontal") => {
    if (swipe) {
      swipe.set("orientation", orientation);
      swipe.dispatchEvent("propertychange");
    }
  };

  return {
    imageLayer,
    mapObj,
    positionFeature,
    vectorSource,
    toggleSwipe,
    updateSwipeOrientation,
  };
};

export default useMap;
