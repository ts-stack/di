/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { global } from '../src/util';

/**
 * Jasmine matchers that check Angular specific conditions.
 */
export interface NgMatchers extends jasmine.Matchers<any> {
  /**
   * Invert the matchers.
   */
  not: NgMatchers;
  /**
   * Expect the value to be a `Promise`.
   *
   * ## Example
   *
   * {@example testing/ts/matchers.ts region='toBePromise'}
   */
  toBePromise(): boolean;

  /**
   * Expect the value to be an instance of a class.
   *
   * ## Example
   *
   * {@example testing/ts/matchers.ts region='toBeAnInstanceOf'}
   */
  toBeAnInstanceOf(expected: any): boolean;

  /**
   * Expect a class to implement the interface of the given class.
   *
   * ## Example
   *
   * {@example testing/ts/matchers.ts region='toImplement'}
   */
  toImplement(expected: any): boolean;

  /**
   * Expect an exception to contain the given error text.
   *
   * ## Example
   *
   * {@example testing/ts/matchers.ts region='toContainError'}
   */
  toContainError(expected: any): boolean;
}

const _global = (typeof window == 'undefined' ? global : window) as any;

/**
 * Jasmine matching function with Angular matchers mixed in.
 *
 * ## Example
 *
 * {@example testing/ts/matchers.ts region='toHaveText'}
 */
export const expect: (actual: any) => NgMatchers = _global.expect as any;

// Some Map polyfills don't polyfill Map.toString correctly, which
// gives us bad error messages in tests.
// The only way to do this in Jasmine is to monkey patch a method
// to the object :-(
(Map as any).prototype.jasmineToString = function() {
  const m = this;
  if (!m) {
    return '' + m;
  }
  const res: any[] = [];
  m.forEach((v: any, k: any) => {
    res.push(`${k}:${v}`);
  });
  return `{ ${res.join(',')} }`;
};

_global.beforeEach(function() {
  jasmine.addMatchers({
    // Custom handler for Map as Jasmine does not support it yet
    toEqual(util) {
      return {
        compare(actual: any, expected: any) {
          return { pass: util.equals(actual, expected, [compareMap]) };
        },
      };

      function compareMap(actual: any, expected: any): boolean {
        if (actual instanceof Map) {
          let pass = actual.size === expected.size;
          if (pass) {
            actual.forEach((v: any, k: any) => {
              pass = pass && util.equals(v, expected.get(k));
            });
          }
          return pass;
        } else {
          // TODO(misko): we should change the return, but jasmine.d.ts is not null safe
          // tslint:disable-next-line:no-non-null-assertion
          return undefined!;
        }
      }
    },

    toBePromise() {
      return {
        compare(actual: any) {
          const pass = typeof actual == 'object' && typeof actual.then == 'function';
          return {
            pass,
            get message() {
              return 'Expected ' + actual + ' to be a promise';
            },
          };
        },
      };
    },

    toBeAnInstanceOf() {
      return {
        compare(actual: any, expectedClass: any) {
          const pass = typeof actual == 'object' && actual instanceof expectedClass;
          return {
            pass,
            get message() {
              return 'Expected ' + actual + ' to be an instance of ' + expectedClass;
            },
          };
        },
      };
    },

    toContainError() {
      return {
        compare(actual: any, expectedText: any) {
          const errorMessage = actual.toString();
          return {
            pass: errorMessage.indexOf(expectedText) > -1,
            get message() {
              return 'Expected ' + errorMessage + ' to contain ' + expectedText;
            },
          };
        },
      };
    },

    toImplement() {
      return {
        compare(actualObject: any, expectedInterface: any) {
          const intProps = Object.keys(expectedInterface.prototype);

          const missedMethods: any[] = [];
          intProps.forEach(k => {
            if (!actualObject.constructor.prototype[k]) {
              missedMethods.push(k);
            }
          });

          return {
            pass: missedMethods.length == 0,
            get message() {
              return 'Expected ' + actualObject + ' to have the following methods: ' + missedMethods.join(', ');
            },
          };
        },
      };
    },
  });
});
