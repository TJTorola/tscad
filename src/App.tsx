import { cube } from '@jscad/modeling/src/primitives';
import ThreeRenderer from './ThreeRenderer';
import { translate } from '@jscad/modeling/src/operations/transforms';
import { useMemo } from 'react';

const App = () => {
  const geometries = useMemo(() => {
    var ret = [];
    var size = 10;
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        for (var k = 0; k < size; k++) {
          ret.push(translate([i * 2, j * 2, k * 2], cube({ size: 1 })));
        }
      }
    }
    return ret;
  }, []);
  return <ThreeRenderer geometries={geometries} />;
};

export default App;
