/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector} from '../di';

import {isViewDebugError, viewWrappedDebugError} from './errors';
import {getQueryValue} from './query';
import {createInjector} from './refs';
import {DebugContext, ElementData, NodeDef, NodeFlags, NodeLogger, ViewData, ViewDefinition, asElementData} from './types';
import {NOOP, isComponentView, renderNode, viewParentEl} from './util';

enum DebugAction {
  create,
  detectChanges,
  checkNoChanges,
  destroy,
  handleEvent
}

let _currentAction: DebugAction;
let _currentView: ViewData;
let _currentNodeIndex: number|null;

class DebugContext_ implements DebugContext {
  private nodeDef: NodeDef;
  private elView: ViewData;
  private elDef: NodeDef;
  constructor(public view: ViewData, public nodeIndex: number|null) {
    if (nodeIndex == null) {
      this.nodeIndex = nodeIndex = 0;
    }
    this.nodeDef = view.def.nodes[nodeIndex];
    let elDef = this.nodeDef;
    let elView = view;
    while (elDef && (elDef.flags & NodeFlags.TypeElement) === 0) {
      elDef = elDef.parent !;
    }
    if (!elDef) {
      while (!elDef && elView) {
        elDef = viewParentEl(elView) !;
        elView = elView.parent !;
      }
    }
    this.elDef = elDef;
    this.elView = elView;
  }
  private get elOrCompView() {
    // Has to be done lazily as we use the DebugContext also during creation of elements...
    return asElementData(this.elView, this.elDef.nodeIndex).componentView || this.view;
  }
  get injector(): Injector { return createInjector(this.elView, this.elDef); }
  get component(): any { return this.elOrCompView.component; }
  get context(): any { return this.elOrCompView.context; }
  get providerTokens(): any[] {
    const tokens: any[] = [];
    if (this.elDef) {
      for (let i = this.elDef.nodeIndex + 1; i <= this.elDef.nodeIndex + this.elDef.childCount;
           i++) {
        const childDef = this.elView.def.nodes[i];
        if (childDef.flags & NodeFlags.CatProvider) {
          tokens.push(childDef.provider !.token);
        }
        i += childDef.childCount;
      }
    }
    return tokens;
  }
  get references(): {[key: string]: any} {
    const references: {[key: string]: any} = {};
    if (this.elDef) {
      collectReferences(this.elView, this.elDef, references);

      for (let i = this.elDef.nodeIndex + 1; i <= this.elDef.nodeIndex + this.elDef.childCount;
           i++) {
        const childDef = this.elView.def.nodes[i];
        if (childDef.flags & NodeFlags.CatProvider) {
          collectReferences(this.elView, childDef, references);
        }
        i += childDef.childCount;
      }
    }
    return references;
  }
  get componentRenderElement() {
    const elData = findHostElement(this.elOrCompView);
    return elData ? elData.renderElement : undefined;
  }
  get renderNode(): any {
    return this.nodeDef.flags & NodeFlags.TypeText ? renderNode(this.view, this.nodeDef) :
                                                     renderNode(this.elView, this.elDef);
  }
  logError(console: Console, ...values: any[]) {
    let logViewDef: ViewDefinition;
    let logNodeIndex: number;
    if (this.nodeDef.flags & NodeFlags.TypeText) {
      logViewDef = this.view.def;
      logNodeIndex = this.nodeDef.nodeIndex;
    } else {
      logViewDef = this.elView.def;
      logNodeIndex = this.elDef.nodeIndex;
    }
    // Note: we only generate a log function for text and element nodes
    // to make the generated code as small as possible.
    const renderNodeIndex = getRenderNodeIndex(logViewDef, logNodeIndex);
    let currRenderNodeIndex = -1;
    let nodeLogger: NodeLogger = () => {
      currRenderNodeIndex++;
      if (currRenderNodeIndex === renderNodeIndex) {
        return console.error.bind(console, ...values);
      } else {
        return NOOP;
      }
    };
    logViewDef.factory !(nodeLogger);
    if (currRenderNodeIndex < renderNodeIndex) {
      console.error('Illegal state: the ViewDefinitionFactory did not call the logger!');
      (<any>console.error)(...values);
    }
  }
}

function getRenderNodeIndex(viewDef: ViewDefinition, nodeIndex: number): number {
  let renderNodeIndex = -1;
  for (let i = 0; i <= nodeIndex; i++) {
    const nodeDef = viewDef.nodes[i];
    if (nodeDef.flags & NodeFlags.CatRenderNode) {
      renderNodeIndex++;
    }
  }
  return renderNodeIndex;
}

function findHostElement(view: ViewData): ElementData|null {
  while (view && !isComponentView(view)) {
    view = view.parent !;
  }
  if (view.parent) {
    return asElementData(view.parent, viewParentEl(view) !.nodeIndex);
  }
  return null;
}

function collectReferences(view: ViewData, nodeDef: NodeDef, references: {[key: string]: any}) {
  for (let refName in nodeDef.references) {
    references[refName] = getQueryValue(view, nodeDef, nodeDef.references[refName]);
  }
}

function callWithDebugContext(action: DebugAction, fn: any, self: any, args: any[]) {
  const oldAction = _currentAction;
  const oldView = _currentView;
  const oldNodeIndex = _currentNodeIndex;
  try {
    _currentAction = action;
    const result = fn.apply(self, args);
    _currentView = oldView;
    _currentNodeIndex = oldNodeIndex;
    _currentAction = oldAction;
    return result;
  } catch (e) {
    if (isViewDebugError(e) || !_currentView) {
      throw e;
    }
    throw viewWrappedDebugError(e, getCurrentDebugContext() !);
  }
}

export function getCurrentDebugContext(): DebugContext|null {
  return _currentView ? new DebugContext_(_currentView, _currentNodeIndex) : null;
}
