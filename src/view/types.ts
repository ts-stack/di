/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector} from '../di';
import {ErrorHandler} from '../error_handler';
import {Type} from '../type';

// -------------------------------------
// Defs
// -------------------------------------

/**
 * Factory for ViewDefinitions/NgModuleDefinitions.
 * We use a function so we can reexeute it in case an error happens and use the given logger
 * function to log the error from the definition of the node, which is shown in all browser
 * logs.
 */
export interface DefinitionFactory<D extends Definition<any>> { (logger: NodeLogger): D; }

/**
 * Function to call console.error at the right source location. This is an indirection
 * via another function as browser will log the location that actually called
 * `console.error`.
 */
export interface NodeLogger { (): () => void; }

export interface Definition<DF extends DefinitionFactory<any>> { factory: DF|null; }

export interface NgModuleDefinition extends Definition<NgModuleDefinitionFactory> {
  providers: NgModuleProviderDef[];
  providersByKey: {[tokenKey: string]: NgModuleProviderDef};
}

export interface NgModuleDefinitionFactory extends DefinitionFactory<NgModuleDefinition> {}

export const enum ArgumentType {Inline, Dynamic}
/**
 * Bitmask for ViewDefinition.flags.
 */
export const enum ViewFlags {
  None = 0,
  OnPush = 1 << 1,
}

/**
 * Bitmask for NodeDef.flags.
 * Naming convention:
 * - `Type...`: flags that are mutually exclusive
 * - `Cat...`: union of multiple `Type...` (short for category).
 */
export const enum NodeFlags {
  None = 0,
  TypeElement = 1 << 0,
  TypeText = 1 << 1,
  ProjectedTemplate = 1 << 2,
  CatRenderNode = TypeElement | TypeText,
  TypeNgContent = 1 << 3,
  TypePipe = 1 << 4,
  TypePureArray = 1 << 5,
  TypePureObject = 1 << 6,
  TypePurePipe = 1 << 7,
  CatPureExpression = TypePureArray | TypePureObject | TypePurePipe,
  TypeValueProvider = 1 << 8,
  TypeClassProvider = 1 << 9,
  TypeFactoryProvider = 1 << 10,
  TypeUseExistingProvider = 1 << 11,
  LazyProvider = 1 << 12,
  PrivateProvider = 1 << 13,
  TypeDirective = 1 << 14,
  Component = 1 << 15,
  CatProviderNoDirective =
      TypeValueProvider | TypeClassProvider | TypeFactoryProvider | TypeUseExistingProvider,
  CatProvider = CatProviderNoDirective | TypeDirective,
  OnInit = 1 << 16,
  OnDestroy = 1 << 17,
  DoCheck = 1 << 18,
  OnChanges = 1 << 19,
  AfterContentInit = 1 << 20,
  AfterContentChecked = 1 << 21,
  AfterViewInit = 1 << 22,
  AfterViewChecked = 1 << 23,
  EmbeddedViews = 1 << 24,
  ComponentView = 1 << 25,
  TypeContentQuery = 1 << 26,
  TypeViewQuery = 1 << 27,
  StaticQuery = 1 << 28,
  DynamicQuery = 1 << 29,
  CatQuery = TypeContentQuery | TypeViewQuery,

  // mutually exclusive values...
  Types = CatRenderNode | TypeNgContent | TypePipe | CatPureExpression | CatProvider | CatQuery
}

export const enum BindingFlags {
  TypeElementAttribute = 1 << 0,
  TypeElementClass = 1 << 1,
  TypeElementStyle = 1 << 2,
  TypeProperty = 1 << 3,
  SyntheticProperty = 1 << 4,
  SyntheticHostProperty = 1 << 5,
  CatSyntheticProperty = SyntheticProperty | SyntheticHostProperty,

  // mutually exclusive values...
  Types = TypeElementAttribute | TypeElementClass | TypeElementStyle | TypeProperty
}

export interface OutputDef {
  type: OutputType;
  target: 'window'|'document'|'body'|'component'|null;
  eventName: string;
  propName: string|null;
}

export const enum OutputType {ElementOutput, DirectiveOutput}

export const enum QueryValueType {
  ElementRef,
  RenderElement,
  TemplateRef,
  ViewContainerRef,
  Provider
}

export interface ProviderDef {
  token: any;
  value: any;
  deps: DepDef[];
}

export interface NgModuleProviderDef {
  flags: NodeFlags;
  index: number;
  token: any;
  value: any;
  deps: DepDef[];
}

export interface DepDef {
  flags: DepFlags;
  token: any;
  tokenKey: string;
}

/**
 * Bitmask for DI flags
 */
export const enum DepFlags {
  None = 0,
  SkipSelf = 1 << 0,
  Optional = 1 << 1,
  Value = 2 << 2,
}

export interface TextDef { prefix: string; }

export interface QueryDef {
  id: number;
  // variant of the id that can be used to check against NodeDef.matchedQueryIds, ...
  filterId: number;
  bindings: QueryBindingDef[];
}

export interface QueryBindingDef {
  propName: string;
  bindingType: QueryBindingType;
}

export const enum QueryBindingType {First, All}

export interface NgContentDef {
  /**
   * this index is checked against NodeDef.ngContentIndex to find the nodes
   * that are matched by this ng-content.
   * Note that a NodeDef with an ng-content can be reprojected, i.e.
   * have a ngContentIndex on its own.
   */
  index: number;
}

/**
 * Bitmask of states
 */
export const enum ViewState {
  BeforeFirstCheck = 1 << 0,
  FirstCheck = 1 << 1,
  Attached = 1 << 2,
  ChecksEnabled = 1 << 3,
  IsProjectedView = 1 << 4,
  CheckProjectedView = 1 << 5,
  CheckProjectedViews = 1 << 6,
  Destroyed = 1 << 7,

  CatDetectChanges = Attached | ChecksEnabled,
  CatInit = BeforeFirstCheck | CatDetectChanges
}

export interface DisposableFn { (): void; }

/**
 * Node instance data.
 *
 * We have a separate type per NodeType to save memory
 * (TextData | ElementData | ProviderData | PureExpressionData | QueryList<any>)
 *
 * To keep our code monomorphic,
 * we prohibit using `NodeData` directly but enforce the use of accessors (`asElementData`, ...).
 * This way, no usage site can get a `NodeData` from view.nodes and then use it for different
 * purposes.
 */
export class NodeData { private __brand: any; }

/**
 * Data for an instantiated NodeType.Text.
 *
 * Attention: Adding fields to this is performance sensitive!
 */
export interface TextData { renderText: any; }

/**
 * Data for an instantiated NodeType.Provider.
 *
 * Attention: Adding fields to this is performance sensitive!
 */
export interface ProviderData { instance: any; }
/**
 * Data for an instantiated NodeType.PureExpression.
 *
 * Attention: Adding fields to this is performance sensitive!
 */
export interface PureExpressionData { value: any; }

// -------------------------------------
// Other
// -------------------------------------

export const enum CheckType {CheckAndUpdate, CheckNoChanges}

export interface ProviderOverride {
  token: any;
  flags: NodeFlags;
  value: any;
  deps: ([DepFlags, any]|any)[];
  deprecatedBehavior: boolean;
}
