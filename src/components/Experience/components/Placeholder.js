export default function Placeholder({ position, scale }) {
    return <mesh position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
        <meshBasicMaterial wireframe color="red" />
    </mesh>
}