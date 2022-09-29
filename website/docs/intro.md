---
sidebar_position: 1
slug: /
---

# Документація для @ts-stack/di

## Встановлення

```bash
yarn add @ts-stack/di reflect-metadata
```

## Що робить Dependency Injection

Розглянемо наступну ситуацію:

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

Щоб отримати інстанс класу `Service3` ви повинні знати не лише, що він залежить від `Service2`, а і що `Service2` залежить від `Service1`. Зрозуміло, що у реальних застосунках набагато більше класів, і зв'язки між ними прослідкувати буде набагато складніше.

Паттерн "Dependency Injection" (скорочено - DI) дуже спрощує роботу в таких ситуаціях. Одна із імплементацій цього патерну реалізована у бібліотеці `@ts-stack/di`. Ця бібліотека насправді є витягом із [Angular v4.4.7](https://v4.angular.io/guide/dependency-injection), але її можна використовувати у будь-якому TypeScript-проекті, бо вона вже нічого не робить специфічного тільки для Angular. Давайте використаємо її для нашої задачі:

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

Метод `ReflectiveInjector.resolveAndCreate()` на вході приймає масив класів, а на виході видає певний об'єкт, що називається інжектором. Цей інжектор очевидно містить у собі передані класи, і вміє створювати їхні інстанси, враховуючи весь ланцюжок залежностей (`Service3` -> `Service2` -> `Service1`).

Тобто робота інжектора якраз і полягає в тому, що коли у нього запитують `Service3`, він проглядає конструктор цього класу, бачить залежність від `Service2`, проглядає вже його конструктор, бачить залежність від `Service1`, проглядає його конструктор, не знаходить там залежності, і тому створює першим - інстанс `Service1`. Після того, як вже є інстанс `Service1`, можна створювати інстанс `Service2`, а коли і це вже зроблено, можна нарешті, у саму останню чергу створити інстанс `Service3`.

В такому разі вам можна і не знати весь ланцюжок залежностей `Service3`, довірте цю роботу інжектору, головне - передайте йому в масив усі необхідні класи.

## Умови роботи `@ts-stack/di`

З точки зору JavaScript-розробника, в тому, що DI якимось чином може проглядати конструктори класів і бачити там інші класи, які ще не встановленні в жодну змінну - це на даний момент можна назвати магією. І ця магія якраз і забезпечується наступними необхідними умовами роботи даної бібліотеки:

1. У вашому проекті, у файлі `tsconfig.json` необхідно дозволити використовувати декоратори:

```json
{
  "compilerOptions": {
    // ...
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

2. Встановити та імпортувати `reflect-metadata` для збору метаданих з будь-якого декоратора, та для закріплення цих метаданих за кожним класом. Вам можна не запам'ятовувати що саме робить `reflect-metadata`, достатньо знати що такий імпорт необхідний при роботі з декораторами.
3. Також необхідно використовувати декоратор `@Injectable()` над кожним класом, що має залежності. Завдяки цьому декоратору, DI збирає метадані з конструкторів класів, а тому знає скільки параметрів має кожен конструктор, і які типи у цих параметрів.

Якщо останні дві умови не виконані, ви отримаєте приблизно таку помилку:

> Cannot resolve all parameters for 'Service2'(?). Make sure that all the parameters are decorated with Inject or have valid type annotations and that 'Service2' is decorated with Injectable.

## Коли DI створює інстанси

Давайте трохи докладніше розберемось зі згаданими вище інжекторами. Із попереднього прикладу зрозуміло, що інжектор містить масив переданих йому класів і він вміє робити їхні інстанси. Але тут є ще декілька важливих неочевидних моментів. Змінимо трохи приклад:

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

Тепер `Service2` не має залежності від `Service1`, і при створенні інстансу `Service3`, інжектор створить також інстанс класу `Service2`, але не буде створювати інстанс класу `Service1`, оскільки він ще не запитувався, і від нього не залежать інші класи. З іншого боку, усі уже створені інстанси будуть зберігатись у самому інжекторі і видаватись при повторних запитах. Тобто конкретний інжектор створює інстанс певного класу один єдиний раз, але тільки після того, як запитують цей інстанс.

Виходить, що якщо потрібно частіше робити інстанси певних класів, необхідно створювати нові інжектори:

```ts
import { ReflectiveInjector } from '@ts-stack/di';

class Service1 {}

class Service2 {}

const services = [Service1, Service2];

const injector1 = ReflectiveInjector.resolveAndCreate(services);
const injector2 = ReflectiveInjector.resolveAndCreate(services);

injector1.get(Service2) === injector2.get(Service2); // false
```

## Ієрархія інжекторів

Бібліотека `@ts-stack/di` дозволяє створювати ще й ієрархію інжекторів - це коли є батьківські та дочірні інжектори. На перший погляд, немає нічого цікавого у такій ієрархії, бо не зрозуміло для чого вона потрібна, але на практиці ця можливість використовується якраз дуже часто, оскільки вона дозволяє робити архітектуру застосунку модульною. Вивченню специфіки ієрархії варто приділити особливу увагу, це в майбутньому збереже вам не одну годину роботи, бо ви знатимете як воно працює і чому воно не знаходить цієї залежності...

При створенні ієрархії, зв'язок утримує лише дочірній інжектор, він має об'єкт батьківського інжектора. В той же час, батьківський інжектор нічого не знає про свої дочірні інжектори. Тобто зв'язок між інжекторами є одностороннім. Умовно, це виглядає наступним чином:

```ts
interface Parent {
  // Тут є певні властивості батьківського інжектора, але немає дочірнього інжектора
}

interface Child {
  parent: Parent;
  // Тут існують інші властивості дочірного інжектора.
}
```

Завдяки наявності об'єкта батьківського інжектора, дочірній інжектор може звертатись до батьківського інжектора, коли у нього запитують інстанс класу, якого у нього немає.

Давайте розглянемо наступний приклад. Для спрощення, тут взагалі не використовуються декоратори, оскільки кожен клас є незалежним:

```ts
import { ReflectiveInjector } from '@ts-stack/di';

class Service1 {}
class Service2 {}
class Service3 {}
class Service4 {}

const parent = ReflectiveInjector.resolveAndCreate([Service1, Service2]); // Батьківський інжектор
const child = parent.resolveAndCreateChild([Service2, Service3]); // Дочірній інжектор

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

Як бачите, при створенні дочірнього інжектора, йому не передали `Service1`, тому при запиті інстансу цього класу він звернеться до батька. До речі, тут є один неочевидний, але дуже важливий момент: дочірні інжектори хоча і запитують у батьківських інжекторів певні інстанси класів, але самостійно вони їх не створюють. Саме тому цей вираз повертає `true`:

```ts
parent.get(Service1) === child.get(Service1); // true
```

А `Service2` є в обох інжекторів, тому кожен із них створить свою локальну версію, і саме через це даний вираз повертає `false`:

```ts
parent.get(Service2) === child.get(Service2); // false
```

Батьківський інжектор не може створити інстансу класу `Service3` через те, що батьківський інжектор не має зв'язку із дочірнім інжектором, в якому є `Service3`.

Ну і обидва інжектори не можуть видати інстансу `Service4`, бо їм не передали цього класу при їхньому створенні.

## DI токени, провайдери та підміна провайдерів

Коли ви запитуєте у конструкторі класу інший клас, DI насправді запам'ятовує цей інший клас як **токен** для пошуку необхідного значення в масиві інжектора. Тобто токен - це ідентифікатор, по якому здійснюється пошук в інжекторі.

У масив інжектора можна передавати не лише класи, а й об'єкти:

```ts
const injector = ReflectiveInjector.resolveAndCreate([{ provide: Service1, useClass: Service2 }]);

const service = injector.get(Service1); // Інстанс класу Service2
```

Таким чином ми пишемо інструкцію для DI: "Коли у інжектора будуть запитувати токен `Service1`, насправді потрібно повертати інстанс класу `Service2`". Така інструкція по-суті робить підміну так званого провайдера.

Під поняттям **провайдер** у `@ts-stack/di` мається на увазі - або клас, або об'єкт із такими можливими властивостями:

```text
{ provide: <token>, useClass: <class> },
{ provide: <token>, useValue: <any value> },
{ provide: <token>, useFactory: <function>, deps: [<providers of dependencies>] },
{ provide: <token>, useExisting: <another token> },
```

У кожного провайдера є токен, але не кожен токен може бути провайдером. Фактично лише клас може виступати і у якості провайдера, і у якості токена. А, наприклад, текстове значення може бути лише токеном, але не провайдером. Про типи токенів розповідається докладніше в [наступному розділі](#типи-di-токенів).

Існує ще поняття мульти-провайдерів, але про них буде згадано [пізніше](#мульти-провайдери).

### useExisting

Як показано в попередньому прикладі, щоб вказати провайдер, ви можете використати об'єкт, що має властивість `useExisting`. Зверніть увагу, що в такому разі ви не передаєте сам провайдер, а лише **вказуєте** на його токен. Наприклад:

```ts
[
  { provide: Class2, useExisting: Class1 },
  // ...
]
```

Тут токен `Class2` вказує на інший токен `Class1`. Для інжектора DI така інструкція говорить: "Щоб знайти значення для токена `Class2`, потрібно шукати провайдера по токену `Class1`".

:::tip Коли це потрібно?
Такий варіант доцільно використовувати, коли ви маєте базовий та розширений клас, і хочете використовувати базовий клас у якості токена для DI, а інстанс розширеного класу - у якості значення для цього токена. Разом із тим, ви хочете використовувати в одних випадках інтерфейс базового класу, а у інших - інтерфейс розширеного класу.
:::

Приклад із життя. Припустимо ваш фреймворк використовує базовий логер, який через DI приймає базову конфігурацію:

```ts
class BaseLoggerConfig {
  level: string;
}
```

Ви хочете розширити цю конфігурацію так, щоб вона працювала і для базового, і для розширеного логера:

```ts
class ExtendedLoggerConfig extends BaseLoggerConfig {
  displayFilePath: string;
  displayFunctionName: boolean;
}
```

Разом із тим, ви хочете у базовому логері використовувати інтерфейс базової конфігурації, а у розширеному - інтерфейс розширеної конфігурації:

```ts
// Десь у коді вашого фреймворку
class BaseLogger {
  constructor(private loggerConfig: BaseLoggerConfig) {}
}

//...

// Десь у коді вашого застосунку
class ExtendedLogger extends BaseLogger {
  constructor(private extendedLoggerConfig: ExtendedLoggerConfig) {
    super(extendedLoggerConfig);
    // ...
  }
}
```

Щоб не передавати дві різні конфігурації до DI, можете використати `useExisting`: 

```ts
[
  { provide: BaseLoggerConfig, useValue: new ExtendedLoggerConfig() },
  { provide: ExtendedLoggerConfig, useExisting: BaseLoggerConfig },
]
```

Таким чином ви передаєте для DI дві інструкції:

1. перший елемент в масиві передає значення для токена `BaseLoggerConfig`;
2. другий елемент в масиві вказує, що для токена `ExtendedLoggerConfig` значення потрібно шукати по токену `BaseLoggerConfig` (тобто фактично вказує на перший елемент масиву).

В такому разі і базовий, і розширений логер отримають одну й ту саму - розширену конфігурацію, яка буде сумісна із базовою конфігурацією.

## Множинне додавання провайдерів з однаковим токеном

В масив для створення інжектора можна передавати багато провайдерів для одного й того самого токена, але DI вибере останній із провайдерів:

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

Тут для токена `Service1` в інжектор передано три провайдера, але DI вибере самий останній, тому буде створено інстанс класу `Service3`.

На практиці, завдяки цьому механізму, розробники фреймворків в інжектор можуть передавати дефолтні провайдери, а користувачі цих фреймворків вже можуть підміняти їх своїм власними провайдерами. Також завдяки цьому механізму спрощується тестування застосунків, бо в самому застосунку можуть передаватись одні провайдери, а у тестах - інші.

## Типи DI токенів

Тип токена може бути або класом, або об'єктом, або текстом, або `symbol`. У якості токена не можуть бути інтерфейси чи типи, що оголошені з ключовим словом `type`, оскільки після їх компіляції із TypeScript у JavaScript, від них нічого не залишиться у JavaScript-файлах. Також, у якості токена не можна використовувати масиви, оскільки покищо у TypeScript не має механізму для передачі типу масиву до скомпільованого JavaScript-коду.

Разом із тим, у конструкторі в якості токена найпростіше вказувати саме клас, в противному разі, необхідно використовувати декоратор `Inject`. Накриклад, у якості токена ви можете використовувати текст `tokenForLocal`:

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

Окрім можливості використання токенів, що мають різні типи даних, DI має спеціальний клас, рекомендований для створення токенів - `InjectionToken`. Оскільки він має параметр для типу (дженерік), ви зможете прочитати тип даних, що буде повертати DI, при запиті конкретного токена:

```ts
import { InjectionToken } from '@ts-stack/di';

export const LOCAL = new InjectionToken<string>('tokenForLocal');
```

Користуватись ним можна точно так само, як і усіма іншими токенами, що не є класами:

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

Звичайно ж, `InjectionToken` рекомендується використовувати тільки якщо ви не можете використати безпосередньо певний клас у якості токена.

## Мульти-провайдери

Цей вид провайдерів відрізняється від звичайних DI-провайдерів наявністю властивості `multi: true`. Такі провайдери доцільно використовувати, коли є потреба у передачі до DI зразу декількох провайдерів з однаковим токеном, щоб DI повернув таку саму кількість значень для цих провайдерів в одному масиві:

```ts
import { ReflectiveInjector } from '@ts-stack/di';

import { LOCAL } from './tokens';

const injector = ReflectiveInjector.resolveAndCreate([
  { provide: LOCAL, useValue: 'uk', multi: true },
  { provide: LOCAL, useValue: 'en', multi: true },
]);

const locals = injector.get(LOCAL); // ['uk', 'en']
```

Не допускається щоб в одному інжекторі однаковий токен мали і звичайні, і мульти-провайдери:

```ts
import { ReflectiveInjector } from '@ts-stack/di';

import { LOCAL } from './tokens';

const injector = ReflectiveInjector.resolveAndCreate([
  { provide: LOCAL, useValue: 'uk' },
  { provide: LOCAL, useValue: 'en', multi: true },
]);

const locals = injector.get(LOCAL); // Error: Cannot mix multi providers and regular providers
```

Дочірні інжектори можуть повертати мульти-провайдери батьківського інжектора лише якщо при створенні дочірніх інжекторів їм не передавались провайдери з такими самими токенами:

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

Якщо ж і в дочірнього, і в батьківського інжектора є мульти-провайдери з однаковим токеном, дочірній інжектор повертатиме значення лише зі свого масиву:

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

### Підміна мультипровайдерів

Щоб стала можливою підміна конкретного мультипровайдера, можна зробити так:

1. спочатку передавайте мультипровайдер та використовуйте властивість `useExisting`;
2. потім передавайте клас який ви хочете підмінити;
3. ну і в кінець масиву передавайте клас, який підмінює потрібний вам клас.

```ts
import { ReflectiveInjector } from '@ts-stack/di';

import { HTTP_INTERCEPTORS } from './constants';
import { DefaultInterceptor } from './default.interceptor';
import { MyInterceptor } from './my.interceptor';

const injector = ReflectiveInjector.resolveAndCreate([
  { provide: HTTP_INTERCEPTORS, useExisting: DefaultInterceptor, multi: true },
  DefaultInterceptor,
  { provide: DefaultInterceptor, useClass: MyInterceptor }
]);

const locals = injector.get(HTTP_INTERCEPTORS); // [MyInterceptor]
```

Така конструкція має сенс, наприклад, якщо перші два пункти виконуються десь у зовнішньому модулі, до якого у вас немає доступу на редагування, а третій пункт виконує вже користувач цього модуля.
