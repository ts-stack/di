/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * ### Interface Overview
 *
```ts
interface Type<T> extends Function {
  new (...args: any[]): T
}
```
 * Represents a type that a Component or other object is instances of.
 *
 * An example of a `Type` is `MyCustomComponent` class, which in JavaScript is be represented by
 * the `MyCustomComponent` constructor function.
 */
export const Type = Function;

export function isType(v: any): v is Type<any> {
  return typeof v == 'function';
}

export interface Type<T> extends Function {
  // tslint:disable-next-line: callable-types
  new (...args: any[]): T;
}
