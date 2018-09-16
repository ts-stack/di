/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ArgumentType, NodeDef, NodeFlags, ViewData, ViewDefinition, ViewFlags, ViewHandleEventFn, ViewUpdateFn} from './types';
import {NOOP, checkBindingNoChanges, tokenKey} from './util';

export function viewDef(
    flags: ViewFlags, nodes: NodeDef[], updateDirectives?: null | ViewUpdateFn,
    updateRenderer?: null | ViewUpdateFn): ViewDefinition {
  // clone nodes and set auto calculated values
  let viewBindingCount = 0;
  let viewDisposableCount = 0;
  let viewNodeFlags = 0;
  let viewRootNodeFlags = 0;
  let viewMatchedQueries = 0;
  let currentParent: NodeDef|null = null;
  let currentRenderParent: NodeDef|null = null;
  let currentElementHasPublicProviders = false;
  let currentElementHasPrivateProviders = false;
  let lastRenderRootNode: NodeDef|null = null;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.nodeIndex = i;
    node.parent = currentParent;
    node.bindingIndex = viewBindingCount;
    node.outputIndex = viewDisposableCount;
    node.renderParent = currentRenderParent;

    viewNodeFlags |= node.flags;
    viewMatchedQueries |= node.matchedQueryIds;

    if (node.element) {
      const elDef = node.element;
      elDef.publicProviders =
          currentParent ? currentParent.element !.publicProviders : Object.create(null);
      elDef.allProviders = elDef.publicProviders;
      // Note: We assume that all providers of an element are before any child element!
      currentElementHasPublicProviders = false;
      currentElementHasPrivateProviders = false;

      if (node.element.template) {
        viewMatchedQueries |= node.element.template.nodeMatchedQueries;
      }
    }
    validateNode(currentParent, node, nodes.length);


    viewBindingCount += node.bindings.length;
    viewDisposableCount += node.outputs.length;

    if (!currentRenderParent && (node.flags & NodeFlags.CatRenderNode)) {
      lastRenderRootNode = node;
    }

    if (node.flags & NodeFlags.CatProvider) {
      if (!currentElementHasPublicProviders) {
        currentElementHasPublicProviders = true;
        // Use prototypical inheritance to not get O(n^2) complexity...
        currentParent !.element !.publicProviders =
            Object.create(currentParent !.element !.publicProviders);
        currentParent !.element !.allProviders = currentParent !.element !.publicProviders;
      }
      const isPrivateService = (node.flags & NodeFlags.PrivateProvider) !== 0;
      const isComponent = (node.flags & NodeFlags.Component) !== 0;
      if (!isPrivateService || isComponent) {
        currentParent !.element !.publicProviders ![tokenKey(node.provider !.token)] = node;
      } else {
        if (!currentElementHasPrivateProviders) {
          currentElementHasPrivateProviders = true;
          // Use prototypical inheritance to not get O(n^2) complexity...
          currentParent !.element !.allProviders =
              Object.create(currentParent !.element !.publicProviders);
        }
        currentParent !.element !.allProviders ![tokenKey(node.provider !.token)] = node;
      }
      if (isComponent) {
        currentParent !.element !.componentProvider = node;
      }
    }

    if (currentParent) {
      currentParent.childFlags |= node.flags;
      currentParent.directChildFlags |= node.flags;
      currentParent.childMatchedQueries |= node.matchedQueryIds;
      if (node.element && node.element.template) {
        currentParent.childMatchedQueries |= node.element.template.nodeMatchedQueries;
      }
    } else {
      viewRootNodeFlags |= node.flags;
    }

    if (node.childCount > 0) {
      currentParent = node;

      if (!isNgContainer(node)) {
        currentRenderParent = node;
      }
    } else {
      // When the current node has no children, check if it is the last children of its parent.
      // When it is, propagate the flags up.
      // The loop is required because an element could be the last transitive children of several
      // elements. We loop to either the root or the highest opened element (= with remaining
      // children)
      while (currentParent && i === currentParent.nodeIndex + currentParent.childCount) {
        const newParent: NodeDef|null = currentParent.parent;
        if (newParent) {
          newParent.childFlags |= currentParent.childFlags;
          newParent.childMatchedQueries |= currentParent.childMatchedQueries;
        }
        currentParent = newParent;
        // We also need to update the render parent & account for ng-container
        if (currentParent && isNgContainer(currentParent)) {
          currentRenderParent = currentParent.renderParent;
        } else {
          currentRenderParent = currentParent;
        }
      }
    }
  }

  const handleEvent: ViewHandleEventFn = (view, nodeIndex, eventName, event) =>
      nodes[nodeIndex].element !.handleEvent !(view, eventName, event);

  return {
    // Will be filled later...
    factory: null,
    nodeFlags: viewNodeFlags,
    rootNodeFlags: viewRootNodeFlags,
    nodeMatchedQueries: viewMatchedQueries, flags,
    nodes: nodes,
    updateDirectives: updateDirectives || NOOP,
    updateRenderer: updateRenderer || NOOP, handleEvent,
    bindingCount: viewBindingCount,
    outputCount: viewDisposableCount, lastRenderRootNode
  };
}

