import { useRef } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";

import pointsData from "../assets/random-locations.json";
import texture from "../assets/earth-dark.jpg";

const min = 4000;
const max = 8000;
const sliceData = pointsData
  .sort(() => (Math.random() > 0.5 ? 1 : -1))
  .slice(20, 90);

// Hostname & IP generators
const generateHostname = () =>
  `device-${Math.floor(Math.random() * 1000)}.local`;
const generateIP = () =>
  `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(
    Math.random() * 255
  )}.${Math.floor(Math.random() * 255)}`;

// Arcs: attacker ➜ device
const arcsData = sliceData.map(() => {
  const randSource = Math.floor(Math.random() * sliceData.length);
  const randTime = Math.floor(Math.random() * (max - min + 1) + min);

  return {
    startLat: sliceData[randSource].lat,
    startLng: sliceData[randSource].lng,
    endLat: 52.0454689,
    endLng: 5.358608,
    time: randTime,
    hostname: generateHostname(),
    attackerIP: generateIP(),
    color: ["#00ff00aa","#ffff00aa","#ff0000aa",], // red ➜ yellow ➜ green
  };
});

const Page = () => {
  const globeRef = useRef(null);

  const globeReady = () => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = false;
      globeRef.current.controls().enableZoom = true;

      globeRef.current.pointOfView({
        lat: 52.0454689,
        lng: 5.3586082,
        altitude: 1.8,
      });
    }
  };

  return (
    <div className="cursor-move">
      <Globe
        ref={globeRef}
        globeImageUrl={texture}
        onGlobeReady={globeReady}
        backgroundColor="#08070e"
        rendererConfig={{ antialias: true, alpha: true }}
        globeMaterial={
          new THREE.MeshPhongMaterial({
            color: "#1a2033",
            opacity: 0.95,
            transparent: true,
          })
        }
        atmosphereColor="#5784a7"
        atmosphereAltitude={0.5}
        // Points
        pointsMerge={true}
        pointsData={pointsData}
        pointAltitude={0.025}
        pointRadius={0.2}
        pointResolution={5}
        pointColor={() => "#eed31f00"}
        pointLabel={"name"}
        // Arcs: Attacks
        arcsData={arcsData}
        arcAltitudeAutoScale={0.3}
        arcColor="color"
        arcStroke={0.5}
        arcDashLength={0.3}
        arcDashGap={4}
        arcDashAnimateTime="time"
        arcLabel={(d) => `${d.attackerIP} ➜ ${d.hostname}`}
        //stars
        customLayerData={[...Array(500).keys()].map(() => ({
          lat: (Math.random() - 1) * 360,
          lng: (Math.random() - 1) * 360,
          altitude: Math.random() * 2,
          size: Math.random() * 0.4,
          color: '#e3e3e3',
        }))}
        customThreeObject={(sliceData) => {
          const { size, color } = sliceData;
          return new THREE.Mesh(new THREE.SphereGeometry(size), new THREE.MeshBasicMaterial({ color }));
        }}
        customThreeObjectUpdate={(obj, sliceData) => {
          const { lat, lng, altitude } = sliceData;
          return Object.assign(obj.position, globeRef.current?.getCoords(lat, lng, altitude));
        }}

      />
    </div>
  );
};

export default Page;
