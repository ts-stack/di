---
sidebar_position: 1
slug: /
---

# Documentation for @ts-stack/di

## Install

```bash
yarn add @ts-stack/di reflect-metadata
```

## How Dependency Injection works

Consider the following situation:

```ts
class Service1 {}

class Service2 {
  constructor(service1: Service1) {}
}

class Service3 {
  constructor(service2: Service2) {}
}

const service1 = new Service1();
const service2 = new Service2(service1);
const service3 = new Service3(service2);
```

To get an instance of the `Service3` class, you need to know not only that it depends on `Service2`, but also that `Service2` depends on `Service1`. It is clear that in real applications there are many more classes, and the connections between them will be much more difficult to trace.

The pattern "Dependency Injection" (abbreviated - DI) greatly simplifies work in such situations. One of the implementations of this pattern is implemented in the library `@ts-stack/di`. This library is actually an excerpt from [Angular v4.4.7](https://v4.angular.io/guide/dependency-injection), but it can be used in any TypeScript project because it no longer does anything specific for Angular. Let's use it for our task:

```ts
import 'reflect-metadata';
import { ReflectiveInjector, Injectable } from '@ts-stack/di';

class Service1 {}

@Injectable()
class Service2 {
  constructor(service1: Service1) {}
}

@Injectable()
class Service3 {
  constructor(service2: Service2) {}
}

const injector = ReflectiveInjector.resolveAndCreate([Service1, Service2, Service3]);
const service3 = injector.get(Service3);
```

The `ReflectiveInjector.resolveAndCreate()` method takes an array of classes at the input and outputs a specific object called an injector. This injector obviously contains the transferred classes, and is able to create their instances, considering all chain of dependencies (`Service3` -> `Service2` -> `Service1`).

That is, the work of the injector is that when it is asked `Service3`, it looks at the constructor of this class, sees the dependence on `Service2`, then sees its constructor, sees the dependence on `Service1`, looks at its constructor, does not find there dependencies, and therefore creates the first - instance `Service1`. Once you have the `Service1` instance, you can create the `Service2` instance, and once you've done that, you can finally create the `Service3` instance.

In this case, you may not know the whole chain of dependencies `Service3`, entrust this work to the injector, the main thing - give to its array all the necessary classes.

## Prerequisites for `@ts-stack/di`

From the point of view of the JavaScript developer, the fact that DI can somehow view class constructors and see there other classes - this can be called magic at the moment. And this magic is provided by the following necessary prerequisites of work of this library:

1. In your project, in the file `tsconfig.json` it is necessary to allow to use decorators:

```json
{
  "compilerOptions": {
    // ...
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

2. Install and import `reflect-metadata` to collect metadata from any decorator, and to attach this metadata to each class. You may not remember what exactly `reflect-metadata` does, it is enough to know that such import is necessary when working with decorators.
3. You must also use the `@Injectable()` decorator above each class that has dependencies. Thanks to this decorator, DI collects metadata from class constructors, and therefore knows how many parameters each constructor has, and what types of these parameters.

If the last two conditions are not met, you will receive approximately the following error:

> Cannot resolve all parameters for 'Service2'(?). Make sure that all the parameters are decorated with Inject or have valid type annotations and that 'Service2' is decorated with Injectable.

## When DI creates instances

Let's take a closer look at the injectors mentioned above. From the previous example it is clear that the injector contains an array of classes transferred to it and it knows how to make their instances. But here are a few more important unobvious points. Let's change a little example:

```ts
import 'reflect-metadata';
import { ReflectiveInjector, Injectable } from '@ts-stack/di';

class Service1 {}

class Service2 {}

@Injectable()
class Service3 {
  constructor(service2: Service2) {}
}

const injector = ReflectiveInjector.resolveAndCreate([Service1, Service2, Service3]);
const service3 = injector.get(Service3);

service3 === injector.get(Service3); // true
```

Now `Service2` is not dependent on `Service1`, and when creating an instance of `Service3`, the injector will also create an instance of class `Service2`, but will not create an instance of class `Service1`, because it has not been requested and does not depend on it other classes. On the other hand, all already created instances will be stored in the injector itself and returned upon repeated requests. That is, a specific injector creates an instance of a certain class only once, but only after this instance is requested.

It turns out that if you need to do more instances of certain classes, you need to create new injectors:

```ts
import { ReflectiveInjector } from '@ts-stack/di';

class Service1 {}

class Service2 {}

const services = [Service1, Service2];

const injector1 = ReflectiveInjector.resolveAndCreate(services);
const injector2 = ReflectiveInjector.resolveAndCreate(services);

injector1.get(Service2) === injector2.get(Service2); // false
```

## Hierarchy of injectors

The `@ts-stack/di` library also allows you to create a hierarchy of injectors - this is when there are parent and child injectors. At first glance, there is nothing interesting in such a hierarchy, because it is not clear why it is needed, but in practice this feature is used very often, because it allows you to make the application architecture modular. Special attention should be paid to the study of the specifics of the hierarchy, it will save you a lot of time in the future, because you will know how it works and why it does not find this dependence...

When creating a hierarchy, the connection is held only by the child injector, it has the object of the parent injector. At the same time, the parent injector knows nothing about its child injectors. That is, the connection between the injectors is one-way. Conventionally, it looks like this:

```ts
interface Parent {
  // There are certain properties of the parent injector, but no child injector
}

interface Child {
  parent: Parent;
  // There are other properties of the child injector.
}
```

Due to the presence of the parent injector object, the child injector may contact the parent injector when asked for an instance of a class that it does not have.

Let's consider the following example. For simplicity, decorators are not used here at all, as each class is independent:

```ts
import { ReflectiveInjector } from '@ts-stack/di';

class Service1 {}
class Service2 {}
class Service3 {}
class Service4 {}

const parent = ReflectiveInjector.resolveAndCreate([Service1, Service2]); // Parent injector
const child = parent.resolveAndCreateChild([Service2, Service3]); // Child injector

child.get(Service1); // ОК
parent.get(Service1); // ОК

parent.get(Service1) === child.get(Service1); // true

child.get(Service2); // ОК
parent.get(Service2); // ОК

parent.get(Service2) === child.get(Service2); // false

child.get(Service3); // ОК
parent.get(Service3); // Error - No provider for Service3!

child.get(Service4); // Error - No provider for Service4!
parent.get(Service4); // Error - No provider for Service4!
```

As you can see, when creating a child injector, it was not given `Service1`, so when you request an instance of this class, it will contact its parent. By the way, there is one unobvious but very important point here: although the child injectors ask the parent injectors for certain instances of the classes, they do not create them on their own. That is why this expression returns `true`:

```ts
parent.get(Service1) === child.get(Service1); // true
```

And `Service2` has both injectors, so each of them will create its own local version, and that's why this expression returns `false`:

```ts
parent.get(Service2) === child.get(Service2); // false
```

The parent injector cannot create an instance of the `Service3` class because the parent injector has no connection to the child injector that has `Service3`.

Well, both injectors can't create a `Service4` instance because they weren't given this class when they were created.

## DI tokens, providers and substitution providers

When you query another class in the class constructor, the DI actually remembers that other class as a **token** to find the desired value in the injector array. That is, the token is the identifier used to search iside an injector.

Not only classes but also objects can be transferred to the injector array:

```ts
const injector = ReflectiveInjector.resolveAndCreate([{ provide: Service1, useClass: Service2 }]);

const service = injector.get(Service1); // instance of Service2
```

So we write instructions for DI: "When the injector is asked for a token `Service1`, actually need to return an instance of class `Service2`". This instruction essentially replaces the so-called "provider".

The term **provider** in `@ts-stack/di` means either a class or an object with the following possible properties:

```text
{ provide: <token>, useClass: <class> },
{ provide: <token>, useValue: <any value> },
{ provide: <token>, useFactory: <function>, deps: [<providers of dependencies>] },
{ provide: <token>, useExisting: <another token> },
```

Every provider has a token, but not every token can be a provider. In fact, only a class can act as both a provider and a token. For example, a string can only be used as a token, not as a provider. Token types are described in more detail in the [next section](#types-of-di-tokens).

There is also the concept of multi-providers, but they will be mentioned [later](#multi-providers).

### useExisting


As shown in the previous example, to specify a provider, you can use an object with the `useExisting` property. Note that in this case you are not passing the provider itself, but only **pointing** to its token. Example:

```ts
[
  { provide: Class2, useExisting: Class1 },
  // ...
]
```

Here, the token `Class2` points to another token `Class1`. For the DI injector, this instruction says: "When `Class2` is requested, it is necessary to continue the search for the provider, but with the `Class1` token."

:::tip When is it needed?
This option is advisable to use when you want to use a single token to transfer to DI several different providers that are united to each other by a basic interface. However, you want to use all these different providers as tokens when you request their values from DI.
:::

Suppose your code uses `BaseService` and you want to extend it in a new `ExtendedService` class. When you pass values for these classes to DI, you will only use `BaseService` as a token. However, when you request DI for either `BaseService` or `ExtendedService`, you want to be given a provider with a `BaseService` token. These classes can be:

```ts
class BaseService {
  property1: string;
}

class ExtendedService extends BaseService {
  property2?: number;
}
```

:::caution Optional properties in extended class
It is important that all the properties of the extended class are optional, because DI can give a `BaseService` instance based on the `ExtendedService` token.
:::

Now let's assume that in one of the services, the provider is requested by the `BaseService` token as follows:

```ts
@Injectable()
class OldService {
  constructor(private baseService: BaseService) {}

  oldMethod() {
    console.log('The basic interface of the provider is used:', this.baseService.property1);
  }
}
```

This service can work with an instance of `BaseService` or `ExtendedService`, because both of these classes are united by the base interface, and only the property of the base interface is used here. That is, we can pass one of these providers to DI:

```ts
[
  { provide: BaseService, useValue: new BaseService() },
  { provide: BaseService, useValue: new ExtendedService() },
]
```

The following example. Let's assume that in another service, a provider is requested from the DI using the `ExtendedService` token:

```ts
@Injectable()
class NewService {
  constructor(private extendedService: ExtendedService) {}

  newMethod() {
    if (this.extendedService.hasProperty('property2')) {
      console.log('This is an extended version of the provider:', this.extendedService);
    } else {
      console.log('This is the basic version of the provider:', this.extendedService);
    }
  }
}
```

In order for `NewService` to work with instances of `BaseService` or `ExtendedService`, you need to use the `useExisting` property when passing providers to DI:

```ts
[
  { provide: ExtendedService, useExisting: BaseService },
  { provide: BaseService, useValue: new ExtendedService() },
]
```

In this case, upon request of `ExtendedService`, DI will give an instance of `ExtendedService`.

And if you write like this:

```ts
[
  { provide: ExtendedService, useExisting: BaseService },
  { provide: BaseService, useValue: new BaseService() },
]
```

In this case, upon request of `ExtendedService`, DI will give an instance of `BaseService`.

Well, if you write like this:

```ts
[
  { provide: ExtendedService, useExisting: BaseService },
]
```

DI кине помилку, бо ви дали інструкцію, щоб по запиту `ExtendedService` DI продовжував пошук провайдера із токеном `BaseService`, але не дали самого провайдера із токеном `BaseService`.

Враховуючи ту роль, яку виконує об'єкт із значенням `useExisting` для інжектора DI, мабуть краще було б використовувати замість `useExisting` властивість `useToken`:

DI will throw an error, because you gave an instruction so that upon request `ExtendedService` DI continues to search for a provider with a `BaseService` token, but you did not give the provider with a `BaseService` token itself.

Given the role that the `useExisting` object plays for the DI injector, it would probably be better to use the `useToken` property instead of `useExisting`:

```ts
[
  { provide: Class2, useToken: Class1 }
]
```

But the Angular team [didn't want to rename `useExisting'][1].

## Multiple addition of providers with the same token

You can pass many providers to the injector array for the same token, but DI will choose the last provider:

```ts
import { ReflectiveInjector } from '@ts-stack/di';

class Service1 {}
class Service2 {}
class Service3 {}

const injector = ReflectiveInjector.resolveAndCreate([
  Service1,
  { provide: Service1, useClass: Service2 },
  { provide: Service1, useClass: Service3 },
]);

injector.get(Service1); // instance of Service3
```

Here, three providers are transferred to the injector for the `Service1` token, but DI will choose the last one, so an instance of the `Service3` class will be created.

In practice, thanks to this mechanism, developers of frameworks can transfer default providers to the injector, and users of these frameworks can substitute them with their own providers. This mechanism also simplifies application testing, as some providers can be transmitted in the application itself and others in tests.

## Types of DI tokens

The token type can be either a class, or an object, or text, or `symbol`. Interfaces or types declared with the `type` keyword cannot be used as tokens, because once they are compiled from TypeScript into JavaScript, nothing will be left of them in JavaScript files. Also, you can't use arrays as a token, because TypeScript doesn't have a mechanism to pass an array type to compiled JavaScript code.

However, in the constructor as a token it is easiest to specify the class, otherwise, you must use the decorator `Inject`. For example, you can use string `tokenForLocal` as a token:

```ts
import { Injectable, Inject, ReflectiveInjector } from '@ts-stack/di';

@Injectable()
export class Service1 {
  constructor(@Inject('tokenForLocal') local: string) {}
}

const injector = ReflectiveInjector.resolveAndCreate([{ provide: 'tokenForLocal', useValue: 'uk' }]);

injector.get(Service1); // OK
```

### InjectionToken

In addition to the ability to use tokens that have different types of data, DI has a special class recommended for creating tokens - `InjectionToken`. Because it has a parameter for the type (it's generic), you can read the data type that will return the DI when requesting a specific token:

```ts
import { InjectionToken } from '@ts-stack/di';

export const LOCAL = new InjectionToken<string>('tokenForLocal');
```

It can be used in the same way as all other tokens that are not classes:

```ts
import { Injectable, Inject, ReflectiveInjector } from '@ts-stack/di';

import { LOCAL } from './tokens';

@Injectable()
export class Service1 {
  constructor(@Inject(LOCAL) local: string) {}
}

const injector = ReflectiveInjector.resolveAndCreate([{ provide: LOCAL, useValue: 'uk' }]);

injector.get(Service1); // ОК
```

Of course, it is recommended to use the `InjectionToken` only if you cannot use a certain class directly as a token.

## Multi providers

This type of provider differs from regular DI providers by having the `multi: true` property, and you can transfer multiple providers with the same token to the injector, and DI will return the same number of instances in the same array:

```ts
import { ReflectiveInjector } from '@ts-stack/di';

import { LOCAL } from './tokens';

const injector = ReflectiveInjector.resolveAndCreate([
  { provide: LOCAL, useValue: 'uk', multi: true },
  { provide: LOCAL, useValue: 'en', multi: true },
]);

const locals = injector.get(LOCAL); // ['uk', 'en']
```

It is not allowed that both regular and multi providers have the same token in one injector:

```ts
import { ReflectiveInjector } from '@ts-stack/di';

import { LOCAL } from './tokens';

const injector = ReflectiveInjector.resolveAndCreate([
  { provide: LOCAL, useValue: 'uk' },
  { provide: LOCAL, useValue: 'en', multi: true },
]);

const locals = injector.get(LOCAL); // Error: Cannot mix multi providers and regular providers
```

Child injectors may return multi providers of the parent injector only if they did not receive providers with the same tokens when creating child injectors:

```ts
import { ReflectiveInjector } from '@ts-stack/di';

import { LOCAL } from './tokens';

const parent = ReflectiveInjector.resolveAndCreate([
  { provide: LOCAL, useValue: 'uk', multi: true },
  { provide: LOCAL, useValue: 'en', multi: true },
]);

const child = parent.resolveAndCreateChild([]);

const locals = child.get(LOCAL); // ['uk', 'en']
```

If both the child injector and the parent injector have multi providers with the same token, the child injector will return values only from its array:

```ts
import { ReflectiveInjector } from '@ts-stack/di';

import { LOCAL } from './tokens';

const parent = ReflectiveInjector.resolveAndCreate([
  { provide: LOCAL, useValue: 'uk', multi: true },
  { provide: LOCAL, useValue: 'en', multi: true },
]);

const child = parent.resolveAndCreateChild([
  { provide: LOCAL, useValue: 'аа', multi: true }
]);

const locals = child.get(LOCAL); // ['аа']
```

```


[1]: https://github.com/angular/angular/issues/19650
