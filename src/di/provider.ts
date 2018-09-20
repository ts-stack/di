/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

function fake() { /* unused function to prevent the license merging with comments */}

import { Type } from '../type';

/**
 * ### Interface Overview
 *
```ts
interface TypeProvider extends Type {
}
```
 *
 * Configures the `Injector` to return an instance of `Type` when `Type` is used  as token.
 *
 * ### Example
 *
```ts
@Injectable()
class MyService {}

const provider: TypeProvider = MyService;
```
 *
 * ### Description
 *
 * Create an instance by invoking the `new` operator and supplying additional arguments.
 * This form is a short form of `TypeProvider`;
 *
 * For more details, see the [Dependency Injection Guide](https://v4.angular.io/guide/dependency-injection).
 *
 * ### Example
 *
```ts
@Injectable()
class Greeting {
  salutation = 'Hello';
}

const injector = ReflectiveInjector.resolveAndCreate([
  Greeting,  // Shorthand for { provide: Greeting, useClass: Greeting }
]);

expect(injector.get(Greeting).salutation).toBe('Hello');
```
 */
export interface TypeProvider extends Type<any> {}

/**
 * ### Interface Overview
 *
```ts
interface ValueProvider {
  provide: any
  useValue: any
  multi?: boolean
}
```
 * Configures the `Injector` to return a value for a token.
 *
 * ### How To Use
 *
```ts
const provider: ValueProvider = {provide: 'someToken', useValue: 'someValue'};
```
 *
 * For more details, see the [Dependency Injection Guide](https://v4.angular.io/guide/dependency-injection).
 *
 * ### Example
 *
```ts
const injector =
    ReflectiveInjector.resolveAndCreate([{provide: String, useValue: 'Hello'}]);

expect(injector.get(String)).toEqual('Hello');
```
 */
export interface ValueProvider {
  /**
   * An injection token. (Typically an instance of `Type` or `InjectionToken`, but can be `any`).
   */
  provide: any;

  /**
   * The value to inject.
   */
  useValue: any;

  /**
   * If true, then injector returns an array of instances. This is useful to allow multiple
   * providers spread across many files to provide configuration information to a common token.
   *
   * ### Example
   *
```ts
const injector = ReflectiveInjector.resolveAndCreate([
  {provide: 'local', multi: true, useValue: 'en'},
  {provide: 'local', multi: true, useValue: 'sk'},
]);

const locales: string[] = injector.get('local');
expect(locales).toEqual(['en', 'sk']);
```
   */
  multi?: boolean;
}

/**
 * ### Interface Overview
 *
```ts
interface ClassProvider {
  provide: any
  useClass: Type<any>
  multi?: boolean
}
```
 * Configures the `Injector` to return an instance of `useClass` for a token.
 *
 * ### Example
 *
```ts
@Injectable()
class MyService {}

const provider: ClassProvider = {provide: 'someToken', useClass: MyService};
```
 *
 * For more details, see the [Dependency Injection Guide](https://v4.angular.io/guide/dependency-injection).
 *
 * ### Example
 *
```ts
abstract class Shape { name: string; }

class Square extends Shape {
  name = 'square';
}

const injector = ReflectiveInjector.resolveAndCreate([{provide: Shape, useClass: Square}]);

const shape: Shape = injector.get(Shape);
expect(shape.name).toEqual('square');
expect(shape instanceof Square).toBe(true);
```
 *
 * Note that following two providers are not equal:
 *
```ts
class Greeting {
  salutation = 'Hello';
}

class FormalGreeting extends Greeting {
  salutation = 'Greetings';
}

const injector = ReflectiveInjector.resolveAndCreate(
    [FormalGreeting, {provide: Greeting, useClass: FormalGreeting}]);

// The injector returns different instances.
// See: {provide: ?, useExisting: ?} if you want the same instance.
expect(injector.get(FormalGreeting)).not.toBe(injector.get(Greeting));
```
 */
export interface ClassProvider {
  /**
   * An injection token. (Typically an instance of `Type` or `InjectionToken`, but can be `any`).
   */
  provide: any;

  /**
   * Class to instantiate for the `token`.
   */
  useClass: Type<any>;

  /**
   * If true, then injector returns an array of instances. This is useful to allow multiple
   * providers spread across many files to provide configuration information to a common token.
   *
   * ### Example
   *
```ts
const injector = ReflectiveInjector.resolveAndCreate([
  {provide: 'local', multi: true, useValue: 'en'},
  {provide: 'local', multi: true, useValue: 'sk'},
]);

const locales: string[] = injector.get('local');
expect(locales).toEqual(['en', 'sk']);
```
   */
  multi?: boolean;
}

