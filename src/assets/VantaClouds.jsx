import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
// 💡 Import the specific CLOUDS effect module
import GLOBE from "vanta/dist/vanta.globe.min";

const VantaClouds = (props) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    // 1. Initialize the effect only once
    if (!vantaEffect) {
      setVantaEffect(
        GLOBE({
          el: vantaRef.current, // Target element via the ref
          THREE: THREE, // Pass the Three.js library
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x277178,
          color2: 0xfa8d7,
          ...props, // Allows passing custom options from parent component
        }),
      );
    }

    // 2. Clean up the effect when the component unmounts
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  // 3. Render container div with required styling and attach the ref
  return (
    <div
      ref={vantaRef}
      style={{
        width: "100%",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1, // Crucial to keep it behind your content
      }}
    >
      {/* Vanta.js will inject the animated canvas into this div */}
    </div>
  );
};

export default VantaClouds;
