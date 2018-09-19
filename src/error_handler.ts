/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

function fake(){ /* unused function to prevent the license merging with comments */}

import {ERROR_ORIGINAL_ERROR} from './errors';

export function wrappedError(message: string, originalError: any): Error {
  const msg =
      `${message} caused by: ${originalError instanceof Error ? originalError.message: originalError }`;
  const error = Error(msg);
  (error as any)[ERROR_ORIGINAL_ERROR] = originalError;
  return error;
}
