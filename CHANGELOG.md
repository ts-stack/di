<a name="1.2.0"></a>
# [1.2.0](https://github.com/ts-stack/di/releases/tag/1.2.0) (2021-11-22)

### Features

- Added `Error.captureStackTrace()` to clear internal error trace.
- Migrating to TypeScript strict `compilerOptions`.

### Performance Improvements

- Migrating injectors from array search to object search should improve their performance (more than three times).

<a name="1.2.0-rc.3"></a>
## [1.2.0-rc.3](https://github.com/ts-stack/di/releases/tag/1.2.0-rc.3) (2021-11-17)

### Breaking Changes

- Removed support for injector's siblings, setting parent after create injector.

<a name="1.2.0-rc.2"></a>
## [1.2.0-rc.2](https://github.com/ts-stack/di/releases/tag/1.2.0-rc.2) (2021-11-12)

### Features

- Migrating to TypeScript strict `compilerOptions`.

<a name="1.2.0-rc.1"></a>
## [1.2.0-rc.1](https://github.com/ts-stack/di/releases/tag/1.2.0-rc.1) (2021-11-11)

### Performance Improvements

- Migrating injectors from array search to object search should improve their performance (more than three times).

<a name="1.2.0-beta.8"></a>
## [1.2.0-beta.8](https://github.com/ts-stack/di/releases/tag/1.2.0-beta.8) (2021-11-11)

### Bug fixes

- Fixed `Error.captureStackTrace()` location.

<a name="1.2.0-beta.7"></a>
## [1.2.0-beta.7](https://github.com/ts-stack/di/releases/tag/1.2.0-beta.7) (2021-11-11)

### Features

- Added `Error.captureStackTrace()` to clear internal error trace.

<a name="1.2.0-beta.6"></a>
## [1.2.0-beta.6](https://github.com/ts-stack/di/releases/tag/1.2.0-beta.6) (2021-11-10)

### Features

- Added `injector.clearCache()`.

<a name="1.2.0-beta.5"></a>
## [1.2.0-beta.5](https://github.com/ts-stack/di/releases/tag/1.2.0-beta.5) (2021-11-10)

### Breaking Changes

- Removed `injector.setSiblingsMap()`.

### Features

- Added the ability for the injector to set parent after child is created.

<a name="1.2.0-beta.4"></a>
## [1.2.0-beta.4](https://github.com/ts-stack/di/releases/tag/1.2.0-beta.4) (2021-11-10)

### Features

- Added `injector.setSiblingsMap()`. Usage:

```ts
const map = new Map<any, ReflectiveInjector>();
map.set(token1, externalInjector1);
map.set(token2, externalInjector1);
map.set(token3, externalInjector1);

map.set(token4, externalInjector2);
map.set(token5, externalInjector2);
//...
injector.setSiblingsMap(map);
```

<a name="1.2.0-beta.3"></a>
## [1.2.0-beta.3](https://github.com/ts-stack/di/releases/tag/1.2.0-beta.3) (2021-11-09)

### Features

- Added the ability for the injector to search tokens first in siblings and only then proceed
to search in the parent injectors.

<a name="1.2.0-beta.2"></a>
## [1.2.0-beta.2](https://github.com/ts-stack/di/releases/tag/1.2.0-beta.2) (2021-11-08)

### Bug fix

- Fixed `injector.addSibling()` call signature.

Before:

```ts
addSibling(externalInjector: ReflectiveInjector, providers: Providers[]): void;
```

Now:

```ts
addSibling(externalInjector: ReflectiveInjector, tokens: any[]): void;
```

<a name="1.2.0-beta.1"></a>
## [1.2.0-beta.1](https://github.com/ts-stack/di/releases/tag/1.2.0-beta.1) (2021-11-07)

### Features

- Introduce injector's siblings. Now you can use it like this:

```ts
injector.get(ExternalProvider); // Error
injector.addSibling(externalInjector, [ExternalProvider]);
injector.get(ExternalProvider); // OK
```

<a name="1.1.0"></a>
## [1.1.0](https://github.com/ts-stack/di/releases/tag/1.1.0) (2020-09-18)

### Features

- Removed `src` folder from `.npmignore`, so you can debug stack trace in `src`.