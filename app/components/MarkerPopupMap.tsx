import React, { useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import TileLayer from "ol/layer/Tile";
import OGCMapTile from "ol/source/OGCMapTile";
import Overlay from "ol/Overlay";
import { toLonLat } from "ol/proj";
import "ol/ol.css";
import { toStringHDMS } from "ol/coordinate";

const MarkerPopupMap: React.FC = () => {
  useEffect(() => {
    const iconFeature = new Feature({
      geometry: new Point([0, 0]),
      name: "Null Island",
      population: 4000,
      rainfall: 500,
    });

    const vectorSource = new VectorSource({
      features: [iconFeature],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const rasterLayer = new TileLayer({
      source: new OGCMapTile({
        url: "https://maps.gnosis.earth/ogcapi/collections/NaturalEarth:raster:HYP_HR_SR_OB_DR/map/tiles/WebMercatorQuad",
        crossOrigin: "anonymous",
      }),
    });

    const container = document.getElementById("popup") as HTMLElement;
    const content = document.getElementById("popup-content") as HTMLElement;
    const overlay = new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });

    const map = new Map({
      layers: [rasterLayer, vectorLayer],
      target: "markerpopupmap",
      view: new View({
        center: [0, 0],
        zoom: 3,
      }),
      overlays: [overlay],
    });

    map.on("singleclick", function (evt) {
      const coordinate = evt.coordinate;
      const hdms = toStringHDMS(toLonLat(coordinate));
      content.innerHTML = `<p>You clicked here:</p><code>${hdms}</code>`;
      overlay.setPosition(coordinate);
    });

    return () => map.setTarget("");
  }, []);

  return (
    <div>
      <div id="markerpopupmap" style={{ width: "100%", height: "100vh" }} />
      <div id="popup" className="ol-popup" style={{ backgroundColor: "#fff" }}>
        <a href="#" id="popup-closer" className="ol-popup-closer"></a>
        <div id="popup-content"></div>
      </div>
    </div>
  );
};

export default MarkerPopupMap;
