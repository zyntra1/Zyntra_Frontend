import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple Tree Component
const Tree = ({ position, treeType, scale = 1 }) => {
  const meshRef = useRef();
  
  // Tree colors based on type
  const getTreeColor = () => {
    switch (treeType) {
      case 'healthy': return '#2d5016'; // Dark green
      case 'growing': return '#90ee90'; // Light green
      case 'wilting': return '#ff8c00'; // Orange
      case 'dead': return '#8b4513'; // Brown
      default: return '#2d5016';
    }
  };

  const getLeavesColor = () => {
    switch (treeType) {
      case 'healthy': return '#00ff00'; // Bright green
      case 'growing': return '#ffff00'; // Yellow
      case 'wilting': return '#ffa500'; // Orange
      case 'dead': return '#696969'; // Gray (no leaves)
      default: return '#00ff00';
    }
  };

  useFrame((state) => {
    if (meshRef.current && treeType !== 'dead') {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.z = Math.sin(time * 0.5 + position[0]) * 0.05;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Tree trunk */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 2, 8]} />
        <meshStandardMaterial color={getTreeColor()} />
      </mesh>
      
      {/* Tree foliage */}
      {treeType !== 'dead' ? (
        <>
          <mesh ref={meshRef} position={[0, 2.5, 0]}>
            <coneGeometry args={[1, 2, 8]} />
            <meshStandardMaterial color={getLeavesColor()} />
          </mesh>
          <mesh position={[0, 3.2, 0]}>
            <coneGeometry args={[0.7, 1.5, 8]} />
            <meshStandardMaterial color={getLeavesColor()} />
          </mesh>
        </>
      ) : (
        // Dead tree - bare branches
        <>
          <mesh position={[0.3, 2, 0]} rotation={[0, 0, Math.PI / 6]}>
            <cylinderGeometry args={[0.05, 0.05, 1, 4]} />
            <meshStandardMaterial color={getTreeColor()} />
          </mesh>
          <mesh position={[-0.3, 2, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[0.05, 0.05, 1, 4]} />
            <meshStandardMaterial color={getTreeColor()} />
          </mesh>
        </>
      )}
    </group>
  );
};

// Flower Component
const Flower = ({ position }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = time * 0.5;
    }
  });

  return (
    <group position={position} ref={meshRef}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 4]} />
        <meshStandardMaterial color="#90ee90" />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ff69b4" />
      </mesh>
    </group>
  );
};

// Bird Component
const Bird = ({ position, index }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.x = position[0] + Math.sin(time * 0.5 + index) * 5;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.3 + index) * 2;
      meshRef.current.position.z = position[2] + Math.cos(time * 0.5 + index) * 5;
      meshRef.current.rotation.y = Math.sin(time * 0.5 + index) * 0.5;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#4169e1" />
      </mesh>
      <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.3, 0.05, 0.15]} />
        <meshStandardMaterial color="#4169e1" />
      </mesh>
      <mesh position={[-0.2, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.3, 0.05, 0.15]} />
        <meshStandardMaterial color="#4169e1" />
      </mesh>
    </group>
  );
};

// Butterfly Component
const Butterfly = ({ position, index }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.x = position[0] + Math.sin(time * 2 + index) * 2;
      meshRef.current.position.y = position[1] + Math.sin(time * 3 + index) * 1;
      meshRef.current.position.z = position[2] + Math.cos(time * 2 + index) * 2;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh position={[0.1, 0, 0]}>
        <boxGeometry args={[0.15, 0.2, 0.02]} />
        <meshStandardMaterial color="#9370db" />
      </mesh>
      <mesh position={[-0.1, 0, 0]}>
        <boxGeometry args={[0.15, 0.2, 0.02]} />
        <meshStandardMaterial color="#9370db" />
      </mesh>
    </group>
  );
};

// Rock Component
const Rock = ({ position, scale = 1 }) => {
  return (
    <mesh position={position} scale={scale}>
      <dodecahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color="#808080" roughness={0.8} />
    </mesh>
  );
};

