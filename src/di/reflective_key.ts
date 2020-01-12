/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

function fake() {
  /* unused function to prevent the license merging with comments */
}

import { stringify } from '../util';
import { resolveForwardRef } from './forward_ref';

/**
 * A unique object used for retrieving items from the `ReflectiveInjector`.
 *
 * Keys have:
 * - a system-wide unique `id`.
 * - a `token`.
 *
 * `Key` is used internally by `ReflectiveInjector` because its system-wide unique `id` allows
 * the
 * injector to store created objects in a more efficient way.
 *
 * `Key` should not be created directly. `ReflectiveInjector` creates keys automatically when
 * resolving
 * providers.
 */
export class ReflectiveKey {
  /**
   * Private
   */
  constructor(public token: Object, public id: number) {
    if (!token) {
      throw new Error('Token must be defined!');
    }
  }

  /**
   * Returns a stringified token.
   */
  get displayName(): string {
    return stringify(this.token);
  }

  /**
   * Retrieves a `Key` for a token.
   */
  static get(token: Object): ReflectiveKey {
    return _globalKeyRegistry.get(resolveForwardRef(token));
  }

  /**
   * @returns the number of keys registered in the system.
   */
  static get numberOfKeys(): number {
    return _globalKeyRegistry.numberOfKeys;
  }
}

/**
 * @internal
 */
export class KeyRegistry {
  private _allKeys = new Map<Object, ReflectiveKey>();

  get(token: Object): ReflectiveKey {
    if (token instanceof ReflectiveKey) {
      return token;
    }

    if (this._allKeys.has(token)) {
      // tslint:disable-next-line:no-non-null-assertion
      return this._allKeys.get(token)!;
    }

    const newKey = new ReflectiveKey(token, ReflectiveKey.numberOfKeys);
    this._allKeys.set(token, newKey);
    return newKey;
  }

  get numberOfKeys(): number {
    return this._allKeys.size;
  }
}

const _globalKeyRegistry = new KeyRegistry();
