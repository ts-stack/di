/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DepFlags, NgModuleDefinition, NgModuleProviderDef, NodeFlags} from './types';
import {splitDepsDsl, tokenKey} from './util';

export function moduleProvideDef(
    flags: NodeFlags, token: any, value: any,
    deps: ([DepFlags, any] | any)[]): NgModuleProviderDef {
  const depDefs = splitDepsDsl(deps);
  return {
    // will bet set by the module definition
    index: -1,
    deps: depDefs, flags, token, value
  };
}

export function moduleDef(providers: NgModuleProviderDef[]): NgModuleDefinition {
  const providersByKey: {[key: string]: NgModuleProviderDef} = {};
  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i];
    provider.index = i;
    providersByKey[tokenKey(provider.token)] = provider;
  }
  return {
    // Will be filled later...
    factory: null,
    providersByKey,
    providers
  };
}