function isNgContainer(node: NodeDef): boolean {
  return (node.flags & NodeFlags.TypeElement) !== 0 && node.element !.name === null;
}

function validateNode(parent: NodeDef | null, node: NodeDef, nodeCount: number) {
  const template = node.element && node.element.template;
  if (template) {
    if (!template.lastRenderRootNode) {
      throw new Error(`Illegal State: Embedded templates without nodes are not allowed!`);
    }
    if (template.lastRenderRootNode &&
        template.lastRenderRootNode.flags & NodeFlags.EmbeddedViews) {
      throw new Error(
          `Illegal State: Last root node of a template can't have embedded views, at index ${node.nodeIndex}!`);
    }
  }
  if (node.flags & NodeFlags.CatProvider) {
    const parentFlags = parent ? parent.flags : 0;
    if ((parentFlags & NodeFlags.TypeElement) === 0) {
      throw new Error(
          `Illegal State: StaticProvider/Directive nodes need to be children of elements or anchors, at index ${node.nodeIndex}!`);
    }
  }
  if (node.query) {
    if (node.flags & NodeFlags.TypeContentQuery &&
        (!parent || (parent.flags & NodeFlags.TypeDirective) === 0)) {
      throw new Error(
          `Illegal State: Content Query nodes need to be children of directives, at index ${node.nodeIndex}!`);
    }
    if (node.flags & NodeFlags.TypeViewQuery && parent) {
      throw new Error(
          `Illegal State: View Query nodes have to be top level nodes, at index ${node.nodeIndex}!`);
    }
  }
  if (node.childCount) {
    const parentEnd = parent ? parent.nodeIndex + parent.childCount : nodeCount - 1;
    if (node.nodeIndex <= parentEnd && node.nodeIndex + node.childCount > parentEnd) {
      throw new Error(
          `Illegal State: childCount of node leads outside of parent, at index ${node.nodeIndex}!`);
    }
  }
}

export function checkNoChangesNode(
    view: ViewData, nodeDef: NodeDef, argStyle: ArgumentType, v0?: any, v1?: any, v2?: any,
    v3?: any, v4?: any, v5?: any, v6?: any, v7?: any, v8?: any, v9?: any): any {
  if (argStyle === ArgumentType.Inline) {
    checkNoChangesNodeInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
  } else {
    checkNoChangesNodeDynamic(view, nodeDef, v0);
  }
  // Returning false is ok here as we would have thrown in case of a change.
  return false;
}

function checkNoChangesNodeInline(
    view: ViewData, nodeDef: NodeDef, v0: any, v1: any, v2: any, v3: any, v4: any, v5: any, v6: any,
    v7: any, v8: any, v9: any): void {
  const bindLen = nodeDef.bindings.length;
  if (bindLen > 0) checkBindingNoChanges(view, nodeDef, 0, v0);
  if (bindLen > 1) checkBindingNoChanges(view, nodeDef, 1, v1);
  if (bindLen > 2) checkBindingNoChanges(view, nodeDef, 2, v2);
  if (bindLen > 3) checkBindingNoChanges(view, nodeDef, 3, v3);
  if (bindLen > 4) checkBindingNoChanges(view, nodeDef, 4, v4);
  if (bindLen > 5) checkBindingNoChanges(view, nodeDef, 5, v5);
  if (bindLen > 6) checkBindingNoChanges(view, nodeDef, 6, v6);
  if (bindLen > 7) checkBindingNoChanges(view, nodeDef, 7, v7);
  if (bindLen > 8) checkBindingNoChanges(view, nodeDef, 8, v8);
  if (bindLen > 9) checkBindingNoChanges(view, nodeDef, 9, v9);
}

function checkNoChangesNodeDynamic(view: ViewData, nodeDef: NodeDef, values: any[]): void {
  for (let i = 0; i < values.length; i++) {
    checkBindingNoChanges(view, nodeDef, i, values[i]);
  }
}
