""use client";

import React, { useRef, useMemo, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture, Environment } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

const particlesCount = 12000; 

const RealisticLemonadeGlass = ({ onClick }: { onClick?: () => void }) => {
  const groupRef = useRef<THREE.Group>(null);

  // 1. GENERATE THE GLASS CONTAINER PROFILE
  const glassGeometry = useMemo(() => {
    const glassPoints = [];
    glassPoints.push(new THREE.Vector2(0, 0));        // Center bottom
    glassPoints.push(new THREE.Vector2(0.85, 0));     // Bottom outer corner
    glassPoints.push(new THREE.Vector2(1.25, 3.4));   // Flared rim outer lip
    glassPoints.push(new THREE.Vector2(1.17, 3.4));   // Inner rim lip (creates wall thickness)
    glassPoints.push(new THREE.Vector2(0.78, 0.2));   // Inner bottom floor (thick heavy base)
    glassPoints.push(new THREE.Vector2(0, 0.2));      // Center inner floor
    const geom = new THREE.LatheGeometry(glassPoints, 64);
    geom.center();
    return geom;
  }, []);

  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.0,
      metalness: 0.1,
      transmission: 1.0,           // Complete physical glass transmission
      ior: 1.5,                    // Index of refraction for glass
      thickness: 0.08,             // Physical distortion wall depth
      depthWrite: false,           // Ensures crystal clear transparency
      side: THREE.DoubleSide
    });
  }, []);

  // 2. GENERATE THE LEMONADE LIQUID PROFILE (Strictly offset to prevent clipping)
  const { liquidGeometry, initialPositions } = useMemo(() => {
    const liquidPoints = [];
    liquidPoints.push(new THREE.Vector2(0, 0.21));      // Sits slightly above inner glass floor
    liquidPoints.push(new THREE.Vector2(0.75, 0.21));   // Corner edge
    liquidPoints.push(new THREE.Vector2(1.02, 2.7));    // Liquid surface line (safe height below rim)
    liquidPoints.push(new THREE.Vector2(0, 2.7));       // Center top surface
    const geom = new THREE.LatheGeometry(liquidPoints, 64);
    geom.center();
    const initialPos = new Float32Array(geom.attributes.position.array);
    return { liquidGeometry: geom, initialPositions: initialPos };
  }, []);

  const liquidMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: 0xffea00,             // 0xffea00 Bright Lemon Yellow
      emissive: 0xffea00,          // Bright Yellow Radiance
      emissiveIntensity: 0.7,      // Glowing vibrant lemonade energy
      roughness: 0.02,
      transmission: 0.65,          // Rich juicy translucent body
      ior: 1.333,                  // Index of refraction for water/juice
      thickness: 0.2,              // Volumetric scattering simulation
      attenuationColor: 0xffea00,  // 0xffea00 depth absorption
      attenuationDistance: 1.5     // Keeps liquid ultra-bright without center darkening
    });
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
      // Gentle glass tilt physics sway
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2.0) * 0.03;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 1.5) * 0.02;
    }

    // HIGH-PERFORMANCE VERTEX LIQUID SURFACE WAVE PHYSICS (No computeVertexNormals bottleneck)
    if (liquidGeometry) {
      const pos = liquidGeometry.attributes.position;
      const time = state.clock.elapsedTime * 3.5;

      for (let i = 0; i < pos.count; i++) {
        const x = initialPositions[i * 3];
        const y = initialPositions[i * 3 + 1];
        const z = initialPositions[i * 3 + 2];

        if (y > 0.7) {
          const r = Math.sqrt(x * x + z * z);
          const wave = Math.sin(x * 2.5 + time) * 0.06 * Math.max(0, 1.0 - r / 1.05) +
                       Math.cos(z * 2.5 + time * 1.2) * 0.06 * Math.max(0, 1.0 - r / 1.05);
          pos.setY(i, y + wave);
        }
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group 
      ref={groupRef} 
      onClick={onClick}
      onPointerOver={() => document.body.style.cursor = 'pointer'} 
      onPointerOut={() => document.body.style.cursor = 'auto'}
      scale={[0.85, 0.85, 0.85]}
    >
      {/* Outer Glass Tumbler */}
      <mesh geometry={glassGeometry} material={glassMaterial} castShadow receiveShadow />
      {/* Inner Lemonade Liquid with Vertex Wave Fluid Physics */}
      <mesh geometry={liquidGeometry} material={liquidMaterial} receiveShadow />
      {/* 3D Drinking Straw */}
      <mesh position={[0.25, 0.6, 0.1]} rotation={[0.1, 0, -0.28]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 4.2, 16]} />
        <meshStandardMaterial color="#36AE7C" roughness={0.2} metalness={0.1} />
      </mesh>
    </group>
  );
};

