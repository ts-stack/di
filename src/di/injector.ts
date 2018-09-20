/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

function fake() { /* unused function to prevent the license merging with comments */ }

import { Type } from '../type';
import { stringify } from '../util';

import { InjectionToken } from './injection_token';

const _THROW_IF_NOT_FOUND = new Object();
export const THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;

class _NullInjector implements Injector {
  get(token: any, notFoundValue: any = _THROW_IF_NOT_FOUND): any {
    if (notFoundValue === _THROW_IF_NOT_FOUND) {
      throw new Error(`No provider for ${stringify(token)}!`);
    }
    return notFoundValue;
  }
}

/**
 * ### Overview
```ts
class Injector {
  static THROW_IF_NOT_FOUND: _THROW_IF_NOT_FOUND
  static NULL: Injector
  get<T>(token: Type<T>|InjectionToken<T>, notFoundValue?: T): T
}
```
 *
 * ### How To Use
 *
```ts
const injector: Injector = ...;
injector.get(...);
```
 *
 * ### Description
 * For more details, see the [Dependency Injection Guide](https://v4.angular.io/guide/dependency-injection).
 *
 * ### Example
 *
```ts
const injector: Injector =
    ReflectiveInjector.resolveAndCreate([{provide: 'validToken', useValue: 'Value'}]);
expect(injector.get('validToken')).toEqual('Value');
expect(() => injector.get('invalidToken')).toThrowError();
expect(injector.get('invalidToken', 'notFound')).toEqual('notFound');
```
 *
 * `Injector` returns itself when given `Injector` as a token:
 *
```ts
const injector = ReflectiveInjector.resolveAndCreate([]);
expect(injector.get(Injector)).toBe(injector);
```
 */
export abstract class Injector {
  static THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
  static NULL: Injector = new _NullInjector();

  /**
   * Retrieves an instance from the injector based on the provided token.
   * If not found:
   * - Throws an error if no `notFoundValue` that is not equal to
   * Injector.THROW_IF_NOT_FOUND is given
   * - Returns the `notFoundValue` otherwise
   */
  abstract get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T;
  abstract get(token: any, notFoundValue?: any): any;
}
