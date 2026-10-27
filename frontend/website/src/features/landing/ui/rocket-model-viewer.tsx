import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";

const ROCKET_MODEL_PATH = "/model/fusee.gltf";

function RocketModel({ modelPath }: { modelPath: string }) {
  const { scene, animations } = useGLTF(modelPath);
  useAnimations(animations, scene);

  return (
    <primitive
      object={scene}
      position={[0, 2, 0]}
      rotation={[0, Math.PI / -7, -0.5]}
    />
  );
}

export function RocketModelViewer() {
  return (
    <div className="-z-10 mt-12 hidden md:block">
      <Canvas
        style={{ height: "80vh", width: "30vw" }}
        className="mx-auto mb-auto rounded-lg"
        camera={{ position: [0, 3, 8] }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={7} />
        <directionalLight position={[-10, -10, -5]} intensity={3} />
        <Suspense fallback={null}>
          <RocketModel modelPath={ROCKET_MODEL_PATH} />
        </Suspense>
      </Canvas>
    </div>
  );
}
