---
sidebar_position: 1
slug: /
---

## Що робить Dependency Injection

Розглянемо ситуацію, коли є два залежних і один незалежний клас:

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

Щоб отримати інстанс класу `Service3` ви повинні знати не лише, що він залежить від `Service2`, а і що `Service2` залежить від `Service1`. Зрозуміло, що у реальних застосунках набагато більше класів, і зв'язки між ними прослідкувати буде набагато складніше. Паттерн "Dependency Injection" якраз і придуманий для спрощення роботи в таких ситуаціях.

Давайте тепер розглянемо приклад із використанням бібліотеки `@ts-stack/di`:

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

Метод `ReflectiveInjector.resolveAndCreate()` на вході приймає масив класів, а на виході видає певний об'єкт, що називається інжектором. Цей інжектор очевидно містить у собі передані класи, і вміє створювати їхні інстанси. В такому разі ви можете і не знати весь ланцюжок залежностей `Service3`, головне щоб усі вони були в тому масиві.

Які умови роботи даної бібліотеки:

1. Імпорт `reflect-metadata` для збору метаданих з будь-якого декоратора, та для закріплення цих метаданих за кожним класом. Вам можна не запам'ятовувати що саме робить `reflect-metadata`, достатньо знати що такий імпорт необхідний при роботі з декораторами.
2. Також необхідно використовувати декоратор `@Injectable()` над кожним класом, що має залежності. Завдяки цьому декоратору, `@ts-stack/di` збирає метадані з конструкторів класів, а тому знає які параметри має кожен конструктор, і які типи у цих параметрів.

Якщо дані умови не виконані, ви отримаєте приблизно таку помилку:

> Cannot resolve all parameters for 'Service2'(?). Make sure that all the parameters are decorated with Inject or have valid type annotations and that 'Service2' is decorated with Injectable.

## DI інжектори

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

service3 === injector.get(Service3) // true
```

Тепер `Service2` немає залежності від `Service1`, і при створенні інстансу `Service3`, інжектор створить також інстанс класу `Service2`, але не буде створювати інстанс класу `Service1`, оскільки він ще не запитувався, і від нього не залежать інші класи. З іншого боку, всі уже створені інстанси будуть зберігатись у самому інжекторі і видаватись при повторних запитах. Тобто конкретний інжектор створює інстанс певного класу один єдиний раз.

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

### Ієрархія інжекторів

Бібліотека `@ts-stack/di` дозволяє створювати ще й ієрархію інжекторів - це коли є батьківські та дочірні інжектори:

```ts
import { ReflectiveInjector } from '@ts-stack/di';

class Service1 {}

class Service2 {}

class Service3 {}

const parent = ReflectiveInjector.resolveAndCreate([Service1, Service2]); // Батьківський інжектор
const child = parent.resolveAndCreateChild([Service2, Service3]); // Від батьківського інжектора відгалуджується дочірній інжектор

child.get(Service1); // ОК
parent.get(Service1); // ОК

parent.get(Service1) === child.get(Service1); // true

child.get(Service2); // ОК
parent.get(Service2); // ОК

parent.get(Service2) === child.get(Service2); // false

child.get(Service3); // ОК
parent.get(Service3); // Error - No provider for Service3!
```

При створенні ієрархії, зв'язок утримує лише дочірній інжектор, бо має об'єкт батьківського інжектора. В той же час, батьківський інжектор нічого не знає про свої дочірні інжектори. Умовно, це виглядає наступним чином:

```ts
interface Parent {
  // Певні властивості батьківського інжектора.
}

