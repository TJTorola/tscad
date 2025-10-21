import { useRef, useMemo, useEffect } from 'react';
import { BufferAttribute, BufferGeometry, MeshPhongMaterial } from 'three';
import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import type { Geom3 } from '@jscad/modeling/src/geometries/types';

const useBufferGeometry = (geometry: Geom3) => {
  const vertices = useMemo(
    () =>
      new Float32Array(
        geometry.polygons.flatMap((polygon) => polygon.vertices).flat(),
      ),
    [geometry],
  );

  const indices = useMemo(() => {
    const polyCounts = geometry.polygons.map(
      (polygon) => polygon.vertices.length,
    );
    const vertexCount = polyCounts.reduce((acc, count) => acc + count, 0);

    const indicies: Array<Array<number>> = [];
    let offset = 0;
    polyCounts.forEach((count) => {
      for (let i = 0; i < count - 2; i++) {
        indicies.push([offset, offset + i + 1, offset + i + 2]);
      }
      offset += count;
    });

    // If there are more the 2^16 vertices, we must use Uint32Array to reference them
    const UintArray = vertexCount > 65535 ? Uint32Array : Uint16Array;
    return new UintArray(indicies.flat());
  }, [geometry]);

  const buffer = useMemo(() => {
    const buffer = new BufferGeometry();
    buffer.setIndex(new BufferAttribute(indices, 1));
    buffer.setAttribute('position', new BufferAttribute(vertices, 3));
    buffer.computeVertexNormals();
    return buffer;
  }, [vertices, indices]);

  return buffer;
};

const Mesh = ({ geometry }: { geometry: Geom3 }) => {
  const ref = useRef<any>();
  const bufferGeometry = useBufferGeometry(geometry);
  useEffect(() => {
    if (geometry.transforms) {
      ref.current.applyMatrix4({ elements: geometry.transforms });
    }
  }, []);

  return (
    <mesh
      ref={ref}
      geometry={bufferGeometry}
      material={new MeshPhongMaterial({ color: 'orange' })}
    />
  );
};

const ThreeRenderer = ({ geometries }: { geometries: Geom3[] }) => {
  const cameraControlsRef = useRef<any>(null);

  return (
    <Canvas shadows camera={{ position: [6, 6, 10], fov: 60 }}>
      <ambientLight intensity={2} />
      <directionalLight position={[10, 10, 10]} intensity={2} />
      <axesHelper args={[1000]} />
      <CameraControls ref={cameraControlsRef} />
      {geometries.map((geometry: Geom3, idx: number) => (
        <Mesh key={idx} geometry={geometry} />
      ))}
    </Canvas>
  );
};

export default ThreeRenderer;
