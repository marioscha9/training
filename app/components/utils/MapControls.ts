import LayerSwitcher from "ol-layerswitcher";
import { ScaleLine, ZoomSlider } from "ol/control";
import { Map } from "ol";

export const addLayerSwitcher = (map: Map) => {
  const layerSwitcher = new LayerSwitcher({
    reverse: true,
    groupSelectStyle: "group",
  });
  map.addControl(layerSwitcher);
};

export const addScaleLineControl = (map: Map) => {
  const scaleLineControl = new ScaleLine({
    units: "metric", // Can be 'degrees', 'imperial', 'nautical', 'metric', 'us'
    bar: true, // Show as a bar, not just a line
    steps: 4, // Number of steps (subdivisions) in the scale bar
    text: true, // Show text scale (e.g., 1 km, 1 mi)
    minWidth: 100, // Minimum width of the scale bar in pixels
  });
  map.addControl(scaleLineControl);
};

export const addZoomSlider = (map: Map) => {
  const zoomSlider = new ZoomSlider();
  map.addControl(zoomSlider);
};
