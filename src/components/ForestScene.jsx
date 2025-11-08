import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Realistic Sun Component - Only visible during day
const Sun = ({ sunlightBoost }) => {
  const sunRef = useRef();
  const coronaRef = useRef();
  
  useFrame((state) => {
    if (sunRef.current) {
      const time = state.clock.getElapsedTime();
      sunRef.current.rotation.y = time * 0.05;
    }
    if (coronaRef.current) {
      const time = state.clock.getElapsedTime();
      coronaRef.current.rotation.z = time * 0.1;
      coronaRef.current.scale.set(
        1 + Math.sin(time * 2) * 0.05,
        1 + Math.sin(time * 2) * 0.05,
        1
      );
    }
  });
  
  return (
    <group ref={sunRef} position={[25, 20, -30]}>
      {/* Sun core - bright yellow */}
      <mesh>
        <sphereGeometry args={[3, 64, 64]} />
        <meshBasicMaterial 
          color="#FFFF00"
        />
      </mesh>
      
      {/* Inner glow - bright yellow */}
      <mesh>
        <sphereGeometry args={[3.3, 64, 64]} />
        <meshBasicMaterial 
          color="#FFFF00"
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Outer glow - yellow */}
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial 
          color="#FFFF00"
          transparent
          opacity={0.25}
        />
      </mesh>
      
      {/* Atmospheric glow */}
      <mesh>
        <sphereGeometry args={[5.5, 32, 32]} />
        <meshBasicMaterial 
          color="#FFFF66"
          transparent
          opacity={0.1}
        />
      </mesh>
      
      {/* Corona effect - rotating subtle rays */}
      <group ref={coronaRef}>
        {[...Array(16)].map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const length = 2 + Math.random() * 1;
          return (
            <mesh 
              key={i}
              position={[Math.cos(angle) * 4.5, Math.sin(angle) * 4.5, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.08, length, 0.08]} />
              <meshBasicMaterial 
                color="#FFFF00"
                transparent
                opacity={0.4}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Lens flare effect */}
      <mesh position={[0, 0, 0.5]}>
        <sphereGeometry args={[3.8, 32, 32]} />
        <meshBasicMaterial 
          color="#FFFACD"
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
};

// Realistic Moon Component - Only visible during night
const Moon = () => {
  const moonRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    if (moonRef.current) {
      const time = state.clock.getElapsedTime();
      moonRef.current.rotation.y = time * 0.02;
    }
    if (glowRef.current) {
      const time = state.clock.getElapsedTime();
      glowRef.current.scale.set(
        1 + Math.sin(time * 1.5) * 0.03,
        1 + Math.sin(time * 1.5) * 0.03,
        1
      );
    }
  });
  
  return (
    <group position={[-22, 22, -28]}>
      {/* Moon surface - realistic color */}
      <mesh ref={moonRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial 
          color="#D4D4D4"
          roughness={0.9}
          metalness={0.1}
          emissive="#B8B8B8"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Large craters - Mare (dark spots) */}
      <mesh position={[0.8, 0.6, 2.45]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial 
          color="#9A9A9A"
          roughness={0.95}
        />
      </mesh>
      <mesh position={[-0.7, -0.6, 2.45]}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial 
          color="#A5A5A5"
          roughness={0.95}
        />
      </mesh>
      <mesh position={[0.4, -1, 2.45]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial 
          color="#ABABAB"
          roughness={0.95}
        />
      </mesh>
      <mesh position={[-1, 0.3, 2.4]}>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshStandardMaterial 
          color="#B0B0B0"
          roughness={0.95}
        />
      </mesh>
      
      {/* Small craters */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 1.5 + Math.random() * 0.8;
        const size = 0.1 + Math.random() * 0.15;
        return (
          <mesh 
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius,
              2.4
            ]}
          >
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial 
              color="#BEBEBE"
              roughness={0.95}
            />
          </mesh>
        );
      })}
      
      {/* Soft glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial 
          color="#E8E8E8"
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Outer atmospheric glow */}
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial 
          color="#C8D5E8"
          transparent
          opacity={0.08}
        />
      </mesh>
      
      {/* Stars in the night sky */}
      {[...Array(30)].map((_, i) => {
        const angle1 = Math.random() * Math.PI * 2;
        const angle2 = Math.random() * Math.PI;
        const distance = 15 + Math.random() * 10;
        const size = 0.05 + Math.random() * 0.1;
        const brightness = 0.5 + Math.random() * 0.5;
        
        return (
          <mesh 
            key={`star-${i}`}
            position={[
              Math.cos(angle1) * Math.sin(angle2) * distance,
              Math.cos(angle2) * distance,
              Math.sin(angle1) * Math.sin(angle2) * distance - 10
            ]}
          >
            <sphereGeometry args={[size, 8, 8]} />
            <meshBasicMaterial 
              color="#FFFFFF"
              transparent
              opacity={brightness}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Clouds Component
const Cloud = ({ position, scale = 1 }) => {
  const cloudRef = useRef();
  
  useFrame((state) => {
    if (cloudRef.current) {
      const time = state.clock.getElapsedTime();
      cloudRef.current.position.x = position[0] + Math.sin(time * 0.1) * 2;
    }
  });
  
  return (
    <group ref={cloudRef} position={position}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8 * scale, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0.7 * scale, 0, 0]}>
        <sphereGeometry args={[0.6 * scale, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
      </mesh>
      <mesh position={[-0.6 * scale, 0, 0]}>
        <sphereGeometry args={[0.7 * scale, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

const Clouds = ({ timeOfDay }) => {
  const cloudData = useMemo(() => [
    { position: [-15, 12, -15], scale: 1.2 },
    { position: [10, 14, -18], scale: 1 },
    { position: [5, 13, -20], scale: 1.3 },
    { position: [-8, 15, -22], scale: 0.9 },
  ], []);
  
  // More clouds during day
  if (timeOfDay === 'day') {
    return (
      <group>
        {cloudData.map((cloud, i) => (
          <Cloud key={i} position={cloud.position} scale={cloud.scale} />
        ))}
      </group>
    );
  }
  
  return null;
};

// Birds Component - Colorful birds!
const Bird = ({ position, delay = 0, colorScheme = 'blue' }) => {
  const birdRef = useRef();
  const wingRef1 = useRef();
  const wingRef2 = useRef();
  
  // Random movement parameters for each bird
  const randomPath = useMemo(() => ({
    radiusX: 10 + Math.random() * 8,
    radiusZ: 10 + Math.random() * 8,
    speedX: 0.2 + Math.random() * 0.3,
    speedZ: 0.15 + Math.random() * 0.25,
    speedY: 0.3 + Math.random() * 0.4,
    heightBase: 6 + Math.random() * 4,
    heightVariation: 1 + Math.random() * 2,
    offsetX: Math.random() * Math.PI * 2,
    offsetZ: Math.random() * Math.PI * 2
  }), []);
  
  const colors = {
    blue: { body: '#4169E1', wings: '#1E90FF', accent: '#87CEEB' },
    red: { body: '#DC143C', wings: '#FF6347', accent: '#FFA07A' },
    yellow: { body: '#FFD700', wings: '#FFA500', accent: '#FFFF00' },
    green: { body: '#32CD32', wings: '#90EE90', accent: '#98FB98' }
  };
  
  const birdColors = colors[colorScheme] || colors.blue;
  
  useFrame((state) => {
    if (birdRef.current) {
      const time = state.clock.getElapsedTime() + delay;
      
      // Random flying pattern
      birdRef.current.position.x = Math.cos(time * randomPath.speedX + randomPath.offsetX) * randomPath.radiusX;
      birdRef.current.position.z = Math.sin(time * randomPath.speedZ + randomPath.offsetZ) * randomPath.radiusZ;
      birdRef.current.position.y = randomPath.heightBase + Math.sin(time * randomPath.speedY) * randomPath.heightVariation;
      
      // Face direction of movement
      const dx = Math.cos((time + 0.01) * randomPath.speedX + randomPath.offsetX) * randomPath.radiusX - birdRef.current.position.x;
      const dz = Math.sin((time + 0.01) * randomPath.speedZ + randomPath.offsetZ) * randomPath.radiusZ - birdRef.current.position.z;
      birdRef.current.rotation.y = Math.atan2(dx, dz);
      
      // Animate wings
      if (wingRef1.current && wingRef2.current) {
        const wingFlap = Math.sin(time * 8) * 0.5;
        wingRef1.current.rotation.z = wingFlap;
        wingRef2.current.rotation.z = -wingFlap;
      }
    }
  });
  
  return (
    <group ref={birdRef} position={position}>
      {/* Body */}
      <mesh>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color={birdColors.body} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0.15, 0.05, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color={birdColors.body} />
      </mesh>
      
      {/* Beak */}
      <mesh position={[0.22, 0.05, 0]}>
        <coneGeometry args={[0.03, 0.08, 8]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
      
      {/* Left wing */}
      <mesh ref={wingRef1} position={[-0.08, 0, 0.15]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.3, 0.03, 0.15]} />
        <meshStandardMaterial color={birdColors.wings} />
      </mesh>
      
      {/* Right wing */}
      <mesh ref={wingRef2} position={[-0.08, 0, -0.15]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.3, 0.03, 0.15]} />
        <meshStandardMaterial color={birdColors.wings} />
      </mesh>
      
      {/* Tail */}
      <mesh position={[-0.2, 0, 0]}>
        <coneGeometry args={[0.06, 0.15, 8]} />
        <meshStandardMaterial color={birdColors.accent} />
      </mesh>
    </group>
  );
};

const Birds = ({ timeOfDay }) => {
  // Birds only fly during day
  if (timeOfDay !== 'day') return null;
  
  return (
    <group>
      <Bird position={[0, 8, 0]} delay={0} colorScheme="blue" />
      <Bird position={[5, 9, 5]} delay={2} colorScheme="red" />
      <Bird position={[-5, 8, -5]} delay={4} colorScheme="yellow" />
      <Bird position={[8, 7, -3]} delay={6} colorScheme="green" />
      <Bird position={[-7, 9, 4]} delay={8} colorScheme="blue" />
    </group>
  );
};

// Butterfly Component
const Butterfly = ({ position, delay = 0, colorScheme = 'purple' }) => {
  const butterflyRef = useRef();
  const wingRef1 = useRef();
  const wingRef2 = useRef();
  
  const colors = {
    purple: { body: '#9370DB', wings: '#DA70D6', spots: '#FFD700' },
    orange: { body: '#FF8C00', wings: '#FFA500', spots: '#FFD700' },
    blue: { body: '#4169E1', wings: '#87CEEB', spots: '#FFFFFF' },
    pink: { body: '#FF69B4', wings: '#FFB6C1', spots: '#FFFFFF' }
  };
  
  const butterflyColors = colors[colorScheme] || colors.purple;
  
  useFrame((state) => {
    if (butterflyRef.current) {
      const time = state.clock.getElapsedTime() + delay;
      butterflyRef.current.position.x = position[0] + Math.sin(time * 0.5) * 3;
      butterflyRef.current.position.z = position[2] + Math.cos(time * 0.7) * 3;
      butterflyRef.current.position.y = position[1] + Math.sin(time * 1.5) * 1;
      
      // Animate wings
      if (wingRef1.current && wingRef2.current) {
        const wingFlap = Math.sin(time * 10) * 0.8;
        wingRef1.current.rotation.y = wingFlap;
        wingRef2.current.rotation.y = -wingFlap;
      }
    }
  });
  
  return (
    <group ref={butterflyRef} position={position}>
      {/* Body */}
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
        <meshStandardMaterial color={butterflyColors.body} />
      </mesh>
      
      {/* Left wing */}
      <mesh ref={wingRef1} position={[0.1, 0, 0]} rotation={[0, 0.3, 0]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial color={butterflyColors.wings} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.12, 0, 0]}>
        <circleGeometry args={[0.03, 8]} />
        <meshStandardMaterial color={butterflyColors.spots} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Right wing */}
      <mesh ref={wingRef2} position={[-0.1, 0, 0]} rotation={[0, -0.3, 0]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial color={butterflyColors.wings} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.12, 0, 0]}>
        <circleGeometry args={[0.03, 8]} />
        <meshStandardMaterial color={butterflyColors.spots} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const Butterflies = ({ hasButterflies }) => {
  if (!hasButterflies) return null;
  
  return (
    <group>
      <Butterfly position={[3, 2, 2]} delay={0} colorScheme="purple" />
      <Butterfly position={[-4, 1.5, -3]} delay={2} colorScheme="orange" />
      <Butterfly position={[6, 2.5, -5]} delay={4} colorScheme="blue" />
      <Butterfly position={[-5, 2, 4]} delay={6} colorScheme="pink" />
      <Butterfly position={[2, 3, -2]} delay={8} colorScheme="purple" />
    </group>
  );
};

// Rock Component
const Rock = ({ position, scale, rotation }) => {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#808080" roughness={0.9} metalness={0.1} />
    </mesh>
  );
};

// Bench Component
const Bench = ({ position, rotation }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.4]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.7, -0.15]}>
        <boxGeometry args={[1.2, 0.5, 0.08]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      {/* Left Leg */}
      <mesh position={[-0.5, 0.2, -0.1]}>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>
      {/* Right Leg */}
      <mesh position={[0.5, 0.2, -0.1]}>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>
      {/* Left Front Leg */}
      <mesh position={[-0.5, 0.2, 0.15]}>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>
      {/* Right Front Leg */}
      <mesh position={[0.5, 0.2, 0.15]}>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>
      {/* Armrest Left */}
      <mesh position={[-0.55, 0.6, 0.05]}>
        <boxGeometry args={[0.08, 0.08, 0.3]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      {/* Armrest Right */}
      <mesh position={[0.55, 0.6, 0.05]}>
        <boxGeometry args={[0.08, 0.08, 0.3]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
    </group>
  );
};

// Pond component with animated blue water
const Pond = ({ hasStream, waterLevel }) => {
  const waterRef = useRef();
  const rippleRef = useRef();
  
  // Water size based on water level (50-100% = 3-5 units radius)
  const waterRadius = 3 + (waterLevel / 100) * 2;
  const waterOpacity = 0.6 + (waterLevel / 100) * 0.3; // More transparent when low
  
  useFrame((state) => {
    if (!hasStream) return;
    
    const time = state.clock.getElapsedTime();
    
    // Gentle water movement
    if (waterRef.current) {
      waterRef.current.position.y = 0.05 + Math.sin(time * 0.5) * 0.02;
    }
    
    // Ripple animation
    if (rippleRef.current) {
      rippleRef.current.position.y = 0.07 + Math.cos(time * 0.7) * 0.015;
      rippleRef.current.rotation.z = time * 0.1;
    }
  });
  
  if (!hasStream) return null;
  
  return (
    <group position={[0, 0, -5]}>
      {/* Water surface - Blue (size varies with water level) */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[waterRadius, 32]} />
        <meshStandardMaterial 
          color="#1E90FF" 
          transparent 
          opacity={waterOpacity} 
          metalness={0.7} 
          roughness={0.15}
        />
      </mesh>
      {/* Water ripple effect */}
      <mesh ref={rippleRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[waterRadius - 0.5, 32]} />
        <meshStandardMaterial 
          color="#4682B4" 
          transparent 
          opacity={waterOpacity * 0.6} 
          metalness={0.6} 
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

// Simple fallback tree if model doesn't load
const FallbackTree = ({ position, health, scale, hasFlowers, hasNewLeaves, treeType, season }) => {
  const treeRef = useRef();
  
  useFrame((state) => {
    if (treeRef.current) {
      const time = state.clock.getElapsedTime();
      const windStrength = treeType === 'dead' ? 0.01 : 0.03;
      treeRef.current.rotation.z = Math.sin(time * 0.8 + position[0]) * windStrength;
    }
  });
  
  // Determine colors based on tree type and season - ENHANCED for clear visibility
  const getTreeColors = () => {
    let baseColors;
    
    if (treeType === 'healthy') {
      // Rich, vibrant green for healthy trees
      baseColors = { trunkColor: '#654321', leavesColor: '#228B22' }; // Forest green
    } else if (treeType === 'growing') {
      // Bright, light green for growing trees
      baseColors = { trunkColor: '#7a6b5d', leavesColor: '#7FFF00' }; // Chartreuse - very bright
    } else if (treeType === 'wilting') {
      // Orange/yellow for wilting trees
      baseColors = { trunkColor: '#5d4e37', leavesColor: '#FFA500' }; // Bright orange
    } else if (treeType === 'dead') {
      // Dark, grayish for dead trees
      baseColors = { trunkColor: '#2b1f15', leavesColor: '#696969' };
    } else {
      // Original health-based coloring as fallback
      const trunkColor = health > 0.6 ? '#654321' : health > 0.3 ? '#4a3520' : '#3a2510';
      const leavesColor = health > 0.8 ? '#228B22' : health > 0.6 ? '#3d6b1f' : 
                          health > 0.4 ? '#90ee90' : health > 0.2 ? '#FFA500' : '#696969';
      baseColors = { trunkColor, leavesColor };
    }
    
    // Modify colors based on season (if not dead) - override only for specific seasons
    if (treeType !== 'dead' && season) {
      if (season === 'autumn') {
        // Autumn colors: keep wilting orange, make others autumn-colored
        if (treeType === 'wilting') {
          baseColors.leavesColor = '#FF8C00'; // Dark orange
        } else if (treeType === 'healthy') {
          baseColors.leavesColor = '#DC143C'; // Crimson red for autumn
        } else {
          baseColors.leavesColor = '#D2691E'; // Chocolate brown
        }
      } else if (season === 'winter') {
        baseColors.leavesColor = '#E0F7FA'; // Light snowy blue-white
      } else if (season === 'spring') {
        // Spring: enhance the natural colors to be more vibrant
        if (treeType === 'growing') {
          baseColors.leavesColor = '#ADFF2F'; // Green-yellow spring
        } else if (treeType === 'healthy') {
          baseColors.leavesColor = '#32CD32'; // Lime green
        }
      }
    }
    
    return baseColors;
  };
  
  const { trunkColor, leavesColor } = getTreeColors();
  const leavesScale = treeType === 'dead' ? 0.3 : 1; // Dead trees have minimal leaves
  
  return (
    <group ref={treeRef} position={position}>
      {/* Trunk */}
      <mesh position={[0, 1.5 * scale, 0]} castShadow>
        <cylinderGeometry args={[0.15 * scale, 0.25 * scale, 3 * scale, 12]} />
        <meshStandardMaterial color={trunkColor} roughness={0.95} />
      </mesh>
      
      {/* Leaves/Foliage - reduced for dead trees */}
      {treeType !== 'dead' ? (
        <mesh position={[0, 3.5 * scale, 0]} castShadow>
          <sphereGeometry args={[1.5 * scale * leavesScale, 16, 16]} />
          <meshStandardMaterial color={leavesColor} roughness={0.9} />
        </mesh>
      ) : (
        // Dead tree - just some bare branches
        <>
          <mesh position={[0.5 * scale, 2.5 * scale, 0]} castShadow>
            <cylinderGeometry args={[0.05 * scale, 0.05 * scale, 1 * scale, 4]} />
            <meshStandardMaterial color={trunkColor} roughness={0.95} />
          </mesh>
          <mesh position={[-0.5 * scale, 2.8 * scale, 0]} castShadow>
            <cylinderGeometry args={[0.05 * scale, 0.05 * scale, 0.8 * scale, 4]} />
            <meshStandardMaterial color={trunkColor} roughness={0.95} />
          </mesh>
        </>
      )}
      
      {/* Flowers only for healthy/growing trees */}
      {hasFlowers && treeType !== 'dead' && (
        <mesh position={[0.8 * scale, 3.5 * scale, 0]} castShadow>
          <sphereGeometry args={[0.15 * scale, 8, 8]} />
          <meshStandardMaterial color="#FF69B4" emissive="#FF1493" emissiveIntensity={0.5} />
        </mesh>
      )}
      
      {/* New leaves only for healthy/growing trees */}
      {hasNewLeaves && treeType !== 'dead' && treeType !== 'wilting' && (
        <mesh position={[-0.8 * scale, 3.8 * scale, 0]} castShadow>
          <sphereGeometry args={[0.2 * scale, 8, 8]} />
          <meshStandardMaterial color="#90EE90" emissive="#7CFC00" emissiveIntensity={0.4} />
        </mesh>
      )}
    </group>
  );
};

const Tree = ({ position, health, scale = 1, hasFlowers = false, hasNewLeaves = false, treeType, season }) => {
  const treeRef = useRef();
  const groupRef = useRef();
  
  // Try to load tree model - you'll need to add actual tree models to public/models/
  // For now, we'll use a fallback
  // Uncomment when you have tree models:
  // const { scene } = useGLTF('/models/tree.glb', true);
  
  const useModelTree = false; // Set to true when you have models
  
  // Animate tree swaying with wind
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      const windStrength = treeType === 'dead' ? 0.005 : 0.02;
      groupRef.current.rotation.z = Math.sin(time * 0.8 + position[0]) * windStrength;
      groupRef.current.rotation.x = Math.sin(time * 0.5 + position[2]) * windStrength * 0.5;
    }
  });
  
  // Realistic tree colors based on health and tree type - ENHANCED
  const getTreeColors = () => {
    if (treeType === 'healthy') {
      return {
        trunkColor: '#654321',
        barkHighlight: '#8B7355',
        leavesColor: '#228B22', // Rich forest green
        leafHighlight: '#32CD32' // Lime green highlight
      };
    } else if (treeType === 'growing') {
      return {
        trunkColor: '#7a6b5d',
        barkHighlight: '#8B7355',
        leavesColor: '#7FFF00', // Chartreuse - bright young green
        leafHighlight: '#ADFF2F' // Green-yellow highlight
      };
    } else if (treeType === 'wilting') {
      return {
        trunkColor: '#5d4e37',
        barkHighlight: '#6B5345',
        leavesColor: '#FFA500', // Bright orange
        leafHighlight: '#FFD700' // Golden yellow
      };
    } else if (treeType === 'dead') {
      return {
        trunkColor: '#2b1f15',
        barkHighlight: '#3a2510',
        leavesColor: '#696969', // Dark gray (minimal leaves)
        leafHighlight: '#808080'
      };
    } else {
      // Original health-based coloring with enhanced colors
      const trunkColor = health > 0.7 ? '#654321' : 
                         health > 0.5 ? '#5d4e37' : 
                         health > 0.3 ? '#4a3520' : 
                         '#2b1f15';
      const barkHighlight = health > 0.5 ? '#8B7355' : '#6B5345';
      const leavesColor = health > 0.8 ? '#228B22' :  // Healthy green
                          health > 0.6 ? '#3CB371' :  // Medium sea green
                          health > 0.4 ? '#90EE90' :  // Light green
                          health > 0.2 ? '#FFA500' :  // Orange (wilting)
                          '#696969';                   // Gray (dead)
      const leafHighlight = health > 0.6 ? '#32CD32' : health > 0.4 ? '#ADFF2F' : '#FFD700';
      return { trunkColor, barkHighlight, leavesColor, leafHighlight };
    }
  };
  
  const { trunkColor, barkHighlight, leavesColor, leafHighlight } = getTreeColors();
  
  const treeScale = scale * (0.75 + health * 0.25);
  
  // If you want to use model trees, set useModelTree to true and uncomment the model loading
  if (useModelTree) {
    // When you have tree models, the code will use them here
    // const clonedScene = useMemo(() => scene.clone(), [scene]);
    
    return (
      <group ref={groupRef} position={position} scale={[treeScale, treeScale, treeScale]}>
        {/* <primitive object={clonedScene} castShadow receiveShadow /> */}
        
        {/* Add effects on top of model */}
        {hasFlowers && (
          <group position={[0, 3, 0]}>
            {[...Array(6)].map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(angle) * 1.2, Math.random() * 0.5, Math.sin(angle) * 1.2]}>
                  <sphereGeometry args={[0.12, 8, 8]} />
                  <meshStandardMaterial color="#FF69B4" emissive="#FF1493" emissiveIntensity={0.6} />
                </mesh>
              );
            })}
          </group>
        )}
        
        {hasNewLeaves && (
          <group position={[0, 3, 0]}>
            {[...Array(4)].map((_, i) => {
              const angle = (i / 4) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(angle) * 1.1, Math.random() * 0.6, Math.sin(angle) * 1.1]}>
                  <sphereGeometry args={[0.18, 8, 8]} />
                  <meshStandardMaterial color="#90EE90" emissive="#7CFC00" emissiveIntensity={0.5} />
                </mesh>
              );
            })}
          </group>
        )}
      </group>
    );
  }
  
  // Use fallback tree (current simplified version)
  return <FallbackTree position={position} health={health} scale={treeScale} hasFlowers={hasFlowers} hasNewLeaves={hasNewLeaves} treeType={treeType} season={season} />;
};