const particlesCount = 60000; 
const [ringPositions, ringColors, ringRandoms] = (() => {
  const pos = new Float32Array(particlesCount * 3);
  const col = new Float32Array(particlesCount * 3);
  const rnd = new Float32Array(particlesCount);

  for(let i=0; i<particlesCount; i++) {
    const angle = Math.random() * Math.PI * 2;

    const rDist = Math.pow(Math.random(), 1.5);
    const radius = 2.2 + rDist * 2.2; 

    const thickness = 0.4 - (rDist * 0.2); 
    const ySpread = (Math.random() + Math.random() + Math.random() - 1.5);
    const y = ySpread * thickness; 

    pos[i*3] = Math.cos(angle) * radius;
    pos[i*3+1] = y;
    pos[i*3+2] = Math.sin(angle) * radius;

    const intensity = 1.0 - rDist; 

    const paletteType = Math.random();
    let baseR, baseG, baseB;

    if (paletteType < 0.75) {
      // Vivid Sun Yellow
      baseR = 1.0; baseG = 0.95; baseB = 0.1;
    } else if (paletteType < 0.90) {
      // Bright Refreshing Lime
      baseR = 0.3; baseG = 0.95; baseB = 0.4;
    } else {
      // Electric Citrus Gold
      baseR = 1.0; baseG = 0.7; baseB = 0.1;
    }

    baseR = Math.min(1.0, Math.max(0.0, baseR + (Math.random() - 0.5) * 0.1));
    baseG = Math.min(1.0, Math.max(0.0, baseG + (Math.random() - 0.5) * 0.1));
    baseB = Math.min(1.0, Math.max(0.0, baseB + (Math.random() - 0.5) * 0.1));

    const sparkle = Math.random() > 0.95 ? 2.5 : 1.0;

    col[i*3] = baseR * intensity * sparkle;     
    col[i*3+1] = baseG * intensity * sparkle;   
    col[i*3+2] = baseB * intensity * sparkle;   
    rnd[i] = Math.random();
  }
  return [pos, col, rnd];
})();

