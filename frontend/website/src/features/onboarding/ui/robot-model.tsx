import { useEffect, useRef } from "react"
import { useAnimations, useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import type { Group } from "three"

interface RobotModelProps {
  modelPath: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  step?: number
}

const DEFAULT_POSITION: [number, number, number] = [0, -1, 0]
const DEFAULT_ROTATION: [number, number, number] = [0, Math.PI / -6, 0]

export function RobotModel({
  modelPath,
  position = DEFAULT_POSITION,
  rotation = DEFAULT_ROTATION,
  step = 0,
}: RobotModelProps) {
  const { scene, animations } = useGLTF(modelPath)
  const { actions } = useAnimations(animations, scene)
  const modelRef = useRef<Group>(null)
  const prevStep = useRef(step)

  useEffect(() => {
    actions["ArmatureAction.002"]?.play()
  }, [actions])

  useEffect(() => {
    if (prevStep.current !== step && modelRef.current) {
      prevStep.current = step
      modelRef.current.scale.setScalar(0.9)
    }
  }, [step])

  useFrame((state) => {
    const model = modelRef.current
    if (!model) return
    model.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1
    const targetRotation = rotation[1] + (step * Math.PI) / 12
    model.rotation.y += (targetRotation - model.rotation.y) * 0.05
    if (model.scale.x < 1) {
      model.scale.setScalar(Math.min(1, model.scale.x + 0.01))
    }
  })

  return <primitive ref={modelRef} object={scene} position={position} rotation={rotation} />
}