const Ground = ({ soilQuality, season }) => {
  // Soil color based on quality and season
  const getGroundColor = () => {
    let baseColor = '#1a4d2e'; // Default green
    
    // Adjust based on soil quality
    if (soilQuality < 30) {
      baseColor = '#4a3f35'; // Poor soil - brownish
    } else if (soilQuality < 60) {
      baseColor = '#2d5016'; // Medium soil - darker green
    } else {
      baseColor = '#1a4d2e'; // Good soil - healthy green
    }
    
    // Adjust for season
    if (season === 'winter') {
      baseColor = '#e8f4f8'; // Snowy white-blue
    } else if (season === 'autumn') {
      baseColor = '#3d2817'; // Brown autumn ground
    } else if (season === 'spring') {
      baseColor = '#2d7a3f'; // Vibrant spring green
    }
    
    return baseColor;
  };
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial 
        color={getGroundColor()} 
        roughness={season === 'winter' ? 0.3 : 0.9}
        metalness={season === 'winter' ? 0.4 : 0.1}
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

// Weather Effects Component
const WeatherEffects = ({ weather }) => {
  const particlesRef = useRef();
  
  const weatherParticles = useMemo(() => {
    if (weather === 'clear' || weather === 'sunny') return [];
    
    const particles = [];
    const count = weather === 'rainy' ? 200 : weather === 'snowy' ? 150 : 100;
    
    for (let i = 0; i < count; i++) {
      particles.push({
        position: [
          (Math.random() - 0.5) * 50,
          Math.random() * 20 + 10,
          (Math.random() - 0.5) * 50
        ],
        speed: weather === 'rainy' ? 0.3 : weather === 'snowy' ? 0.05 : 0.1,
        drift: Math.random() * 0.02 - 0.01
      });
    }
    return particles;
  }, [weather]);
  
  useFrame(() => {
    if (!particlesRef.current) return;
    
    particlesRef.current.children.forEach((particle, i) => {
      particle.position.y -= weatherParticles[i].speed;
      
      // Add drift for snow
      if (weather === 'snowy') {
        particle.position.x += weatherParticles[i].drift;
      }
      
      // Reset position when particle falls below ground
      if (particle.position.y < 0) {
        particle.position.y = 20;
        particle.position.x = (Math.random() - 0.5) * 50;
        particle.position.z = (Math.random() - 0.5) * 50;
      }
    });
  });
  
  if (weather === 'clear' || weather === 'sunny') return null;
  
  const particleColor = weather === 'rainy' ? '#4a90e2' : weather === 'snowy' ? '#ffffff' : '#d0d0d0';
  const particleSize = weather === 'rainy' ? 0.05 : weather === 'snowy' ? 0.15 : 0.08;
  
  return (
    <group ref={particlesRef}>
      {weatherParticles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particleSize, 4, 4]} />
          <meshBasicMaterial color={particleColor} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};

const ForestScene = ({ health = 0.5, timeOfDay = 'day', ecoActions = {}, screenTime = 0, wellnessData = null }) => {
  const fogRef = useRef();
  
  // Use wellness data if available, otherwise use eco actions
  const hasFlowers = wellnessData?.has_flowers || ecoActions.ecoTravel || false;
  const hasBirds = wellnessData?.has_birds || false;
  const hasButterflies = wellnessData?.has_butterflies || false;
  const hasStream = wellnessData?.has_stream || false;
  const hasBenches = wellnessData?.has_bench || false;
  const hasRocks = wellnessData?.has_rocks || false;
  const hasNewLeaves = ecoActions.lightsOff || false;
  const showDigitalFog = wellnessData ? (wellnessData.air_quality < 50) : (screenTime > 4);
  const tiredTrees = ecoActions.longWork || false;
  const sunlightBoost = wellnessData ? (wellnessData.sunlight_level > 50 ? 1.3 : 1) : (ecoActions.exercise ? 1.3 : 1);
  const sunlightBoostForSun = wellnessData ? (wellnessData.sunlight_level / 100) : (ecoActions.exercise ? 1 : 0.7);
  const season = wellnessData?.season || 'summer';
  const weather = wellnessData?.weather || 'clear';
  const waterLevel = wellnessData?.water_level || 50;
  const soilQuality = wellnessData?.soil_quality || 50;
  
  // Calculate tree types from wellness data
  const treeTypes = wellnessData ? {
    healthy: wellnessData.healthy_trees || 0,
    growing: wellnessData.growing_trees || 0,
    wilting: wellnessData.wilting_trees || 0,
    dead: wellnessData.dead_trees || 0,
    total: wellnessData.total_trees || 30
  } : null;
  
  // Generate tree positions
  const trees = useMemo(() => {
    const positions = [];
    const radius = 15;
    const count = treeTypes ? treeTypes.total : 30;
    
    // If we have wellness data, assign tree types based on counts
    if (treeTypes) {
      let currentIndex = 0;
      
      // Add healthy trees
      for (let i = 0; i < treeTypes.healthy; i++, currentIndex++) {
        const angle = (currentIndex / count) * Math.PI * 2;
        const distance = radius + (Math.random() - 0.5) * 10;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        const scale = 0.9 + Math.random() * 0.3;
        positions.push({ 
          position: [x, 0, z], 
          scale, 
          showFlowers: hasFlowers && Math.random() > 0.5,
          showNewLeaves: true,
          treeType: 'healthy',
          health: 0.9 + Math.random() * 0.1
        });
      }
      
      // Add growing trees
      for (let i = 0; i < treeTypes.growing; i++, currentIndex++) {
        const angle = (currentIndex / count) * Math.PI * 2;
        const distance = radius + (Math.random() - 0.5) * 10;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        const scale = 0.6 + Math.random() * 0.3;
        positions.push({ 
          position: [x, 0, z], 
          scale, 
          showFlowers: false,
          showNewLeaves: true,
          treeType: 'growing',
          health: 0.6 + Math.random() * 0.2
        });
      }
      
      // Add wilting trees
      for (let i = 0; i < treeTypes.wilting; i++, currentIndex++) {
        const angle = (currentIndex / count) * Math.PI * 2;
        const distance = radius + (Math.random() - 0.5) * 10;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        const scale = 0.7 + Math.random() * 0.2;
        positions.push({ 
          position: [x, 0, z], 
          scale, 
          showFlowers: false,
          showNewLeaves: false,
          treeType: 'wilting',
          health: 0.3 + Math.random() * 0.2
        });
      }
      
      // Add dead trees
      for (let i = 0; i < treeTypes.dead; i++, currentIndex++) {
        const angle = (currentIndex / count) * Math.PI * 2;
        const distance = radius + (Math.random() - 0.5) * 10;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        const scale = 0.5 + Math.random() * 0.2;
        positions.push({ 
          position: [x, 0, z], 
          scale, 
          showFlowers: false,
          showNewLeaves: false,
          treeType: 'dead',
          health: 0.1
        });
      }
    } else {
      // Original behavior when no wellness data
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const distance = radius + (Math.random() - 0.5) * 10;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        const scale = 0.8 + Math.random() * 0.4;
        const showFlowers = hasFlowers && Math.random() > 0.6;
        const showNewLeaves = hasNewLeaves && Math.random() > 0.5;
        
        positions.push({ position: [x, 0, z], scale, showFlowers, showNewLeaves, health: health });
      }
    }
    
    return positions;
  }, [hasFlowers, hasNewLeaves, treeTypes, health]);
  
  // Generate random rocks around the pond
  const rocks = useMemo(() => {
    if (!hasRocks) return [];
    
    const rockArray = [];
    const rockCount = 15;
    
    for (let i = 0; i < rockCount; i++) {
      // Random positions around the pond area
      const angle = Math.random() * Math.PI * 2;
      const distance = 3 + Math.random() * 4; // 3-7 units from pond center
      const x = Math.cos(angle) * distance;
      const z = -5 + Math.sin(angle) * distance; // Pond is at z = -5
      
      rockArray.push({
        position: [x, 0, z],
        scale: 0.3 + Math.random() * 0.5,
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ]
      });
    }
    return rockArray;
  }, [hasRocks]);
  
  // Generate random benches in the forest
  const benches = useMemo(() => {
    if (!hasBenches) return [];
    
    const benchArray = [];
    const benchCount = 3;
    
    for (let i = 0; i < benchCount; i++) {
      // Random positions in the forest, avoiding the pond area
      const angle = (i / benchCount) * Math.PI * 2 + Math.random() * 0.5;
      const distance = 10 + Math.random() * 8; // 10-18 units from center
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      
      benchArray.push({
        position: [x, 0, z],
        rotation: [0, angle + Math.PI, 0] // Face towards center
      });
    }
    return benchArray;
  }, [hasBenches]);
  
  // Lighting based on time of day and user habits
  const getLighting = () => {
    let baseIntensity = 1;
    let fogDensityBase = 0.02;
    
    // Increase sunlight for meditation/exercise
    if (sunlightBoost) {
      baseIntensity = 1.3;
    }
    
    // Digital fog from high screen time
    if (showDigitalFog) {
      fogDensityBase = 0.12;
    }
    
    // Tired trees from long work
    if (tiredTrees) {
      fogDensityBase += 0.05;
    }
    
    switch (timeOfDay) {
      case 'night':
        return {
          ambient: '#1a2744',
          directional: '#4a5f8f',
          intensity: 0.3 * baseIntensity,
          fogColor: showDigitalFog ? '#2a3a4a' : '#0B132B',
          fogDensity: 0.1 + (showDigitalFog ? 0.05 : 0)
        };
      case 'evening':
        return {
          ambient: '#ff9a56',
          directional: '#ffa856',
          intensity: 0.6 * baseIntensity,
          fogColor: showDigitalFog ? '#9a7a66' : '#ff9a56',
          fogDensity: 0.05 + fogDensityBase
        };
      default: // day
        return {
          ambient: sunlightBoost ? '#fffacd' : '#ffffff',
          directional: sunlightBoost ? '#FFD700' : '#FFE156',
          intensity: baseIntensity,
          fogColor: showDigitalFog ? '#8a9ba8' : 
                   tiredTrees ? '#b0b8b0' :
                   health < 0.4 ? '#c0c8c0' : '#A7E8BD',
          fogDensity: fogDensityBase + (health < 0.4 ? 0.06 : 0)
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
      
      {/* Sky Elements - Day Mode */}
      {timeOfDay === 'day' && (
        <>
          <Sun sunlightBoost={sunlightBoostForSun} />
          <Clouds timeOfDay={timeOfDay} />
          <Birds timeOfDay={timeOfDay} />
        </>
      )}
      
      {/* Sky Elements - Night Mode */}
      {timeOfDay === 'night' && <Moon />}
      
      {/* Weather Effects */}
      <WeatherEffects weather={weather} />
      
      {/* Scene Elements */}
      <Ground soilQuality={soilQuality} season={season} />
      <Grass count={200} health={health} />
      <Butterflies hasButterflies={hasButterflies} />
      
      {/* Pond with water (size based on water level) */}
      <Pond hasStream={hasStream} waterLevel={waterLevel} />
      
      {/* Random rocks around the pond */}
      {rocks.map((rock, i) => (
        <Rock 
          key={i} 
          position={rock.position} 
          scale={rock.scale}
          rotation={rock.rotation}
        />
      ))}
      
      {/* Benches in the forest */}
      {benches.map((bench, i) => (
        <Bench 
          key={i} 
          position={bench.position} 
          rotation={bench.rotation}
        />
      ))}
      
      {/* Trees */}
      {trees.map((tree, i) => (
        <Tree 
          key={i} 
          position={tree.position} 
          health={tree.health !== undefined ? tree.health : (tiredTrees ? Math.max(health - 0.2, 0.2) : health)}
          scale={tree.scale}
          hasFlowers={tree.showFlowers}
          hasNewLeaves={tree.showNewLeaves}
          treeType={tree.treeType}
          season={season}
        />
      ))}
      
      {/* Floating Particles (fireflies/sparkles) - More when healthy/exercise */}
      {health > 0.5 && <Particles count={sunlightBoost > 1 ? 50 : 30} />}
    </>
  );
};

export default ForestScene;
