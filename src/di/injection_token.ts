/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

function fake() { /* unused function to prevent the license merging with comments */ }

/**
 * Creates a token that can be used in a DI Provider.
 *
 * Use an `InjectionToken` whenever the type you are injecting is not reified (does not have a
 * runtime representation) such as when injecting an interface, callable type, array or
 * parametrized type.
 *
 * `InjectionToken` is parameterized on `T` which is the type of object which will be returned by
 * the `Injector`. This provides additional level of type safety.
 *
```
interface MyInterface {...}
let myInterface = injector.get(new InjectionToken<MyInterface>('SomeToken'));
// myInterface is inferred to be MyInterface.
```
 *
 * ### Example
 *
```ts
const BASE_URL = new InjectionToken<string>('BaseUrl');
const injector =
    ReflectiveInjector.resolveAndCreate([{provide: BASE_URL, useValue: 'http://localhost'}]);
const url = injector.get(BASE_URL);
// here `url` is inferred to be `string` because `BASE_URL` is `InjectionToken<string>`.
expect(url).toBe('http://localhost');
```
 */
export class InjectionToken<T> {
  constructor(protected desc: string) { }

  toString(): string { return `InjectionToken ${this.desc}`; }
}
