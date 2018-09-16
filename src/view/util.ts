/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {stringify} from '../util';

import {Definition, DefinitionFactory, DepDef, DepFlags, QueryValueType} from './types';

export const NOOP: any = () => {};

const _tokenKeyCache = new Map<any, string>();

export function tokenKey(token: any): string {
  let key = _tokenKeyCache.get(token);
  if (!key) {
    key = stringify(token) + '_' + _tokenKeyCache.size;
    _tokenKeyCache.set(token, key);
  }
  return key;
}

export function elementEventFullName(target: string | null, name: string): string {
  return target ? `${target}:${name}` : name;
}

export function filterQueryId(queryId: number): number {
  return 1 << (queryId % 32);
}

export function splitMatchedQueriesDsl(
    matchedQueriesDsl: [string | number, QueryValueType][] | null): {
  matchedQueries: {[queryId: string]: QueryValueType},
  references: {[refId: string]: QueryValueType},
  matchedQueryIds: number
} {
  const matchedQueries: {[queryId: string]: QueryValueType} = {};
  let matchedQueryIds = 0;
  const references: {[refId: string]: QueryValueType} = {};
  if (matchedQueriesDsl) {
    matchedQueriesDsl.forEach(([queryId, valueType]) => {
      if (typeof queryId === 'number') {
        matchedQueries[queryId] = valueType;
        matchedQueryIds |= filterQueryId(queryId);
      } else {
        references[queryId] = valueType;
      }
    });
  }
  return {matchedQueries, references, matchedQueryIds};
}

export function splitDepsDsl(deps: ([DepFlags, any] | any)[]): DepDef[] {
  return deps.map(value => {
    let token: any;
    let flags: DepFlags;
    if (Array.isArray(value)) {
      [flags, token] = value;
    } else {
      flags = DepFlags.None;
      token = value;
    }
    return {flags, token, tokenKey: tokenKey(token)};
  });
}

const DEFINITION_CACHE = new WeakMap<any, Definition<any>>();

export function resolveDefinition<D extends Definition<any>>(factory: DefinitionFactory<D>): D {
  let value = DEFINITION_CACHE.get(factory) !as D;
  if (!value) {
    value = factory(() => NOOP);
    value.factory = factory;
    DEFINITION_CACHE.set(factory, value);
  }
  return value;
}

export const enum RenderNodeAction {Collect, AppendChild, InsertBefore, RemoveChild}

const NS_PREFIX_RE = /^:([^:]+):(.+)$/;

export function splitNamespace(name: string): string[] {
  if (name[0] === ':') {
    const match = name.match(NS_PREFIX_RE) !;
    return [match[1], match[2]];
  }
  return ['', name];
}

export function interpolate(valueCount: number, constAndInterp: string[]): string {
  let result = '';
  for (let i = 0; i < valueCount * 2; i = i + 2) {
    result = result + constAndInterp[i] + _toStringWithNull(constAndInterp[i + 1]);
  }
  return result + constAndInterp[valueCount * 2];
}

export function inlineInterpolate(
    valueCount: number, c0: string, a1: any, c1: string, a2?: any, c2?: string, a3?: any,
    c3?: string, a4?: any, c4?: string, a5?: any, c5?: string, a6?: any, c6?: string, a7?: any,
    c7?: string, a8?: any, c8?: string, a9?: any, c9?: string): string {
  switch (valueCount) {
    case 1:
      return c0 + _toStringWithNull(a1) + c1;
    case 2:
      return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2;
    case 3:
      return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
          c3;
    case 4:
      return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
          c3 + _toStringWithNull(a4) + c4;
    case 5:
      return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
          c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5;
    case 6:
      return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
          c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6;
    case 7:
      return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
          c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) +
          c6 + _toStringWithNull(a7) + c7;
    case 8:
      return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
          c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) +
          c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8;
    case 9:
      return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
          c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) +
          c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8 + _toStringWithNull(a9) + c9;
    default:
      throw new Error(`Does not support more than 9 expressions`);
  }
}

function _toStringWithNull(v: any): string {
  return v != null ? v.toString() : '';
}

export const EMPTY_ARRAY: any[] = [];
export const EMPTY_MAP: {[key: string]: any} = {};
