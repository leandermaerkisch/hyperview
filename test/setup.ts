/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

class FormData {
  append: (arg1: string, arg2: string) => void = () => {};
}

global.FormData = FormData;