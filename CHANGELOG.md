<a name="1.2.0-beta.1"></a>
# [1.2.0-beta.1](https://github.com/ts-stack/di/releases/tag/1.2.0-beta.1) (2020-11-07)

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