interface Child {
  parent: Parent;
  // Інші властивості дочірного інжектора.
}
```

У попередньому прикладі батьківський інжектор може створити інстанси класів `Service1` та `Service2`, але не може створити інстансу класу `Service3`. Це якраз відбувається через те, що батьківський інжектор немає зв'язку із дочірнім інжектором, в якому є `Service3`.

Як бачите, `Service2` є в обох інжекторах, і тому кожен із інжекторів створить свою локальну версію, і саме через це даний вираз повертає `false`:

```ts
parent.get(Service2) === child.get(Service2); // false
```

А у випадку, коли запитують `Service1`, дочірній інжектор не знайде його локально і звернеться до батька. До речі, ще один неочевидний, але дуже важливий момент: дочірні інжектори хоча і звертаються до батьківських інжекторів, але самостійно не створюють інстансів класів, за якими звертаються до батьків. Саме тому цей вираз повертає `true`:

```ts
parent.get(Service1) === child.get(Service1); // true
```

## DI токени, провайдери та підміна провайдерів

Коли ви запитуєте у конструкторі класу інший клас, DI насправді запам'ятовує цей інший клас як **токен** для пошуку необхідного значення в масиві інжектора. Тобто токен - це ідентифікатор, по якому здійснюється пошук в інжекторі.

У масив інжектора можна передавати не лише класи, а й об'єкти:

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

const injector = ReflectiveInjector.resolveAndCreate([
  { provide: Service3, useValue: 'value for Servcie3' },
]);
const service3 = injector.get(Service3); // value for Servcie3
```

Як бачите, тут `Service3` залежить від `Service2`, а `Service2` залежить від `Service1`, але при створенні інжектора, йому передається одне єдине значення:

```ts
{ provide: Service3, useValue: 'value for Servcie3' }
```

Таким чином ми пишемо інструкцію для DI: "Коли у інжектора будуть запитувати токен `Service3`, потрібно використовувати готове текстове значення - `value for Servcie3`". Через таку інструкцію, DI вже не буде створювати `Service2` та `Service1`, хоча і в конструкторі `Service3` явно запитується інстанс класу `Service2`. Така інструкція по-суті робить підміну так званого провайдера.

Під поняттям **провайдер** у `@ts-stack/di` мається на увазі - або клас, або об'єкт із такими можливими властивостями:

```ts
{ provide: <token>, useClass: <class> },
{ provide: <token>, useValue: <any value> },
{ provide: <token>, useFactory: <function>, deps: [<dependencies>] },
{ provide: <token>, useExisting: <another token> },
```

Найчастіше використовуються два перші варіанти. Існує ще поняття мульти-провайдерів, але про них буде згадано пізніше.

В масив для створення інжектора можна передавати багато провайдерів для одного й того самого токена, але DI вибере останній із провайдерів, що відноситься до цього токена:

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

## Типи токенів

Тип токена може бути або класом, або об'єктом, або `string`, або `symbol`. У якості токена не можуть бути інтерфейси чи типи, що оголошені з ключовим словом `type`, оскільки після їх компіляції із TypeScript у JavaScript, від них нічого не залишиться у JavaScript-файлах. Також, у якості токена не можна використовувати масиви, оскільки покищо у TypeScript не має механізму для передачі типу цього масиву до скомпільованого JavaScript-коду.

Разом із тим, у конструкторі в якості токена найпростіше вказувати саме клас, в противному разі, в конструкторі необхідно використовувати декоратор `Inject`. Накриклад, у якості токена ви можете використовувати рядок `tokenForLocal`:

```ts
import { Injectable, Inject, ReflectiveInjector } from '@ts-stack/di';

@Injectable()
export class Service1 {
  constructor(@Inject('tokenForLocal') local: string) {}
}

const injector = ReflectiveInjector.resolveAndCreate([
  { provide: 'tokenForLocal', useValue: 'uk' }
]);

injector.get(Service1); // ОК
```

### InjectionToken

Окрім можливості використання токенів, що мають різні типи даних, DI має спеціальний клас,
рекомендований для створення токенів - `InjectionToken`. Оскільки він має параметр для типу
(дженерік), ви зможете прочитати тип даних, що буде повертати DI, при запиті конкретного токена:

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

const injector = ReflectiveInjector.resolveAndCreate([
  { provide: LOCAL, useValue: 'uk' }
]);

injector.get(Service1); // ОК
```