// Stream Component
const Stream = () => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.material.uniforms.time.value = time;
    }
  });

  const streamMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color('#4169e1') }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        void main() {
          float wave = sin(vUv.x * 10.0 + time * 2.0) * 0.5 + 0.5;
          gl_FragColor = vec4(color * wave, 0.6);
        }
      `,
      transparent: true
    });
  }, []);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
      <planeGeometry args={[15, 2, 32, 4]} />
      <primitive object={streamMaterial} />
    </mesh>
  );
};

// Bench Component
const Bench = ({ position }) => {
  return (
    <group position={position}>
      {/* Seat */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.9, -0.2]}>
        <boxGeometry args={[1.5, 0.6, 0.1]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Legs */}
      <mesh position={[0.6, 0.25, 0.15]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[-0.6, 0.25, 0.15]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0.6, 0.25, -0.15]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[-0.6, 0.25, -0.15]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    </group>
  );
};

// Ground Component
const Ground = ({ soilQuality }) => {
  const getGroundColor = () => {
    if (soilQuality >= 75) return '#2d5016'; // Rich dark green
    if (soilQuality >= 50) return '#556b2f'; // Dark olive green
    if (soilQuality >= 25) return '#8b7355'; // Light brown
    return '#654321'; // Dark brown
  };

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color={getGroundColor()} />
    </mesh>
  );
};

// Main Wellness Forest Scene
const WellnessForestScene = ({ forestData }) => {
  // Generate tree positions based on forest data
  const trees = useMemo(() => {
    if (!forestData) return [];
    
    const treeArray = [];
    const spread = 20;
    
    // Add healthy trees
    for (let i = 0; i < forestData.healthy_trees; i++) {
      treeArray.push({
        position: [
          (Math.random() - 0.5) * spread,
          0,
          (Math.random() - 0.5) * spread
        ],
        type: 'healthy',
        scale: 0.8 + Math.random() * 0.4
      });
    }
    
    // Add growing trees
    for (let i = 0; i < forestData.growing_trees; i++) {
      treeArray.push({
        position: [
          (Math.random() - 0.5) * spread,
          0,
          (Math.random() - 0.5) * spread
        ],
        type: 'growing',
        scale: 0.6 + Math.random() * 0.3
      });
    }
    
    // Add wilting trees
    for (let i = 0; i < forestData.wilting_trees; i++) {
      treeArray.push({
        position: [
          (Math.random() - 0.5) * spread,
          0,
          (Math.random() - 0.5) * spread
        ],
        type: 'wilting',
        scale: 0.5 + Math.random() * 0.3
      });
    }
    
    // Add dead trees
    for (let i = 0; i < forestData.dead_trees; i++) {
      treeArray.push({
        position: [
          (Math.random() - 0.5) * spread,
          0,
          (Math.random() - 0.5) * spread
        ],
        type: 'dead',
        scale: 0.4 + Math.random() * 0.2
      });
    }
    
    return treeArray;
  }, [forestData]);

  // Generate flowers if unlocked
  const flowers = useMemo(() => {
    if (!forestData?.has_flowers) return [];
    const flowerArray = [];
    const count = Math.min(20, forestData.healthy_trees);
    for (let i = 0; i < count; i++) {
      flowerArray.push([
        (Math.random() - 0.5) * 18,
        0,
        (Math.random() - 0.5) * 18
      ]);
    }
    return flowerArray;
  }, [forestData]);

  // Generate rocks (always present)
  const rocks = useMemo(() => {
    const rockArray = [];
    for (let i = 0; i < 15; i++) {
      rockArray.push({
        position: [
          (Math.random() - 0.5) * 22,
          0,
          (Math.random() - 0.5) * 22
        ],
        scale: 0.5 + Math.random() * 1
      });
    }
    return rockArray;
  }, []);

  // Lighting based on time of day and weather
  const getLighting = () => {
    const sunlightLevel = forestData?.sunlight_level || 50;
    const airQuality = forestData?.air_quality || 50;
    const intensity = (sunlightLevel / 100) * 1.5;
    const ambientIntensity = (airQuality / 100) * 0.5;

    return { intensity, ambientIntensity };
  };

  const { intensity, ambientIntensity } = getLighting();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={ambientIntensity + 0.3} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={intensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.3} />

      {/* Ground */}
      <Ground soilQuality={forestData?.soil_quality || 50} />

      {/* Trees */}
      {trees.map((tree, index) => (
        <Tree
          key={`tree-${index}`}
          position={tree.position}
          treeType={tree.type}
          scale={tree.scale}
        />
      ))}

      {/* Flowers */}
      {flowers.map((position, index) => (
        <Flower key={`flower-${index}`} position={position} />
      ))}

      {/* Birds */}
      {forestData?.has_birds && [0, 1, 2].map((index) => (
        <Bird key={`bird-${index}`} position={[0, 5, 0]} index={index} />
      ))}

      {/* Butterflies */}
      {forestData?.has_butterflies && [0, 1, 2, 3, 4].map((index) => (
        <Butterfly key={`butterfly-${index}`} position={[0, 2, 0]} index={index} />
      ))}

      {/* Stream */}
      {forestData?.has_stream && <Stream />}

      {/* Rocks */}
      {rocks.map((rock, index) => (
        <Rock key={`rock-${index}`} position={rock.position} scale={rock.scale} />
      ))}

      {/* Bench */}
      {forestData?.has_bench && <Bench position={[5, 0, 8]} />}

      {/* Fog based on air quality */}
      <fog attach="fog" args={['#e0e0e0', 10, 40 - (forestData?.air_quality || 50) / 5]} />
    </>
  );
};

export default WellnessForestScene;
