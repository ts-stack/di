/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ElementData, ElementHandleEventFn, NodeDef, NodeFlags, QueryValueType, ViewData, ViewDefinitionFactory} from './types';
import {NOOP, dispatchEvent, elementEventFullName, getParentRenderElement, resolveDefinition, splitMatchedQueriesDsl} from './util';

export function anchorDef(
    flags: NodeFlags, matchedQueriesDsl: null | [string | number, QueryValueType][],
    ngContentIndex: null | number, childCount: number, handleEvent?: null | ElementHandleEventFn,
    templateFactory?: ViewDefinitionFactory): NodeDef {
  flags |= NodeFlags.TypeElement;
  const {matchedQueries, references, matchedQueryIds} = splitMatchedQueriesDsl(matchedQueriesDsl);
  const template = templateFactory ? resolveDefinition(templateFactory) : null;

  return {
    // will bet set by the view definition
    nodeIndex: -1,
    parent: null,
    renderParent: null,
    bindingIndex: -1,
    outputIndex: -1,
    // regular values
    flags,
    checkIndex: -1,
    childFlags: 0,
    directChildFlags: 0,
    childMatchedQueries: 0, matchedQueries, matchedQueryIds, references, ngContentIndex, childCount,
    bindings: [],
    bindingFlags: 0,
    outputs: [],
    element: {
      ns: null,
      name: null,
      attrs: null, template,
      componentProvider: null,
      componentView: null,
      componentRendererType: null,
      publicProviders: null,
      allProviders: null,
      handleEvent: handleEvent || NOOP
    },
    provider: null,
    text: null,
    query: null,
    ngContent: null
  };
}

export function createElement(view: ViewData, renderHost: any, def: NodeDef): ElementData {
  const elDef = def.element !;
  const rootSelectorOrNode = view.root.selectorOrNode;
  const renderer = view.renderer;
  let el: any;
  if (view.parent || !rootSelectorOrNode) {
    if (elDef.name) {
      el = renderer.createElement(elDef.name, elDef.ns);
    } else {
      el = renderer.createComment('');
    }
    const parentEl = getParentRenderElement(view, renderHost, def);
    if (parentEl) {
      renderer.appendChild(parentEl, el);
    }
  } else {
    el = renderer.selectRootElement(rootSelectorOrNode);
  }
  if (elDef.attrs) {
    for (let i = 0; i < elDef.attrs.length; i++) {
      const [ns, name, value] = elDef.attrs[i];
      renderer.setAttribute(el, name, value, ns);
    }
  }
  return el;
}

export function listenToElementOutputs(view: ViewData, compView: ViewData, def: NodeDef, el: any) {
  for (let i = 0; i < def.outputs.length; i++) {
    const output = def.outputs[i];
    const handleEventClosure = renderEventHandlerClosure(
        view, def.nodeIndex, elementEventFullName(output.target, output.eventName));
    let listenTarget: 'window'|'document'|'body'|'component'|null = output.target;
    let listenerView = view;
    if (output.target === 'component') {
      listenTarget = null;
      listenerView = compView;
    }
    const disposable =
        <any>listenerView.renderer.listen(listenTarget || el, output.eventName, handleEventClosure);
    view.disposables ![def.outputIndex + i] = disposable;
  }
}

function renderEventHandlerClosure(view: ViewData, index: number, eventName: string) {
  return (event: any) => {
    try {
      return dispatchEvent(view, index, eventName, event);
    } catch (e) {
      // Attention: Don't rethrow, to keep in sync with directive events.
      view.root.errorHandler.handleError(e);
    }
  };
}
