import { TypeProvider } from '../src/di/provider';

describe('TypeScript definitions', () => {
  it(`should allow to have T['prototype']`, () => {
    function some<T extends TypeProvider, K extends keyof T['prototype']>() {}
  });
});
