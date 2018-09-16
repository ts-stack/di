/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector} from '../di/injector';
import {DepFlags, NodeDef, NodeFlags, Services, ViewData, asElementData, asProviderData, asTextData} from './types';
import {tokenKey} from './util';

export function createInjector(view: ViewData, elDef: NodeDef): Injector {
  return new Injector_(view, elDef);
}

class Injector_ implements Injector {
  constructor(private view: ViewData, private elDef: NodeDef|null) {}
  get(token: any, notFoundValue: any = Injector.THROW_IF_NOT_FOUND): any {
    const allowPrivateServices =
        this.elDef ? (this.elDef.flags & NodeFlags.ComponentView) !== 0 : false;
    return Services.resolveDep(
        this.view, this.elDef, allowPrivateServices,
        {flags: DepFlags.None, token, tokenKey: tokenKey(token)}, notFoundValue);
  }
}

export function nodeValue(view: ViewData, index: number): any {
  const def = view.def.nodes[index];
  if (def.flags & NodeFlags.TypeElement) {
    const elData = asElementData(view, def.nodeIndex);
    return def.element !.template ? elData.template : elData.renderElement;
  } else if (def.flags & NodeFlags.TypeText) {
    return asTextData(view, def.nodeIndex).renderText;
  } else if (def.flags & (NodeFlags.CatProvider | NodeFlags.TypePipe)) {
    return asProviderData(view, def.nodeIndex).instance;
  }
  throw new Error(`Illegal state: read nodeValue for node index ${index}`);
}