const ParticleRing = ({ 
  ringState, 
  massiveAsteroidsRef, 
  isDark = true 
}: { 
  ringState: 'hidden' | 'animating' | 'visible', 
  massiveAsteroidsRef: React.MutableRefObject<Float32Array>,
  isDark?: boolean
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const uniforms = useRef({
    uProgress: { value: ringState === 'visible' ? 1.0 : 0.0 },
    uAsteroids: { value: new Float32Array(75 * 4) },
    time: { value: 0 }
  });

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.02;
      pointsRef.current.updateMatrix();

      const invMat = new THREE.Matrix4().copy(pointsRef.current.matrix).invert();
      const localAsteroids = new Float32Array(75 * 4);
      for(let i=0; i<75; i++) {
        const ast = new THREE.Vector3(
          massiveAsteroidsRef.current[i*4],
          massiveAsteroidsRef.current[i*4+1],
          massiveAsteroidsRef.current[i*4+2]
        );
        ast.applyMatrix4(invMat);
        localAsteroids[i*4] = ast.x;
        localAsteroids[i*4+1] = ast.y;
        localAsteroids[i*4+2] = ast.z;
        localAsteroids[i*4+3] = massiveAsteroidsRef.current[i*4+3];
      }
      uniforms.current.uAsteroids.value = localAsteroids;
    }
    uniforms.current.time.value = state.clock.elapsedTime;

    if (ringState === 'animating') {
      uniforms.current.uProgress.value += delta * 0.35; 
      if (uniforms.current.uProgress.value > 1.0) uniforms.current.uProgress.value = 1.0;
    } else if (ringState === 'visible') {
      uniforms.current.uProgress.value = 1.0;
    } else {
      uniforms.current.uProgress.value = 0.0;
    }
  });

  const onBeforeCompile = (shader: any) => {
    shader.uniforms.uProgress = uniforms.current.uProgress;
    shader.uniforms.uAsteroids = uniforms.current.uAsteroids;
    shader.uniforms.time = uniforms.current.time;

    shader.vertexShader = `
      uniform float uProgress;
      uniform vec4 uAsteroids[75];
      uniform float time;
      attribute float aRandom;
      varying float vProgress; 
      ${shader.vertexShader}
    `;

    shader.vertexShader = shader.vertexShader.replace(
      `#include <begin_vertex>`,
      `
      vec3 transformed = vec3(position);

      float angle = atan(transformed.x, transformed.z);
      float normalizedAngle = abs(angle) / 3.14159265359;
      float spawnThreshold = 1.0 - normalizedAngle; 

      float progressValue = (uProgress * 1.4) - spawnThreshold;
      float particleProgress = smoothstep(0.0, 0.4, progressValue);
      vProgress = particleProgress;

      transformed.y += sin(angle * 10.0 + time) * 0.05 * aRandom;

      if (uProgress > 0.5) {
        for(int i = 0; i < 75; i++) {
          vec4 astData = uAsteroids[i];
          vec3 delta = transformed - astData.xyz;
          float dist = length(delta);

          float rad = astData.w * 2.0 + 0.15;

          if (dist < rad) {
             float force = pow((rad - dist) / rad, 2.0); 
             transformed += normalize(delta) * force * 0.4;
             transformed.y += force * 0.20 * (aRandom - 0.5);
          }
        }
      }

      float swirl = (1.0 - particleProgress) * 4.0; 
      float s = sin(swirl);
      float c = cos(swirl);
      transformed.xz = mat2(c, -s, s, c) * transformed.xz;

      transformed.y += (1.0 - particleProgress) * (transformed.y >= 0.0 ? 1.0 : -1.0);

      vec3 glassSurface = normalize(transformed) * 2.1;
      transformed = mix(glassSurface, transformed, particleProgress);
      `
    );

    shader.fragmentShader = `
      varying float vProgress;
      ${shader.fragmentShader}
    `;

    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <color_fragment>`,
      `
      #include <color_fragment>

      diffuseColor.a *= vProgress;
      `
    );
  };

  return (
    <points ref={pointsRef} rotation={[Math.PI / 8, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particlesCount}
          array={ringPositions}
          itemSize={3}
          args={[ringPositions, 3]}
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={particlesCount}
          array={ringColors}
          itemSize={3}
          args={[ringColors, 3]}
        />
        <bufferAttribute 
          attach="attributes-aRandom" 
          count={particlesCount}
          array={ringRandoms}
          itemSize={1}
          args={[ringRandoms, 1]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.01} 
        vertexColors 
        transparent 
        opacity={0.9} 
        sizeAttenuation={true} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
        onBeforeCompile={onBeforeCompile} 
      />
    </points>
  );
};

const generateAsteroids = (count: number) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const baseRadius = 2.8 + Math.random() * 2.0; 
    const radialAmplitude = 0.5 + Math.random() * 1.5; 
    const radialSpeed = 0.15 + Math.random() * 0.25; 
    const phase = Math.random() * Math.PI * 2;

    const angle = Math.random() * Math.PI * 2;
    const zOffset = (Math.random() - 0.5) * 0.8; 

    const speed = (0.04 + Math.random() * 0.08) * (Math.random() > 0.5 ? 1 : -1);

    const rotationSpeedX = (Math.random() - 0.5) * 0.05;
    const rotationSpeedY = (Math.random() - 0.5) * 0.05;
    const rotationSpeedZ = (Math.random() - 0.5) * 0.05;

    const scale = 0.04 + Math.pow(Math.random(), 3) * 0.15;
    const isSugar = i % 5 === 0; // ~20% sugar cubes, ~80% lemons

    data.push({
      angle, baseRadius, radialAmplitude, radialSpeed, phase, zOffset, speed,
      rx: Math.random() * Math.PI, ry: Math.random() * Math.PI, rz: Math.random() * Math.PI,
      rsx: rotationSpeedX, rsy: rotationSpeedY, rsz: rotationSpeedZ,
      scale, isSugar
    });
  }
  data.sort((a, b) => b.scale - a.scale);
  return data;
};

const AsteroidBelt = ({ ringState, massiveAsteroidsRef }: { ringState: 'hidden' | 'animating' | 'visible', massiveAsteroidsRef: React.MutableRefObject<Float32Array> }) => {
  const lemonMeshRef = useRef<THREE.InstancedMesh>(null);
  const sugarMeshRef = useRef<THREE.InstancedMesh>(null);

  const count = 75; 
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const [asteroids] = useState(() => generateAsteroids(count));

  const lemons = useMemo(() => asteroids.filter(a => !a.isSugar), [asteroids]);
  const sugars = useMemo(() => asteroids.filter(a => a.isSugar), [asteroids]);

  const scaleRef = useRef(0);

  useFrame((state, delta) => {
    if (!lemonMeshRef.current || !sugarMeshRef.current) return;

    const targetScale = ringState === 'hidden' ? 0 : 1;
    const lerpSpeed = ringState === 'hidden' ? 5 : 2;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, delta * lerpSpeed);

    if (scaleRef.current < 0.01) {
      lemonMeshRef.current.visible = false;
      sugarMeshRef.current.visible = false;
      return;
    }
    lemonMeshRef.current.visible = true;
    sugarMeshRef.current.visible = true;

    let lemonIdx = 0;
    let sugarIdx = 0;

    asteroids.forEach((ast, i) => {
      ast.angle += ast.speed * delta; 
      ast.phase += ast.radialSpeed * delta;

      let currentRadius = ast.baseRadius + Math.sin(ast.phase) * ast.radialAmplitude;
      if (currentRadius < 2.15) {
        const penetration = 2.15 - currentRadius;
        currentRadius = 2.15 + penetration * 0.85;
      }

      const x = Math.cos(ast.angle) * currentRadius;
      const y = Math.sin(ast.angle) * currentRadius;

      massiveAsteroidsRef.current[i * 4] = x;
      massiveAsteroidsRef.current[i * 4 + 1] = y;
      massiveAsteroidsRef.current[i * 4 + 2] = ast.zOffset;
      massiveAsteroidsRef.current[i * 4 + 3] = ast.scale;

      ast.rx += ast.rsx;
      ast.ry += ast.rsy;
      ast.rz += ast.rsz;

      dummy.position.set(x, y, ast.zOffset);
      dummy.rotation.set(ast.rx, ast.ry, ast.rz);

      if (ast.isSugar) {
        // Sugar Cube scaling
        dummy.scale.setScalar(ast.scale * 1.1 * scaleRef.current);
        dummy.updateMatrix();
        sugarMeshRef.current!.setMatrixAt(sugarIdx++, dummy.matrix);
      } else {
        // Ellipsoid Lemon scaling
        dummy.scale.set(
          ast.scale * 1.45 * scaleRef.current,
          ast.scale * 0.95 * scaleRef.current,
          ast.scale * 0.95 * scaleRef.current
        );
        dummy.updateMatrix();
        lemonMeshRef.current!.setMatrixAt(lemonIdx++, dummy.matrix);
      }
    });

    lemonMeshRef.current.instanceMatrix.needsUpdate = true;
    sugarMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Floating 3D Lemons */}
      <instancedMesh ref={lemonMeshRef} args={[undefined, undefined, lemons.length]} castShadow receiveShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial 
          color="#facc15"
          roughness={0.35}
          metalness={0.05}
        />
      </instancedMesh>

      {/* Floating 3D Sugar Cubes */}
      <instancedMesh ref={sugarMeshRef} args={[undefined, undefined, sugars.length]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          roughness={0.1}
          metalness={0.05}
          transmission={0.7}
          transparent
          opacity={0.95}
          ior={1.54}
        />
      </instancedMesh>
    </group>
  );
};

export interface LunarGravityCardProps {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export default function LunarGravityCard({ 
  className,
  title,
  description = "Experience the perfect blend of sweet and tart with our handcrafted lemonade varieties. Flawlessly smooth and refreshingly vibrant."
}: LunarGravityCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [ringState, setRingState] = useState<'hidden' | 'animating' | 'visible'>('visible');
  const massiveAsteroidsRef = useRef<Float32Array>(new Float32Array(75 * 4));

  const defaultTitle = (
    <>
      <span className={cn("drop-shadow-sm transition-colors duration-300", isDark ? "text-zinc-50" : "text-slate-900")}>
        Lemonade
      </span>
      <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-500 drop-shadow-md">
        For Every Taste.
      </span>
    </>
  );

  return (
    <div className={cn(
      "w-full max-w-[1000px] min-h-[700px] md:min-h-[auto] md:h-[540px] rounded-[2.5rem] flex flex-col md:flex-row relative overflow-hidden transition-all duration-300 border shadow-2xl",
      isDark ? "border-white/[0.08] text-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.6)]" : "border-amber-300/80 text-slate-900 shadow-[0_30px_100px_rgba(249,217,35,0.3)]",
      className
    )}>
      
      {/* Dark Card Background Layer */}
      <div className={cn("absolute inset-0 bg-black transition-opacity duration-500 z-0", isDark ? "opacity-100" : "opacity-0")} />
      {/* Light Card Background Layer */}
      <div className={cn("absolute inset-0 bg-gradient-to-br from-amber-50 via-amber-100/80 to-yellow-100/60 transition-opacity duration-500 z-0", isDark ? "opacity-0" : "opacity-100")} />

      {/* Dark Background Overlay */}
      <div className={cn(
        "absolute top-0 left-0 md:inset-y-0 md:left-0 w-full h-[60%] md:h-full md:w-[60%] z-10 pointer-events-none transition-opacity duration-500 bg-gradient-to-b md:bg-gradient-to-r from-black via-black/90 to-transparent",
        isDark ? "opacity-100" : "opacity-0"
      )} />
      {/* Light Background Overlay */}
      <div className={cn(
        "absolute top-0 left-0 md:inset-y-0 md:left-0 w-full h-[60%] md:h-full md:w-[60%] z-10 pointer-events-none transition-opacity duration-500 bg-gradient-to-b md:bg-gradient-to-r from-amber-50 via-amber-50/90 to-transparent",
        isDark ? "opacity-0" : "opacity-100"
      )} />

      {/* Left Column Content */}
      <div className="w-full md:w-[45%] flex flex-col justify-center px-10 py-12 md:p-0 md:pl-16 relative z-20 pointer-events-none">
        <h2 className="text-[3.5rem] md:text-[4.5rem] font-bold tracking-tighter leading-[0.9] mb-6">
          {title || defaultTitle}
        </h2>
        <p className={cn(
          "text-base md:text-lg font-medium leading-relaxed max-w-[340px] transition-colors duration-300",
          isDark ? "text-zinc-300" : "text-slate-700"
        )}>
          {description}
        </p>
      </div>
     
      {/* 3D Canvas View */}
      <div className="relative md:absolute md:right-0 md:top-0 w-full h-[450px] md:h-full md:w-[65%] pointer-events-auto z-0 flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full">
          <Canvas 
            shadows 
            camera={{ position: [0, 0, 7.5], fov: 45 }} 
            dpr={[1, 2]}
            gl={{ preserveDrawingBuffer: true, alpha: true }}
          >
            <Environment preset="city" />

            <ambientLight intensity={isDark ? 1.8 : 2.2} />
            <directionalLight position={[8, 5, 5]} intensity={3.0} color="#ffffff" castShadow shadow-mapSize={[2048, 2048]} />
            <directionalLight position={[-5, 3, -5]} intensity={2.5} color="#ffea00" />
            <pointLight position={[0, 0.5, 1]} intensity={3.5} color="#ffff00" />

            <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />

            <group rotation={[0, 0, 0]}>
              <Suspense fallback={null}>
                <RealisticLemonadeGlass onClick={() => { if(ringState === 'hidden') setRingState('animating') }} />
                <ParticleRing ringState={ringState} massiveAsteroidsRef={massiveAsteroidsRef} isDark={isDark} />
                <AsteroidBelt ringState={ringState} massiveAsteroidsRef={massiveAsteroidsRef} />
                <Environment preset="city" />
              </Suspense>
            </group>
          </Canvas>
        </div>
      </div>

    </div>
  );
}

export { LunarGravityCard as Component };
