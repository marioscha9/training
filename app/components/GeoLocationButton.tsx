import React, { useEffect, useState } from "react";
import { Map } from "ol";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import styles from "./ButtonWithImage.module.css";

interface GeoLocationButtonProps {
  mapObj: React.RefObject<Map | undefined>;
  positionFeature: Feature<Point>;
  vectorSource: VectorSource;
  onZoom: () => void;
}

const GeoLocationButton: React.FC<GeoLocationButtonProps> = ({
  mapObj,
  positionFeature,
  vectorSource,
  onZoom,
}) => {
  const [watchId, setWatchId] = useState<number | null>(null);
  const handleGeoLocation = () => {
    if (watchId !== null) {
      // Stop geolocation tracking
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      vectorSource.removeFeature(positionFeature);
    } else {
      // Start geolocation tracking
      onZoom();
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coordinates = fromLonLat([longitude, latitude]);

          positionFeature.getGeometry()?.setCoordinates(coordinates);
          const view = mapObj.current?.getView();
          view?.setCenter(coordinates);
          view?.setZoom(16); // Zoom level to focus on user's location
          // Add the feature to the vector source if it's not already there
          if (!vectorSource.hasFeature(positionFeature)) {
            vectorSource.addFeature(positionFeature);
          }
        },
        (error) => {
          console.error("Error getting user location", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
      setWatchId(id);
    }
  };

  useEffect(() => {
    // Cleanup watch on component unmount
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        vectorSource.removeFeature(positionFeature);
      }
    };
  }, [watchId, vectorSource, positionFeature]);

  return (
    <div className={styles.fsButtonDiv}>
      <button onClick={handleGeoLocation} className={styles.myButton}>
        <img
          src="/images/location-live.svg"
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
  );
};

export default GeoLocationButton;

// import React, { useState } from "react";
// import { Map } from "ol";
// import { Geolocation } from "ol";
// import { Feature } from "ol";
// import Point from "ol/geom/Point";

// interface GeoLocationButtonProps {
//   mapObj: React.RefObject<Map | undefined>;
//   positionFeature: Feature<Point>;
//   accuracyFeature: Feature;
// }

// const GeoLocationButton: React.FC<GeoLocationButtonProps> = ({
//   mapObj,
//   positionFeature,
//   accuracyFeature,
// }) => {
//   const [isAutoLocating, setIsAutoLocating] = useState(false);
//   let intervalAutolocate: any;

//   const geolocation = new Geolocation({
//     trackingOptions: {
//       enableHighAccuracy: true,
//     },
//     tracking: true,
//     projection: mapObj.current?.getView().getProjection(),
//   });

//   const startAutoLocate = () => {
//     const coordinates = geolocation.getPosition();
//     positionFeature.setGeometry(
//       coordinates ? new Point(coordinates) : undefined
//     );
//     mapObj.current?.getView().setCenter(coordinates);
//     mapObj.current?.getView().setZoom(16);
//     const accuracy = geolocation.getAccuracyGeometry();
//     if (accuracy) {
//       accuracyFeature.setGeometry(accuracy);
//     } else {
//       accuracyFeature.setGeometry(undefined);
//     }
//     intervalAutolocate = setInterval(() => {
//       var coordinates = geolocation.getPosition();
//       var accuracy = geolocation.getAccuracyGeometry();
//       positionFeature.setGeometry(
//         coordinates ? new Point(coordinates) : undefined
//       );
//       mapObj.current?.getView().setCenter(coordinates);
//       mapObj.current?.getView().setZoom(16);
//       if (accuracy) {
//         accuracyFeature.setGeometry(accuracy);
//       } else {
//         accuracyFeature.setGeometry(undefined);
//       }
//     }, 10000);
//   };

//   const stopAutoLocate = () => {
//     clearInterval(intervalAutolocate);
//     positionFeature.setGeometry(undefined);
//     accuracyFeature.setGeometry(undefined);
//   };

//   const handleGeoLocationClick = () => {
//     if (isAutoLocating) {
//       stopAutoLocate();
//     } else {
//       startAutoLocate();
//     }
//     setIsAutoLocating(!isAutoLocating);
//   };

//   return (
//     <button onClick={handleGeoLocationClick}>
//       {isAutoLocating ? "Stop AutoLocate" : "Start AutoLocate"}
//     </button>
//   );
// };

// export default GeoLocationButton;
