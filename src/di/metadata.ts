/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

function fake(){ /* unused function to prevent the license merging with comments */}

import {makeDecorator, makeParamDecorator} from '../util/decorators';


/**
 * Type of the Inject decorator / constructor function.
 * 
 * ### Interface Overview
 * 
```ts
interface InjectDecorator { 
  (token: any): any
  new (token: any): Inject
}
```
  *
  * For more details, see the [Dependency Injection Guide](https://v4.angular.io/guide/dependency-injection).
  *
  * ### Example
  *
```ts
class Engine {}

@Injectable()
class Car {
  constructor(@Inject('MyEngine') public engine: Engine) {}
}

const injector =
    ReflectiveInjector.resolveAndCreate([{provide: 'MyEngine', useClass: Engine}, Car]);

expect(injector.get(Car).engine instanceof Engine).toBe(true);
```
  *
  * When `@Inject()` is not present, `Injector` will use the type annotation of the
  * parameter.
  *
  * ### Example
  *
```ts
class Engine {}

@Injectable()
class Car {
  constructor(public engine: Engine) {
  }  // same as constructor(@Inject(Engine) engine:Engine)
}

const injector = ReflectiveInjector.resolveAndCreate([Engine, Car]);
expect(injector.get(Car).engine instanceof Engine).toBe(true);
```
   */
export interface InjectDecorator {
  (token: any): any;
  new (token: any): Inject;
}

/**
 * Type of the Inject metadata.
 */
export interface Inject { token: any; }

/**
 * Inject decorator and metadata.
 */
export const Inject: InjectDecorator = makeParamDecorator('Inject', (token: any) => ({token}));


/**
 * ### Interface Overview
 * 
```ts
interface OptionalDecorator { 
  (): any
  new (): Optional
}
```
 * ### Description
 * 
 * Type of the Optional decorator / constructor function.
 * A parameter metadata that marks a dependency as optional.
 * `Injector` provides `null` if the dependency is not found.
 *
 * For more details, see the [Dependency Injection Guide](https://v4.angular.io/guide/dependency-injection).
 *
 * ### Example
 *
```ts
class Engine {}

@Injectable()
class Car {
  constructor(@Optional() public engine: Engine) {}
}

const injector = ReflectiveInjector.resolveAndCreate([Car]);
expect(injector.get(Car).engine).toBeNull();
```
 */
export interface OptionalDecorator {
  (): any;
  new (): Optional;
}

/**
 * Type of the Optional metadata.
 */
export interface Optional {}

/**
 * Optional decorator and metadata.
 */
export const Optional: OptionalDecorator = makeParamDecorator('Optional');

/**
 * ### Interface Overview
 * 
```ts
interface InjectableDecorator { 
  (): any
  new (): Injectable
}
```
 *
 * ### Description
 * 
 * Type of the Injectable decorator / constructor function.
 * A marker metadata that marks a class as available to `Injector` for creation.
 * 
 * ### Example
 * 
```ts
@Injectable()
class Car {}
```
 *
 * For more details, see the [Dependency Injection Guide](https://v4.angular.io/guide/dependency-injection).
 *
 * ### Example
 *
```ts
@Injectable()
class UsefulService {
}

@Injectable()
class NeedsService {
  constructor(public service: UsefulService) {}
}

const injector = ReflectiveInjector.resolveAndCreate([NeedsService, UsefulService]);
expect(injector.get(NeedsService).service instanceof UsefulService).toBe(true);
```
 *
 * `Injector` will throw an error when trying to instantiate a class that
 * does not have `@Injectable` marker, as shown in the example below.
 *
```ts
class UsefulService {}

class NeedsService {
  constructor(public service: UsefulService) {}
}

expect(() => ReflectiveInjector.resolveAndCreate([NeedsService, UsefulService])).toThrow();
```
 */
export interface InjectableDecorator {
  (): any;
  new (): Injectable;
}

/**
 * Type of the Injectable metadata.
 */
export interface Injectable {}

/**
 * Injectable decorator and metadata.
 */
export const Injectable: InjectableDecorator = <InjectableDecorator>makeDecorator('Injectable');

/**
 * ### Interface Overview
 ```ts
 interface SelfDecorator { 
  (): any
  new (): Self
}
 ```
 * ### Description
 * 
 * Type of the Self decorator / constructor function.
 * Specifies that an `Injector` should retrieve a dependency only from itself.
 * 
 * ### Example
 * 
```ts
@Injectable()
class Car {
  constructor(@Self() public engine:Engine) {}
}
```
 *
 * For more details, see the [Dependency Injection Guide](https://v4.angular.io/guide/dependency-injection).
 *
 * ### Example
 *
```ts
class Dependency {}
 
@Injectable()
class NeedsDependency {
  constructor(@Self() public dependency: Dependency) {}
}
 
let inj = ReflectiveInjector.resolveAndCreate([Dependency, NeedsDependency]);
const nd = inj.get(NeedsDependency);
 
expect(nd.dependency instanceof Dependency).toBe(true);
 
inj = ReflectiveInjector.resolveAndCreate([Dependency]);
const child = inj.resolveAndCreateChild([NeedsDependency]);
expect(() => child.get(NeedsDependency)).toThrowError();
```
 */
export interface SelfDecorator {
  (): any;
  new (): Self;
}

/**
 * Type of the Self metadata.
 */
export interface Self {}

/**
 * Self decorator and metadata.
 */
export const Self: SelfDecorator = makeParamDecorator('Self');


/**
 * ### Interface Overview
 * 
```ts
interface SkipSelfDecorator { 
  (): any
  new (): SkipSelf
}
```
 *
 * ### Description
 * 
 * Type of the SkipSelf decorator / constructor function.
 * Specifies that the dependency resolution should start from the parent injector.
 * 
 * ### Example
 * 
```ts
@Injectable()
class Car {
  constructor(@SkipSelf() public engine:Engine) {}
}
  ```
 *
 * For more details, see the [Dependency Injection Guide](https://v4.angular.io/guide/dependency-injection).
 *
 * ### Example
 *
```ts
class Dependency {}
 
@Injectable()
class NeedsDependency {
  constructor(@SkipSelf() public dependency: Dependency) { this.dependency = dependency; }
}
 
const parent = ReflectiveInjector.resolveAndCreate([Dependency]);
const child = parent.resolveAndCreateChild([NeedsDependency]);
expect(child.get(NeedsDependency).dependency instanceof Dependency).toBe(true);
 
const inj = ReflectiveInjector.resolveAndCreate([Dependency, NeedsDependency]);
expect(() => inj.get(NeedsDependency)).toThrowError();
```
 */
export interface SkipSelfDecorator {
  (): any;
  new (): SkipSelf;
}

/**
 * Type of the SkipSelf metadata.
 */
export interface SkipSelf {}

/**
 * SkipSelf decorator and metadata.
 */
export const SkipSelf: SkipSelfDecorator = makeParamDecorator('SkipSelf');
