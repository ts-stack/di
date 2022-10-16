"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[225],{744:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>l});var r=n(3117),a=(n(7294),n(3905));const i={sidebar_position:1,slug:"/"},o="Documentation for @ts-stack/di",s={unversionedId:"intro",id:"intro",title:"Documentation for @ts-stack/di",description:"Install",source:"@site/i18n/en/docusaurus-plugin-content-docs/current/intro.md",sourceDirName:".",slug:"/",permalink:"/di/en/",draft:!1,editUrl:"https://github.com/ts-stack/diedit/main/website/i18n/en/docusaurus-plugin-content-docs/current/intro.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,slug:"/"},sidebar:"tutorialSidebar"},c={},l=[{value:"Install",id:"install",level:2},{value:"How Dependency Injection works",id:"how-dependency-injection-works",level:2},{value:"Prerequisites for <code>@ts-stack/di</code>",id:"prerequisites-for-ts-stackdi",level:2},{value:"When DI creates instances",id:"when-di-creates-instances",level:2},{value:"Hierarchy of injectors",id:"hierarchy-of-injectors",level:2},{value:"DI tokens, providers and substitution providers",id:"di-tokens-providers-and-substitution-providers",level:2},{value:"useExisting",id:"useexisting",level:3},{value:"Multiple addition of providers with the same token",id:"multiple-addition-of-providers-with-the-same-token",level:2},{value:"Types of DI tokens",id:"types-of-di-tokens",level:2},{value:"InjectionToken",id:"injectiontoken",level:3},{value:"Multi providers",id:"multi-providers",level:2},{value:"Substituting multiproviders",id:"substituting-multiproviders",level:3}],p={toc:l};function d(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"documentation-for-ts-stackdi"},"Documentation for @ts-stack/di"),(0,a.kt)("h2",{id:"install"},"Install"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @ts-stack/di reflect-metadata\n")),(0,a.kt)("h2",{id:"how-dependency-injection-works"},"How Dependency Injection works"),(0,a.kt)("p",null,"Consider the following situation:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"class Service1 {}\n\nclass Service2 {\n  constructor(service1: Service1) {}\n}\n\nclass Service3 {\n  constructor(service2: Service2) {}\n}\n\nconst service1 = new Service1();\nconst service2 = new Service2(service1);\nconst service3 = new Service3(service2);\n")),(0,a.kt)("p",null,"To get an instance of the ",(0,a.kt)("inlineCode",{parentName:"p"},"Service3")," class, you need to know not only that it depends on ",(0,a.kt)("inlineCode",{parentName:"p"},"Service2"),", but also that ",(0,a.kt)("inlineCode",{parentName:"p"},"Service2")," depends on ",(0,a.kt)("inlineCode",{parentName:"p"},"Service1"),". It is clear that in real applications there are many more classes, and the connections between them will be much more difficult to trace."),(0,a.kt)("p",null,'The pattern "Dependency Injection" (abbreviated - DI) greatly simplifies work in such situations. One of the implementations of this pattern is implemented in the library ',(0,a.kt)("inlineCode",{parentName:"p"},"@ts-stack/di"),". This library is actually an excerpt from ",(0,a.kt)("a",{parentName:"p",href:"https://v4.angular.io/guide/dependency-injection"},"Angular v4.4.7"),", but it can be used in any TypeScript project because it no longer does anything specific for Angular. Let's use it for our task:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import 'reflect-metadata';\nimport { ReflectiveInjector, Injectable } from '@ts-stack/di';\n\nclass Service1 {}\n\n@Injectable()\nclass Service2 {\n  constructor(service1: Service1) {}\n}\n\n@Injectable()\nclass Service3 {\n  constructor(service2: Service2) {}\n}\n\nconst injector = ReflectiveInjector.resolveAndCreate([Service1, Service2, Service3]);\nconst service3 = injector.get(Service3);\n")),(0,a.kt)("p",null,"The ",(0,a.kt)("inlineCode",{parentName:"p"},"ReflectiveInjector.resolveAndCreate()")," method takes an array of classes at the input and outputs a specific object called an injector. This injector obviously contains the transferred classes, and is able to create their instances, considering all chain of dependencies (",(0,a.kt)("inlineCode",{parentName:"p"},"Service3")," -> ",(0,a.kt)("inlineCode",{parentName:"p"},"Service2")," -> ",(0,a.kt)("inlineCode",{parentName:"p"},"Service1"),")."),(0,a.kt)("p",null,"That is, the work of the injector is that when it is asked ",(0,a.kt)("inlineCode",{parentName:"p"},"Service3"),", it looks at the constructor of this class, sees the dependence on ",(0,a.kt)("inlineCode",{parentName:"p"},"Service2"),", then sees its constructor, sees the dependence on ",(0,a.kt)("inlineCode",{parentName:"p"},"Service1"),", looks at its constructor, does not find there dependencies, and therefore creates the first - instance ",(0,a.kt)("inlineCode",{parentName:"p"},"Service1"),". Once you have the ",(0,a.kt)("inlineCode",{parentName:"p"},"Service1")," instance, you can create the ",(0,a.kt)("inlineCode",{parentName:"p"},"Service2")," instance, and once you've done that, you can finally create the ",(0,a.kt)("inlineCode",{parentName:"p"},"Service3")," instance."),(0,a.kt)("p",null,"In this case, you may not know the whole chain of dependencies ",(0,a.kt)("inlineCode",{parentName:"p"},"Service3"),", entrust this work to the injector, the main thing - give to its array all the necessary classes."),(0,a.kt)("h2",{id:"prerequisites-for-ts-stackdi"},"Prerequisites for ",(0,a.kt)("inlineCode",{parentName:"h2"},"@ts-stack/di")),(0,a.kt)("p",null,"From the point of view of the JavaScript developer, the fact that DI can somehow view class constructors and see there other classes - this can be called magic. And this magic is provided by the following necessary prerequisites of work of this library:"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"In your project, in the file ",(0,a.kt)("inlineCode",{parentName:"li"},"tsconfig.json")," it is necessary to allow to use decorators:")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "compilerOptions": {\n    // ...\n    "experimentalDecorators": true,\n    "emitDecoratorMetadata": true\n  }\n}\n')),(0,a.kt)("ol",{start:2},(0,a.kt)("li",{parentName:"ol"},"Install and import ",(0,a.kt)("inlineCode",{parentName:"li"},"reflect-metadata")," to collect metadata from any decorator, and to attach this metadata to each class. You may not remember what exactly ",(0,a.kt)("inlineCode",{parentName:"li"},"reflect-metadata")," does, it is enough to know that such import is necessary when working with decorators."),(0,a.kt)("li",{parentName:"ol"},"You must also use the ",(0,a.kt)("inlineCode",{parentName:"li"},"@Injectable()")," decorator above each class that has dependencies. Thanks to this decorator, DI collects metadata from class constructors, and therefore knows how many parameters each constructor has, and what types of these parameters.")),(0,a.kt)("p",null,"If the last two conditions are not met, you will receive approximately the following error:"),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"Cannot resolve all parameters for 'Service2'(?). Make sure that all the parameters are decorated with Inject or have valid type annotations and that 'Service2' is decorated with Injectable.")),(0,a.kt)("h2",{id:"when-di-creates-instances"},"When DI creates instances"),(0,a.kt)("p",null,"Let's take a closer look at the injectors mentioned above. From the previous example it is clear that the injector contains an array of classes transferred to it and it knows how to make their instances. But here are a few more important unobvious points. Let's change a little example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import 'reflect-metadata';\nimport { ReflectiveInjector, Injectable } from '@ts-stack/di';\n\nclass Service1 {}\n\nclass Service2 {}\n\n@Injectable()\nclass Service3 {\n  constructor(service2: Service2) {}\n}\n\nconst injector = ReflectiveInjector.resolveAndCreate([Service1, Service2, Service3]);\nconst service3 = injector.get(Service3);\n\nservice3 === injector.get(Service3); // true\n")),(0,a.kt)("p",null,"Now ",(0,a.kt)("inlineCode",{parentName:"p"},"Service2")," is not dependent on ",(0,a.kt)("inlineCode",{parentName:"p"},"Service1"),", and when creating an instance of ",(0,a.kt)("inlineCode",{parentName:"p"},"Service3"),", the injector will also create an instance of class ",(0,a.kt)("inlineCode",{parentName:"p"},"Service2"),", but will not create an instance of class ",(0,a.kt)("inlineCode",{parentName:"p"},"Service1"),", because it has not been requested and does not depend on it other classes. On the other hand, all already created instances will be stored in the injector itself and returned upon repeated requests. That is, a specific injector creates an instance of a specific class using ",(0,a.kt)("inlineCode",{parentName:"p"},"injector.get()")," only once, but only after that instance is requested."),(0,a.kt)("p",null,"It turns out that if you need to make instances of certain classes more often using ",(0,a.kt)("inlineCode",{parentName:"p"},"injector.get()"),", you need to create new injectors:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { ReflectiveInjector } from '@ts-stack/di';\n\nclass Service1 {}\n\nclass Service2 {}\n\nconst services = [Service1, Service2];\n\nconst injector1 = ReflectiveInjector.resolveAndCreate(services);\nconst injector2 = ReflectiveInjector.resolveAndCreate(services);\n\ninjector1.get(Service2) === injector2.get(Service2); // false\n")),(0,a.kt)("p",null,"There is another way to get a new instance of a certain class each time:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"//..\n\ninjector1.resolveAndInstantiate(Service2) === injector1.resolveAndInstantiate(Service2); // false\n")),(0,a.kt)("h2",{id:"hierarchy-of-injectors"},"Hierarchy of injectors"),(0,a.kt)("p",null,"The ",(0,a.kt)("inlineCode",{parentName:"p"},"@ts-stack/di")," library also allows you to create a hierarchy of injectors - this is when there are parent and child injectors. At first glance, there is nothing interesting in such a hierarchy, because it is not clear why it is needed, but in practice this feature is used very often, because it allows you to make the application architecture modular. Special attention should be paid to the study of the specifics of the hierarchy, it will save you a lot of time in the future, because you will know how it works and why it does not find this dependence..."),(0,a.kt)("p",null,"When creating a hierarchy, the connection is held only by the child injector, it has the object of the parent injector. At the same time, the parent injector knows nothing about its child injectors. That is, the connection between the injectors is one-way. Conventionally, it looks like this:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"interface Parent {\n  // There are certain properties of the parent injector, but no child injector\n}\n\ninterface Child {\n  parent: Parent;\n  // There are other properties of the child injector.\n}\n")),(0,a.kt)("p",null,"Due to the presence of the parent injector object, the child injector may contact the parent injector when asked for an instance of a class that it does not have."),(0,a.kt)("p",null,"Let's consider the following example. For simplicity, decorators are not used here at all, as each class is independent:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { ReflectiveInjector } from '@ts-stack/di';\n\nclass Service1 {}\nclass Service2 {}\nclass Service3 {}\nclass Service4 {}\n\nconst parent = ReflectiveInjector.resolveAndCreate([Service1, Service2]); // Parent injector\nconst child = parent.resolveAndCreateChild([Service2, Service3]); // Child injector\n\nchild.get(Service1); // \u041e\u041a\nparent.get(Service1); // \u041e\u041a\n\nparent.get(Service1) === child.get(Service1); // true\n\nchild.get(Service2); // \u041e\u041a\nparent.get(Service2); // \u041e\u041a\n\nparent.get(Service2) === child.get(Service2); // false\n\nchild.get(Service3); // \u041e\u041a\nparent.get(Service3); // Error - No provider for Service3!\n\nchild.get(Service4); // Error - No provider for Service4!\nparent.get(Service4); // Error - No provider for Service4!\n")),(0,a.kt)("p",null,"As you can see, when creating a child injector, it was not given ",(0,a.kt)("inlineCode",{parentName:"p"},"Service1"),", so when you request an instance of this class, it will contact its parent. By the way, there is one unobvious but very important point here: although the child injectors ask the parent injectors for certain instances of the classes, they do not create them on their own. That is why this expression returns ",(0,a.kt)("inlineCode",{parentName:"p"},"true"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"parent.get(Service1) === child.get(Service1); // true\n")),(0,a.kt)("p",null,"And ",(0,a.kt)("inlineCode",{parentName:"p"},"Service2")," has both injectors, so each of them will create its own local version, and that's why this expression returns ",(0,a.kt)("inlineCode",{parentName:"p"},"false"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"parent.get(Service2) === child.get(Service2); // false\n")),(0,a.kt)("p",null,"The parent injector cannot create an instance of the ",(0,a.kt)("inlineCode",{parentName:"p"},"Service3")," class because the parent injector has no connection to the child injector that has ",(0,a.kt)("inlineCode",{parentName:"p"},"Service3"),"."),(0,a.kt)("p",null,"Well, both injectors can't create a ",(0,a.kt)("inlineCode",{parentName:"p"},"Service4")," instance because they weren't given this class when they were created."),(0,a.kt)("h2",{id:"di-tokens-providers-and-substitution-providers"},"DI tokens, providers and substitution providers"),(0,a.kt)("p",null,"When you query another class in the class constructor, the DI actually remembers that other class as a ",(0,a.kt)("strong",{parentName:"p"},"token")," to find the desired value in the injector array. That is, the token is the identifier used to search iside an injector."),(0,a.kt)("p",null,"Not only classes but also objects can be transferred to the injector array:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const injector = ReflectiveInjector.resolveAndCreate([{ provide: Service1, useClass: Service2 }]);\n\nconst service = injector.get(Service1); // instance of Service2\n")),(0,a.kt)("p",null,'So we write instructions for DI: "When the injector is asked for a token ',(0,a.kt)("inlineCode",{parentName:"p"},"Service1"),", actually need to return an instance of class ",(0,a.kt)("inlineCode",{parentName:"p"},"Service2"),'". This instruction essentially replaces the so-called "provider".'),(0,a.kt)("p",null,"The term ",(0,a.kt)("strong",{parentName:"p"},"provider")," in ",(0,a.kt)("inlineCode",{parentName:"p"},"@ts-stack/di")," means either a class or an object with the following possible properties:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-text"},"{ provide: <token>, useClass: <class> },\n{ provide: <token>, useValue: <any value> },\n{ provide: <token>, useFactory: <function>, deps: [<providers of dependencies>] },\n{ provide: <token>, useExisting: <another token> },\n")),(0,a.kt)("p",null,"Every provider has a token, but not every token can be a provider. In fact, only a class can act as both a provider and a token. For example, a string can only be used as a token, not as a provider. Token types are described in more detail in the ",(0,a.kt)("a",{parentName:"p",href:"#types-of-di-tokens"},"next section"),"."),(0,a.kt)("p",null,"There is also the concept of multi-providers, but they will be mentioned ",(0,a.kt)("a",{parentName:"p",href:"#multi-providers"},"later"),"."),(0,a.kt)("h3",{id:"useexisting"},"useExisting"),(0,a.kt)("p",null,"As shown in the previous example, to specify a provider, you can use an object with the ",(0,a.kt)("inlineCode",{parentName:"p"},"useExisting")," property. Note that in this case you are not passing the provider itself, but only ",(0,a.kt)("strong",{parentName:"p"},"pointing")," to its token. Example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"[\n  { provide: Class2, useExisting: Class1 },\n  // ...\n]\n")),(0,a.kt)("p",null,"Here, the token ",(0,a.kt)("inlineCode",{parentName:"p"},"Class2")," points to another token ",(0,a.kt)("inlineCode",{parentName:"p"},"Class1"),'. For the DI injector, this instruction says: "To find the value for the token ',(0,a.kt)("inlineCode",{parentName:"p"},"Class2"),", need to search for the provider by the token ",(0,a.kt)("inlineCode",{parentName:"p"},"Class1"),'."'),(0,a.kt)("admonition",{title:"When is it needed?",type:"tip"},(0,a.kt)("p",{parentName:"admonition"},"This option is useful when you have a base class and an extended class, and you want to use the base class as a token for DI, and an instance of the extended class as the value for that token. However, you want to use the base class interface in some cases and the extended class interface in others.")),(0,a.kt)("p",null,"An example from real life. Let's say your framework uses a basic logger that accepts a basic configuration via DI:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"class BaseLoggerConfig {\n  level: string;\n}\n")),(0,a.kt)("p",null,"You want to extend this configuration to work for both the basic and extended loggers:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"class ExtendedLoggerConfig extends BaseLoggerConfig {\n  displayFilePath: string;\n  displayFunctionName: boolean;\n}\n")),(0,a.kt)("p",null,"However, you want to use the basic configuration interface in the basic logger, and the extended configuration interface in the extended one:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"// Somewhere in your framework code\nclass BaseLogger {\n  constructor(private loggerConfig: BaseLoggerConfig) {}\n}\n\n//...\n\n// Somewhere in your application code\nclass ExtendedLogger extends BaseLogger {\n  constructor(private extendedLoggerConfig: ExtendedLoggerConfig) {\n    super(extendedLoggerConfig);\n    // ...\n  }\n}\n")),(0,a.kt)("p",null,"To avoid passing two different configurations to DI, you can use ",(0,a.kt)("inlineCode",{parentName:"p"},"useExisting"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"[\n  { provide: BaseLoggerConfig, useValue: new ExtendedLoggerConfig() },\n  { provide: ExtendedLoggerConfig, useExisting: BaseLoggerConfig },\n]\n")),(0,a.kt)("p",null,"This way you pass two instructions to DI:"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"the first element in the array transfers the value for the ",(0,a.kt)("inlineCode",{parentName:"li"},"BaseLoggerConfig")," token;"),(0,a.kt)("li",{parentName:"ol"},"the second element in the array indicates that the value of the ",(0,a.kt)("inlineCode",{parentName:"li"},"ExtendedLoggerConfig")," token should be searched for by the ",(0,a.kt)("inlineCode",{parentName:"li"},"BaseLoggerConfig")," token (that is, it actually points to the first element of the array).")),(0,a.kt)("p",null,"In this case, both the basic and the extended logger will receive the same extended configuration, which will be compatible with the basic configuration."),(0,a.kt)("h2",{id:"multiple-addition-of-providers-with-the-same-token"},"Multiple addition of providers with the same token"),(0,a.kt)("p",null,"You can pass many providers to the injector array for the same token, but DI will choose the last provider:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { ReflectiveInjector } from '@ts-stack/di';\n\nclass Service1 {}\nclass Service2 {}\nclass Service3 {}\n\nconst injector = ReflectiveInjector.resolveAndCreate([\n  Service1,\n  { provide: Service1, useClass: Service2 },\n  { provide: Service1, useClass: Service3 },\n]);\n\ninjector.get(Service1); // instance of Service3\n")),(0,a.kt)("p",null,"Here, three providers are transferred to the injector for the ",(0,a.kt)("inlineCode",{parentName:"p"},"Service1")," token, but DI will choose the last one, so an instance of the ",(0,a.kt)("inlineCode",{parentName:"p"},"Service3")," class will be created."),(0,a.kt)("p",null,"In practice, thanks to this mechanism, developers of frameworks can transfer default providers to the injector, and users of these frameworks can substitute them with their own providers. This mechanism also simplifies application testing, as some providers can be transmitted in the application itself and others in tests."),(0,a.kt)("h2",{id:"types-of-di-tokens"},"Types of DI tokens"),(0,a.kt)("p",null,"The token type can be either a class, or an object, or text, or ",(0,a.kt)("inlineCode",{parentName:"p"},"symbol"),". Interfaces or types declared with the ",(0,a.kt)("inlineCode",{parentName:"p"},"type")," keyword cannot be used as tokens, because once they are compiled from TypeScript into JavaScript, nothing will be left of them in JavaScript files. Also, you can't use arrays as a token, because TypeScript doesn't have a mechanism to pass an array type to compiled JavaScript code."),(0,a.kt)("p",null,"However, in the constructor as a token it is easiest to specify the class, otherwise, you must use the decorator ",(0,a.kt)("inlineCode",{parentName:"p"},"Inject"),". For example, you can use string ",(0,a.kt)("inlineCode",{parentName:"p"},"tokenForLocal")," as a token:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { Injectable, Inject, ReflectiveInjector } from '@ts-stack/di';\n\n@Injectable()\nexport class Service1 {\n  constructor(@Inject('tokenForLocal') local: string) {}\n}\n\nconst injector = ReflectiveInjector.resolveAndCreate([{ provide: 'tokenForLocal', useValue: 'uk' }]);\n\ninjector.get(Service1); // OK\n")),(0,a.kt)("h3",{id:"injectiontoken"},"InjectionToken"),(0,a.kt)("p",null,"In addition to the ability to use tokens that have different types of data, DI has a special class recommended for creating tokens - ",(0,a.kt)("inlineCode",{parentName:"p"},"InjectionToken"),". Because it has a parameter for the type (it's generic), you can read the data type that will return the DI when requesting a specific token:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { InjectionToken } from '@ts-stack/di';\n\nexport const LOCAL = new InjectionToken<string>('tokenForLocal');\n")),(0,a.kt)("p",null,"It can be used in the same way as all other tokens that are not classes:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { Injectable, Inject, ReflectiveInjector } from '@ts-stack/di';\n\nimport { LOCAL } from './tokens';\n\n@Injectable()\nexport class Service1 {\n  constructor(@Inject(LOCAL) local: string) {}\n}\n\nconst injector = ReflectiveInjector.resolveAndCreate([{ provide: LOCAL, useValue: 'uk' }]);\n\ninjector.get(Service1); // \u041e\u041a\n")),(0,a.kt)("p",null,"Of course, it is recommended to use the ",(0,a.kt)("inlineCode",{parentName:"p"},"InjectionToken")," only if you cannot use a certain class directly as a token."),(0,a.kt)("h2",{id:"multi-providers"},"Multi providers"),(0,a.kt)("p",null,"This type of providers differs from regular DI providers by the presence of the ",(0,a.kt)("inlineCode",{parentName:"p"},"multi: true")," property. Such providers are advisable to use when there is a need to transfer several providers with the same token to DI at once, so that DI returns the same number of values for these providers in one array:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { ReflectiveInjector } from '@ts-stack/di';\n\nimport { LOCAL } from './tokens';\n\nconst injector = ReflectiveInjector.resolveAndCreate([\n  { provide: LOCAL, useValue: 'uk', multi: true },\n  { provide: LOCAL, useValue: 'en', multi: true },\n]);\n\nconst locals = injector.get(LOCAL); // ['uk', 'en']\n")),(0,a.kt)("p",null,"It is not allowed that both regular and multi providers have the same token in one injector:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { ReflectiveInjector } from '@ts-stack/di';\n\nimport { LOCAL } from './tokens';\n\nconst injector = ReflectiveInjector.resolveAndCreate([\n  { provide: LOCAL, useValue: 'uk' },\n  { provide: LOCAL, useValue: 'en', multi: true },\n]);\n\nconst locals = injector.get(LOCAL); // Error: Cannot mix multi providers and regular providers\n")),(0,a.kt)("p",null,"Child injectors may return multi providers of the parent injector only if they did not receive providers with the same tokens when creating child injectors:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { ReflectiveInjector } from '@ts-stack/di';\n\nimport { LOCAL } from './tokens';\n\nconst parent = ReflectiveInjector.resolveAndCreate([\n  { provide: LOCAL, useValue: 'uk', multi: true },\n  { provide: LOCAL, useValue: 'en', multi: true },\n]);\n\nconst child = parent.resolveAndCreateChild([]);\n\nconst locals = child.get(LOCAL); // ['uk', 'en']\n")),(0,a.kt)("p",null,"If both the child injector and the parent injector have multi providers with the same token, the child injector will return values only from its array:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { ReflectiveInjector } from '@ts-stack/di';\n\nimport { LOCAL } from './tokens';\n\nconst parent = ReflectiveInjector.resolveAndCreate([\n  { provide: LOCAL, useValue: 'uk', multi: true },\n  { provide: LOCAL, useValue: 'en', multi: true },\n]);\n\nconst child = parent.resolveAndCreateChild([\n  { provide: LOCAL, useValue: '\u0430\u0430', multi: true }\n]);\n\nconst locals = child.get(LOCAL); // ['\u0430\u0430']\n")),(0,a.kt)("h3",{id:"substituting-multiproviders"},"Substituting multiproviders"),(0,a.kt)("p",null,"To make it possible to substituting a specific multiprovider, you can do the following:"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"first pass the multiprovider and use the ",(0,a.kt)("inlineCode",{parentName:"li"},"useExisting")," property;"),(0,a.kt)("li",{parentName:"ol"},"then transfer the class you want to substituting;"),(0,a.kt)("li",{parentName:"ol"},"and at the end of the array, pass the class that substituting the class you need.")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { ReflectiveInjector } from '@ts-stack/di';\n\nimport { HTTP_INTERCEPTORS } from './constants';\nimport { DefaultInterceptor } from './default.interceptor';\nimport { MyInterceptor } from './my.interceptor';\n\nconst injector = ReflectiveInjector.resolveAndCreate([\n  { provide: HTTP_INTERCEPTORS, useExisting: DefaultInterceptor, multi: true },\n  DefaultInterceptor,\n  { provide: DefaultInterceptor, useClass: MyInterceptor }\n]);\n\nconst locals = injector.get(HTTP_INTERCEPTORS); // [MyInterceptor]\n")),(0,a.kt)("p",null,"This construction makes sense, for example, if the first two points are performed somewhere in an external module to which you do not have access to edit, and the third point is performed by the user of this module."))}d.isMDXComponent=!0}}]);