/**
 * ### Interface Overview
 *
```ts
interface ExistingProvider {
  provide: any
  useExisting: any
  multi?: boolean
}
```
 * Configures the `Injector` to return a value of another `useExisting` token.
 *
 * ### Example
 *
```ts
const provider: ExistingProvider = {provide: 'someToken', useExisting: 'someOtherToken'};
```
 *
 * For more details, see the [Dependency Injection Guide](https://v4.angular.io/guide/dependency-injection).
 *
 * ### Example
 *
```ts
class Greeting {
  salutation = 'Hello';
}

class FormalGreeting extends Greeting {
  salutation = 'Greetings';
}

const injector = ReflectiveInjector.resolveAndCreate(
    [FormalGreeting, {provide: Greeting, useExisting: FormalGreeting}]);

expect(injector.get(Greeting).salutation).toEqual('Greetings');
expect(injector.get(FormalGreeting).salutation).toEqual('Greetings');
expect(injector.get(FormalGreeting)).toBe(injector.get(Greeting));
```
 */
export interface ExistingProvider {
  /**
   * An injection token. (Typically an instance of `Type` or `InjectionToken`, but can be `any`).
   */
  provide: any;

  /**
   * Existing `token` to return. (equivalent to `injector.get(useExisting)`)
   */
  useExisting: any;

  /**
   * If true, then injector returns an array of instances. This is useful to allow multiple
   * providers spread across many files to provide configuration information to a common token.
   *
   * ### Example
   *
```ts
const injector = ReflectiveInjector.resolveAndCreate([
  {provide: 'local', multi: true, useValue: 'en'},
  {provide: 'local', multi: true, useValue: 'sk'},
]);

const locales: string[] = injector.get('local');
expect(locales).toEqual(['en', 'sk']);
```
   */
  multi?: boolean;
}

/**
 * ### Interface Overview
 *
```ts
interface FactoryProvider {
  provide: any
  useFactory: Function
  deps?: any[]
  multi?: boolean
}
```
 * Configures the `Injector` to return a value by invoking a `useFactory`
 * function.
 *
 * ### Example
 *
```ts
function serviceFactory() { ... }

const provider: FactoryProvider = {provide: 'someToken', useFactory: serviceFactory, deps: []};
```
 *
 * For more details, see the [Dependency Injection Guide](https://v4.angular.io/guide/dependency-injection).
 *
 * ### Example
 *
```ts
const Location = new InjectionToken('location');
const Hash = new InjectionToken('hash');

const injector = ReflectiveInjector.resolveAndCreate([
  {provide: Location, useValue: 'http://angular.io/#someLocation'}, {
    provide: Hash,
    useFactory: (location: string) => location.split('#')[1],
    deps: [Location]
  }
]);

expect(injector.get(Hash)).toEqual('someLocation');
```
 *
 * Dependencies can also be marked as optional:
 *
```ts
const Location = new InjectionToken('location');
const Hash = new InjectionToken('hash');

const injector = ReflectiveInjector.resolveAndCreate([{
  provide: Hash,
  useFactory: (location: string) => `Hash for: ${location}`,
  // use a nested array to define metadata for dependencies.
  deps: [[new Optional(), Location]]
}]);

expect(injector.get(Hash)).toEqual('Hash for: null');
```
 */
export interface FactoryProvider {
  /**
   * An injection token. (Typically an instance of `Type` or `InjectionToken`, but can be `any`).
   */
  provide: any;

  /**
   * A function to invoke to create a value for this `token`. The function is invoked with
   * resolved values of `token`s in the `deps` field.
   */
  useFactory: Function;

  /**
   * A list of `token`s which need to be resolved by the injector. The list of values is then
   * used as arguments to the `useFactory` function.
   */
  deps?: any[];

  /**
   * If true, then injector returns an array of instances. This is useful to allow multiple
   * providers spread across many files to provide configuration information to a common token.
   *
   * ### Example
   *
```ts
const injector = ReflectiveInjector.resolveAndCreate([
  {provide: 'local', multi: true, useValue: 'en'},
  {provide: 'local', multi: true, useValue: 'sk'},
]);

const locales: string[] = injector.get('local');
expect(locales).toEqual(['en', 'sk']);
```
   */
  multi?: boolean;
}

/**
 * Describes how the `Injector` should be configured.
 *
 * ### How To Use
 * See `TypeProvider`, `ValueProvider`, `ClassProvider`, `ExistingProvider`, `FactoryProvider`.
 *
 * For more details, see the [Dependency Injection Guide](https://v4.angular.io/guide/dependency-injection).
 */
export type Provider =
    TypeProvider | ValueProvider | ClassProvider | ExistingProvider | FactoryProvider | any[];
