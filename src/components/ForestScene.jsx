import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Tree = ({ position, health, scale = 1 }) => {
  const treeRef = useRef();
  const leavesRef = useRef();
  
  // Animate tree swaying with wind
  useFrame((state) => {
    if (treeRef.current) {
      const time = state.clock.getElapsedTime();
      treeRef.current.rotation.z = Math.sin(time + position[0]) * 0.05;
      
      if (leavesRef.current) {
        leavesRef.current.rotation.y = Math.sin(time * 0.5 + position[0]) * 0.1;
      }
    }
  });
  
  // Adjust tree appearance based on health
  const trunkColor = health > 0.6 ? '#4a3520' : '#3a2510';
  const leavesColor = health > 0.7 ? '#00A878' : 
                      health > 0.4 ? '#5fa878' : '#7a7a5a';
  
  const treeScale = scale * (0.7 + health * 0.3); // Trees shrink when health is low
  
  return (
    <group ref={treeRef} position={position}>
      {/* Trunk */}
      <mesh position={[0, 1 * treeScale, 0]} castShadow>
        <cylinderGeometry args={[0.15 * treeScale, 0.2 * treeScale, 2 * treeScale, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.8} />
      </mesh>
      
      {/* Leaves/Canopy */}
      <mesh ref={leavesRef} position={[0, 2.5 * treeScale, 0]} castShadow>
        <coneGeometry args={[1 * treeScale, 2 * treeScale, 8]} />
        <meshStandardMaterial 
          color={leavesColor} 
          roughness={0.7}
          transparent
          opacity={health > 0.3 ? 1 : 0.6}
        />
      </mesh>
      
      {/* Additional foliage layers */}
      <mesh position={[0, 3.3 * treeScale, 0]} castShadow>
        <coneGeometry args={[0.7 * treeScale, 1.5 * treeScale, 8]} />
        <meshStandardMaterial 
          color={leavesColor} 
          roughness={0.6}
          transparent
          opacity={health > 0.3 ? 0.9 : 0.5}
        />
      </mesh>
    </group>
  );
};

const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial 
        color="#1a4d2e" 
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
};

const Grass = ({ count = 200, health }) => {
  const grassRef = useRef();
  
  const grassPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      positions.push([
        (Math.random() - 0.5) * 40,
        0.1,
        (Math.random() - 0.5) * 40
      ]);
    }
    return positions;
  }, [count]);
  
  useFrame((state) => {
    if (grassRef.current) {
      const time = state.clock.getElapsedTime();
      grassRef.current.children.forEach((grass, i) => {
        grass.rotation.z = Math.sin(time + i * 0.5) * 0.1;
      });
    }
  });
  
  const grassColor = health > 0.6 ? '#4CAF50' : '#6B8E23';
  
  return (
    <group ref={grassRef}>
      {grassPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <coneGeometry args={[0.05, 0.3, 3]} />
          <meshStandardMaterial color={grassColor} />
        </mesh>
      ))}
    </group>
  );
};

const Particles = ({ count = 50 }) => {
  const particlesRef = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 30,
          Math.random() * 10,
          (Math.random() - 0.5) * 30
        ],
        speed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }
    return temp;
  }, [count]);
  
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      particlesRef.current.children.forEach((particle, i) => {
        particle.position.y += Math.sin(time + particles[i].phase) * 0.01;
        particle.position.x += Math.sin(time * 0.5) * 0.005;
        
        // Reset particle if it goes too high
        if (particle.position.y > 10) {
          particle.position.y = 0;
        }
      });
    }
  });
  
  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial 
            color="#FFE156" 
            transparent 
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

const ForestScene = ({ health = 0.5, timeOfDay = 'day' }) => {
  const fogRef = useRef();
  
  // Generate tree positions
  const trees = useMemo(() => {
    const positions = [];
    const radius = 15;
    const count = 30;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const distance = radius + (Math.random() - 0.5) * 10;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const scale = 0.8 + Math.random() * 0.4;
      
      positions.push({ position: [x, 0, z], scale });
    }
    
    return positions;
  }, []);
  
  // Lighting based on time of day
  const getLighting = () => {
    switch (timeOfDay) {
      case 'night':
        return {
          ambient: '#1a2744',
          directional: '#4a5f8f',
          intensity: 0.3,
          fogColor: '#0B132B',
          fogDensity: 0.1
        };
      case 'evening':
        return {
          ambient: '#ff9a56',
          directional: '#ffa856',
          intensity: 0.6,
          fogColor: '#ff9a56',
          fogDensity: 0.05
        };
      default: // day
        return {
          ambient: '#ffffff',
          directional: '#FFE156',
          intensity: 1,
          fogColor: health < 0.4 ? '#8a9ba8' : '#A7E8BD',
          fogDensity: health < 0.4 ? 0.08 : 0.02
        };
    }
  };
  
  const lighting = getLighting();
  
  useFrame((state) => {
    // Animate fog
    if (fogRef.current) {
      fogRef.current.density = lighting.fogDensity + 
        Math.sin(state.clock.getElapsedTime() * 0.5) * 0.01;
    }
  });
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={lighting.intensity * 0.5} color={lighting.ambient} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={lighting.intensity}
        color={lighting.directional}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#FFE156" />
      
      {/* Fog */}
      <fog ref={fogRef} attach="fog" args={[lighting.fogColor, 10, 50]} />
      
      {/* Scene Elements */}
      <Ground />
      <Grass count={200} health={health} />
      
      {/* Trees */}
      {trees.map((tree, i) => (
        <Tree 
          key={i} 
          position={tree.position} 
          health={health}
          scale={tree.scale}
        />
      ))}
      
      {/* Floating Particles (fireflies/sparkles) */}
      {health > 0.5 && <Particles count={30} />}
    </>
  );
};

export default ForestScene;
