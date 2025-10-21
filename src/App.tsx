import { cube } from '@jscad/modeling/src/primitives';
import Renderer from './Renderer';
import { translate } from '@jscad/modeling/src/operations/transforms';
import { useMemo } from 'react';
import type { Geom3 } from '@jscad/modeling/src/geometries/types';

export const cubeOfCubes = (size: number) => {
  const cubes: Array<Geom3> = [];
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      for (var k = 0; k < size; k++) {
        cubes.push(translate([i * 20, j * 20, k * 20], cube({ size: 10 })));
      }
    }
  }
  return cubes;
};

const App = () => {
  const geometries = useMemo(() => cubeOfCubes(10), []);
  return <Renderer geometries={geometries} />;
};

export default App;
