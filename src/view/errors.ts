/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export function viewDestroyedError(action: string): Error {
  return new Error(`ViewDestroyedError: Attempt to use a destroyed view: ${action}`);
}
