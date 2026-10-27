import { Suspense } from "react"
import { ClientOnly } from "@tanstack/react-router"
import { Canvas } from "@react-three/fiber"
import { RobotModel } from "./robot-model"

interface RobotModelViewerProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  step?: number
}

const getTransform = (step: number) => {
  const xTranslate = step % 2 === 0 ? "75%" : "-400%"
  const yTranslate = `${step * 20}%`
  return `translate(${xTranslate}, ${yTranslate})`
}

export function RobotModelViewer({ position, rotation, step = 0 }: RobotModelViewerProps) {
  return (
    <div
      className="fixed -z-10 hidden transition-all duration-700 ease-in-out lg:block"
      style={{
        top: "5rem",
        right: "15%",
        transform: getTransform(step),
        width: "clamp(150px, 15vw, 300px)",
        height: "clamp(300px, 80vh, 600px)",
      }}
    >
      <ClientOnly>
        <Canvas style={{ width: "100%", height: "100%" }} camera={{ position: [0, 3, 8] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={7} />
          <directionalLight position={[-10, -10, -5]} intensity={3} />
          <Suspense fallback={null}>
            <RobotModel
              modelPath="/model/Sae501_robot_complet_final.gltf"
              position={position}
              rotation={rotation}
              step={step}
            />
          </Suspense>
        </Canvas>
      </ClientOnly>
    </div>
  )
}
