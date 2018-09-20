[![Build Status](https://travis-ci.org/KostyaTretyak/ts-di.svg?branch=master)](https://travis-ci.org/KostyaTretyak/ts-di)

Dependency injection library for JavaScript and TypeScript. It is an extraction of the Angular's dependency injection which means that it's feature complete, fast, reliable and well tested. Also - retrieve all API documentation with example code.

Up-to-date with Angular 4.4.7

## Install

```bash
npm i ts-di
# OR
yarn add ts-di
```

Also you need to install `reflect-metadata` module:

```bash
npm i reflect-metadata
# OR
npm i reflect-metadata
```

## Example usage

```ts
import 'reflect-metadata';
import { ReflectiveInjector, Injectable } from 'ts-di';

class Engine { }

@Injectable()
class Car {
  constructor(public engine: Engine) { }
}

const injector = ReflectiveInjector.resolveAndCreate([Engine]);
const engine: Engine = injector.get(Engine);

console.log(engine instanceof Engine);
```

For more examples, see the [tests for ts-di](test/reflective_injector_spec.ts).

## API

For full documentation check Angular DI docs:
- [Dependency Injection](https://v4.angular.io/guide/dependency-injection)
- [Hierarchical Dependency Injectors](https://v4.angular.io/guide/hierarchical-dependency-injection)
- [Dependency Injection in action](https://v4.angular.io/guide/dependency-injection-in-action)
