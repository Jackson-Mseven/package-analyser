import { describe, expect, it, test } from 'vitest'
import findHoopAndShow from '../lib/findHoopAndShow';

let inputData = {
    "package-analyser : 0.0.2": {
        "@types/js-yaml": "4.0.5",
        "@types/node": "20.4.5",
        "@typescript-eslint/eslint-plugin": "5.62.0",
        "eslint": "8.46.0",
        "eslint-config-prettier": "8.9.0",
        "eslint-config-standard-with-typescript": "37.0.0",
        "eslint-plugin-import": "2.28.0",
        "eslint-plugin-n": "16.0.1",
        "eslint-plugin-promise": "6.1.1",
        "eslint-plugin-react": "7.33.1",
        "husky": "8.0.3",
        "lint-staged": "13.2.3",
        "prettier": "3.0.0",
        "typescript": "5.1.6"
    },
    "@types/js-yaml : 4.0.5": {},
    "@types/node : 20.4.5": {},
    "@typescript-eslint/eslint-plugin : 5.62.0": {
        "@eslint-community/regexpp": "4.6.2",
        "@typescript-eslint/scope-manager": "5.62.0",
        "@typescript-eslint/type-utils": "5.62.0",
        "@typescript-eslint/utils": "5.62.0",
        "debug": "4.3.4",
        "graphemer": "1.4.0",
        "ignore": "5.2.4",
        "natural-compare-lite": "1.4.0",
        "semver": "7.5.4",
        "tsutils": "3.21.0"
    },
    "@eslint-community/regexpp : 4.6.2": {},
    "@typescript-eslint/scope-manager : 5.62.0": {
        "@typescript-eslint/types": "5.62.0",
        "@typescript-eslint/visitor-keys": "5.62.0"
    },
    "@typescript-eslint/types : 5.62.0": {},
    "@typescript-eslint/visitor-keys : 5.62.0": {
        "@typescript-eslint/types": "5.62.0",
        "eslint-visitor-keys": "3.4.2"
    },
    "eslint-visitor-keys : 3.4.2": {},
    "@typescript-eslint/type-utils : 5.62.0": {
        "@typescript-eslint/typescript-estree": "5.62.0",
        "@typescript-eslint/utils": "5.62.0",
        "debug": "4.3.4",
        "tsutils": "3.21.0"
    },
    "@typescript-eslint/typescript-estree : 5.62.0": {
        "@typescript-eslint/types": "5.62.0",
        "@typescript-eslint/visitor-keys": "5.62.0",
        "debug": "4.3.4",
        "globby": "11.1.0",
        "is-glob": "4.0.3",
        "semver": "7.5.4",
        "tsutils": "3.21.0"
    },
    "debug : 4.3.4": {
        "ms": "2.1.2"
    },
    "ms : 2.1.2": {},
    "globby : 11.1.0": {
        "array-union": "2.1.0",
        "dir-glob": "3.0.1",
        "fast-glob": "3.3.1",
        "ignore": "5.2.4",
        "merge2": "1.4.1",
        "slash": "3.0.0"
    },
    "array-union : 2.1.0": {},
    "dir-glob : 3.0.1": {
        "path-type": "4.0.0"
    },
    "path-type : 4.0.0": {},
    "fast-glob : 3.3.1": {
        "@nodelib/fs.stat": "2.0.5",
        "@nodelib/fs.walk": "1.2.8",
        "glob-parent": "5.1.2",
        "merge2": "1.4.1",
        "micromatch": "4.0.5"
    },
    "@nodelib/fs.stat : 2.0.5": {},
    "@nodelib/fs.walk : 1.2.8": {
        "@nodelib/fs.scandir": "2.1.5",
        "fastq": "1.15.0"
    },
    "@nodelib/fs.scandir : 2.1.5": {
        "@nodelib/fs.stat": "2.0.5",
        "run-parallel": "1.2.0"
    },
    "run-parallel : 1.2.0": {
        "queue-microtask": "1.2.3"
    },
    "queue-microtask : 1.2.3": {},
    "fastq : 1.15.0": {
        "reusify": "1.0.4"
    },
    "reusify : 1.0.4": {},
    "glob-parent : 5.1.2": {
        "is-glob": "4.0.3"
    },
    "is-glob : 4.0.3": {
        "is-extglob": "2.1.1"
    },
    "is-extglob : 2.1.1": {},
    "merge2 : 1.4.1": {},
    "micromatch : 4.0.5": {
        "braces": "3.0.2",
        "picomatch": "2.3.1"
    },
    "braces : 3.0.2": {
        "fill-range": "7.0.1"
    },
    "fill-range : 7.0.1": {
        "to-regex-range": "5.0.1"
    },
    "to-regex-range : 5.0.1": {
        "is-number": "7.0.0"
    },
    "is-number : 7.0.0": {},
    "picomatch : 2.3.1": {},
    "ignore : 5.2.4": {},
    "slash : 3.0.0": {},
    "semver : 7.5.4": {
        "lru-cache": "6.0.0"
    },
    "lru-cache : 6.0.0": {
        "yallist": "4.0.0"
    },
    "yallist : 4.0.0": {},
    "tsutils : 3.21.0": {
        "tslib": "1.14.1"
    },
    "tslib : 1.14.1": {},
    "@typescript-eslint/utils : 5.62.0": {
        "@eslint-community/eslint-utils": "4.4.0",
        "@types/json-schema": "7.0.12",
        "@types/semver": "7.5.0",
        "@typescript-eslint/scope-manager": "5.62.0",
        "@typescript-eslint/types": "5.62.0",
        "@typescript-eslint/typescript-estree": "5.62.0",
        "eslint-scope": "5.1.1",
        "semver": "7.5.4"
    },
    "@eslint-community/eslint-utils : 4.4.0": {
        "eslint-visitor-keys": "3.4.2"
    },
    "@types/json-schema : 7.0.12": {},
    "@types/semver : 7.5.0": {},
    "eslint-scope : 5.1.1": {
        "esrecurse": "4.3.0",
        "estraverse": "4.3.0"
    },
    "esrecurse : 4.3.0": {
        "estraverse": "5.3.0"
    },
    "estraverse : 5.3.0": {},
    "estraverse : 4.3.0": {},
    "graphemer : 1.4.0": {},
    "natural-compare-lite : 1.4.0": {},
    "eslint : 8.46.0": {
        "@eslint-community/eslint-utils": "4.4.0",
        "@eslint-community/regexpp": "4.6.2",
        "@eslint/eslintrc": "2.1.1",
        "@eslint/js": "8.46.0",
        "@humanwhocodes/config-array": "0.11.10",
        "@humanwhocodes/module-importer": "1.0.1",
        "@nodelib/fs.walk": "1.2.8",
        "ajv": "6.12.6",
        "chalk": "4.1.2",
        "cross-spawn": "7.0.3",
        "debug": "4.3.4",
        "doctrine": "3.0.0",
        "escape-string-regexp": "4.0.0",
        "eslint-scope": "7.2.2",
        "eslint-visitor-keys": "3.4.2",
        "espree": "9.6.1",
        "esquery": "1.5.0",
        "esutils": "2.0.3",
        "fast-deep-equal": "3.1.3",
        "file-entry-cache": "6.0.1",
        "find-up": "5.0.0",
        "glob-parent": "6.0.2",
        "globals": "13.20.0",
        "graphemer": "1.4.0",
        "ignore": "5.2.4",
        "imurmurhash": "0.1.4",
        "is-glob": "4.0.3",
        "is-path-inside": "3.0.3",
        "js-yaml": "4.1.0",
        "json-stable-stringify-without-jsonify": "1.0.1",
        "levn": "0.4.1",
        "lodash.merge": "4.6.2",
        "minimatch": "3.1.2",
        "natural-compare": "1.4.0",
        "optionator": "0.9.3",
        "strip-ansi": "6.0.1",
        "text-table": "0.2.0"
    },
    "@eslint/eslintrc : 2.1.1": {
        "ajv": "6.12.6",
        "debug": "4.3.4",
        "espree": "9.6.1",
        "globals": "13.20.0",
        "ignore": "5.2.4",
        "import-fresh": "3.3.0",
        "js-yaml": "4.1.0",
        "minimatch": "3.1.2",
        "strip-json-comments": "3.1.1"
    },
    "ajv : 6.12.6": {
        "fast-deep-equal": "3.1.3",
        "fast-json-stable-stringify": "2.1.0",
        "json-schema-traverse": "0.4.1",
        "uri-js": "4.4.1"
    },
    "fast-deep-equal : 3.1.3": {},
    "fast-json-stable-stringify : 2.1.0": {},
    "json-schema-traverse : 0.4.1": {},
    "uri-js : 4.4.1": {
        "punycode": "2.3.0"
    },
    "punycode : 2.3.0": {},
    "espree : 9.6.1": {
        "acorn": "8.10.0",
        "acorn-jsx": "5.3.2",
        "eslint-visitor-keys": "3.4.2"
    },
    "acorn : 8.10.0": {},
    "acorn-jsx : 5.3.2": {},
    "globals : 13.20.0": {
        "type-fest": "0.20.2"
    },
    "type-fest : 0.20.2": {},
    "import-fresh : 3.3.0": {
        "parent-module": "1.0.1",
        "resolve-from": "4.0.0"
    },
    "parent-module : 1.0.1": {
        "callsites": "3.1.0"
    },
    "callsites : 3.1.0": {},
    "resolve-from : 4.0.0": {},
    "js-yaml : 4.1.0": {
        "argparse": "2.0.1"
    },
    "argparse : 2.0.1": {},
    "minimatch : 3.1.2": {
        "brace-expansion": "1.1.11"
    },
    "brace-expansion : 1.1.11": {
        "balanced-match": "1.0.2",
        "concat-map": "0.0.1"
    },
    "balanced-match : 1.0.2": {},
    "concat-map : 0.0.1": {},
    "strip-json-comments : 3.1.1": {},
    "@eslint/js : 8.46.0": {},
    "@humanwhocodes/config-array : 0.11.10": {
        "@humanwhocodes/object-schema": "1.2.1",
        "debug": "4.3.4",
        "minimatch": "3.1.2"
    },
    "@humanwhocodes/object-schema : 1.2.1": {},
    "@humanwhocodes/module-importer : 1.0.1": {},
    "chalk : 4.1.2": {
        "ansi-styles": "4.3.0",
        "supports-color": "7.2.0"
    },
    "ansi-styles : 4.3.0": {
        "color-convert": "2.0.1"
    },
    "color-convert : 2.0.1": {
        "color-name": "1.1.4"
    },
    "color-name : 1.1.4": {},
    "supports-color : 7.2.0": {
        "has-flag": "4.0.0"
    },
    "has-flag : 4.0.0": {},
    "cross-spawn : 7.0.3": {
        "path-key": "3.1.1",
        "shebang-command": "2.0.0",
        "which": "2.0.2"
    },
    "path-key : 3.1.1": {},
    "shebang-command : 2.0.0": {
        "shebang-regex": "3.0.0"
    },
    "shebang-regex : 3.0.0": {},
    "which : 2.0.2": {
        "isexe": "2.0.0"
    },
    "isexe : 2.0.0": {},
    "doctrine : 3.0.0": {
        "esutils": "2.0.3"
    },
    "esutils : 2.0.3": {},
    "escape-string-regexp : 4.0.0": {},
    "eslint-scope : 7.2.2": {
        "esrecurse": "4.3.0",
        "estraverse": "5.3.0"
    },
    "esquery : 1.5.0": {
        "estraverse": "5.3.0"
    },
    "file-entry-cache : 6.0.1": {
        "flat-cache": "3.0.4"
    },
    "flat-cache : 3.0.4": {
        "flatted": "3.2.7",
        "rimraf": "3.0.2"
    },
    "flatted : 3.2.7": {},
    "rimraf : 3.0.2": {
        "glob": "7.2.3"
    },
    "glob : 7.2.3": {
        "fs.realpath": "1.0.0",
        "inflight": "1.0.6",
        "inherits": "2.0.4",
        "minimatch": "3.1.2",
        "once": "1.4.0",
        "path-is-absolute": "1.0.1"
    },
    "fs.realpath : 1.0.0": {},
    "inflight : 1.0.6": {
        "once": "1.4.0",
        "wrappy": "1.0.2"
    },
    "once : 1.4.0": {
        "wrappy": "1.0.2"
    },
    "wrappy : 1.0.2": {},
    "inherits : 2.0.4": {},
    "path-is-absolute : 1.0.1": {},
    "find-up : 5.0.0": {
        "locate-path": "6.0.0",
        "path-exists": "4.0.0"
    },
    "locate-path : 6.0.0": {
        "p-locate": "5.0.0"
    },
    "p-locate : 5.0.0": {
        "p-limit": "3.1.0"
    },
    "p-limit : 3.1.0": {
        "yocto-queue": "0.1.0"
    },
    "yocto-queue : 0.1.0": {},
    "path-exists : 4.0.0": {},
    "glob-parent : 6.0.2": {
        "is-glob": "4.0.3"
    },
    "imurmurhash : 0.1.4": {},
    "is-path-inside : 3.0.3": {},
    "json-stable-stringify-without-jsonify : 1.0.1": {},
    "levn : 0.4.1": {
        "prelude-ls": "1.2.1",
        "type-check": "0.4.0"
    },
    "prelude-ls : 1.2.1": {},
    "type-check : 0.4.0": {
        "prelude-ls": "1.2.1"
    },
    "lodash.merge : 4.6.2": {},
    "natural-compare : 1.4.0": {},
    "optionator : 0.9.3": {
        "prelude-ls": "1.2.1",
        "deep-is": "0.1.4",
        "@aashutoshrathi/word-wrap": "1.2.6",
        "type-check": "0.4.0",
        "levn": "0.4.1",
        "fast-levenshtein": "2.0.6"
    },
    "deep-is : 0.1.4": {},
    "@aashutoshrathi/word-wrap : 1.2.6": {},
    "fast-levenshtein : 2.0.6": {},
    "strip-ansi : 6.0.1": {
        "ansi-regex": "5.0.1"
    },
    "ansi-regex : 5.0.1": {},
    "text-table : 0.2.0": {},
    "eslint-config-prettier : 8.9.0": {},
    "eslint-config-standard-with-typescript : 37.0.0": {
        "@typescript-eslint/parser": "5.62.0",
        "eslint-config-standard": "17.1.0"
    },
    "@typescript-eslint/parser : 5.62.0": {
        "@typescript-eslint/scope-manager": "5.62.0",
        "@typescript-eslint/types": "5.62.0",
        "@typescript-eslint/typescript-estree": "5.62.0",
        "debug": "4.3.4"
    },
    "eslint-config-standard : 17.1.0": {},
    "eslint-plugin-import : 2.28.0": {
        "array-includes": "3.1.6",
        "array.prototype.findlastindex": "1.2.2",
        "array.prototype.flat": "1.3.1",
        "array.prototype.flatmap": "1.3.1",
        "debug": "3.2.7",
        "doctrine": "2.1.0",
        "eslint-import-resolver-node": "0.3.7",
        "eslint-module-utils": "2.8.0",
        "has": "1.0.3",
        "is-core-module": "2.12.1",
        "is-glob": "4.0.3",
        "minimatch": "3.1.2",
        "object.fromentries": "2.0.6",
        "object.groupby": "1.0.0",
        "object.values": "1.1.6",
        "resolve": "1.22.3",
        "semver": "6.3.1",
        "tsconfig-paths": "3.14.2"
    },
    "array-includes : 3.1.6": {
        "call-bind": "1.0.2",
        "define-properties": "1.2.0",
        "es-abstract": "1.22.1",
        "get-intrinsic": "1.2.1",
        "is-string": "1.0.7"
    },
    "call-bind : 1.0.2": {
        "function-bind": "1.1.1",
        "get-intrinsic": "1.2.1"
    },
    "function-bind : 1.1.1": {},
    "get-intrinsic : 1.2.1": {
        "function-bind": "1.1.1",
        "has": "1.0.3",
        "has-proto": "1.0.1",
        "has-symbols": "1.0.3"
    },
    "has : 1.0.3": {
        "function-bind": "1.1.1"
    },
    "has-proto : 1.0.1": {},
    "has-symbols : 1.0.3": {},
    "define-properties : 1.2.0": {
        "has-property-descriptors": "1.0.0",
        "object-keys": "1.1.1"
    },
    "has-property-descriptors : 1.0.0": {
        "get-intrinsic": "1.2.1"
    },
    "object-keys : 1.1.1": {},
    "es-abstract : 1.22.1": {
        "array-buffer-byte-length": "1.0.0",
        "arraybuffer.prototype.slice": "1.0.1",
        "available-typed-arrays": "1.0.5",
        "call-bind": "1.0.2",
        "es-set-tostringtag": "2.0.1",
        "es-to-primitive": "1.2.1",
        "function.prototype.name": "1.1.5",
        "get-intrinsic": "1.2.1",
        "get-symbol-description": "1.0.0",
        "globalthis": "1.0.3",
        "gopd": "1.0.1",
        "has": "1.0.3",
        "has-property-descriptors": "1.0.0",
        "has-proto": "1.0.1",
        "has-symbols": "1.0.3",
        "internal-slot": "1.0.5",
        "is-array-buffer": "3.0.2",
        "is-callable": "1.2.7",
        "is-negative-zero": "2.0.2",
        "is-regex": "1.1.4",
        "is-shared-array-buffer": "1.0.2",
        "is-string": "1.0.7",
        "is-typed-array": "1.1.12",
        "is-weakref": "1.0.2",
        "object-inspect": "1.12.3",
        "object-keys": "1.1.1",
        "object.assign": "4.1.4",
        "regexp.prototype.flags": "1.5.0",
        "safe-array-concat": "1.0.0",
        "safe-regex-test": "1.0.0",
        "string.prototype.trim": "1.2.7",
        "string.prototype.trimend": "1.0.6",
        "string.prototype.trimstart": "1.0.6",
        "typed-array-buffer": "1.0.0",
        "typed-array-byte-length": "1.0.0",
        "typed-array-byte-offset": "1.0.0",
        "typed-array-length": "1.0.4",
        "unbox-primitive": "1.0.2",
        "which-typed-array": "1.1.11"
    },
    "array-buffer-byte-length : 1.0.0": {
        "call-bind": "1.0.2",
        "is-array-buffer": "3.0.2"
    },
    "is-array-buffer : 3.0.2": {
        "call-bind": "1.0.2",
        "get-intrinsic": "1.2.1",
        "is-typed-array": "1.1.12"
    },
    "is-typed-array : 1.1.12": {
        "which-typed-array": "1.1.11"
    },
    "which-typed-array : 1.1.11": {
        "available-typed-arrays": "1.0.5",
        "call-bind": "1.0.2",
        "for-each": "0.3.3",
        "gopd": "1.0.1",
        "has-tostringtag": "1.0.0"
    },
    "available-typed-arrays : 1.0.5": {},
    "for-each : 0.3.3": {
        "is-callable": "1.2.7"
    },
    "is-callable : 1.2.7": {},
    "gopd : 1.0.1": {
        "get-intrinsic": "1.2.1"
    },
    "has-tostringtag : 1.0.0": {
        "has-symbols": "1.0.3"
    },
    "arraybuffer.prototype.slice : 1.0.1": {
        "array-buffer-byte-length": "1.0.0",
        "call-bind": "1.0.2",
        "define-properties": "1.2.0",
        "get-intrinsic": "1.2.1",
        "is-array-buffer": "3.0.2",
        "is-shared-array-buffer": "1.0.2"
    },
    "is-shared-array-buffer : 1.0.2": {
        "call-bind": "1.0.2"
    },
    "es-set-tostringtag : 2.0.1": {
        "get-intrinsic": "1.2.1",
        "has": "1.0.3",
        "has-tostringtag": "1.0.0"
    },
    "es-to-primitive : 1.2.1": {
        "is-callable": "1.2.7",
        "is-date-object": "1.0.5",
        "is-symbol": "1.0.4"
    },
    "is-date-object : 1.0.5": {
        "has-tostringtag": "1.0.0"
    },
    "is-symbol : 1.0.4": {
        "has-symbols": "1.0.3"
    },
    "function.prototype.name : 1.1.5": {
        "call-bind": "1.0.2",
        "define-properties": "1.2.0",
        "es-abstract": "1.22.1",
        "functions-have-names": "1.2.3"
    },
    "functions-have-names : 1.2.3": {},
    "get-symbol-description : 1.0.0": {
        "call-bind": "1.0.2",
        "get-intrinsic": "1.2.1"
    },
    "globalthis : 1.0.3": {
        "define-properties": "1.2.0"
    },
    "internal-slot : 1.0.5": {
        "get-intrinsic": "1.2.1",
        "has": "1.0.3",
        "side-channel": "1.0.4"
    },
    "side-channel : 1.0.4": {
        "call-bind": "1.0.2",
        "get-intrinsic": "1.2.1",
        "object-inspect": "1.12.3"
    },
    "object-inspect : 1.12.3": {},
    "is-negative-zero : 2.0.2": {},
    "is-regex : 1.1.4": {
        "call-bind": "1.0.2",
        "has-tostringtag": "1.0.0"
    },
    "is-string : 1.0.7": {
        "has-tostringtag": "1.0.0"
    },
    "is-weakref : 1.0.2": {
        "call-bind": "1.0.2"
    },
    "object.assign : 4.1.4": {
        "call-bind": "1.0.2",
        "define-properties": "1.2.0",
        "has-symbols": "1.0.3",
        "object-keys": "1.1.1"
    },
    "regexp.prototype.flags : 1.5.0": {
        "call-bind": "1.0.2",
        "define-properties": "1.2.0",
        "functions-have-names": "1.2.3"
    },
    "safe-array-concat : 1.0.0": {
        "call-bind": "1.0.2",
        "get-intrinsic": "1.2.1",
        "has-symbols": "1.0.3",
        "isarray": "2.0.5"
    },
    "isarray : 2.0.5": {},
    "safe-regex-test : 1.0.0": {
        "call-bind": "1.0.2",
        "get-intrinsic": "1.2.1",
        "is-regex": "1.1.4"
    },
    "string.prototype.trim : 1.2.7": {
        "call-bind": "1.0.2",
        "define-properties": "1.2.0",
        "es-abstract": "1.22.1"
    },
    "string.prototype.trimend : 1.0.6": {
        "call-bind": "1.0.2",
        "define-properties": "1.2.0",
        "es-abstract": "1.22.1"
    },
    "string.prototype.trimstart : 1.0.6": {
        "call-bind": "1.0.2",
        "define-properties": "1.2.0",
        "es-abstract": "1.22.1"
    },
    "typed-array-buffer : 1.0.0": {
        "call-bind": "1.0.2",
        "get-intrinsic": "1.2.1",
        "is-typed-array": "1.1.12"
    },
    "typed-array-byte-length : 1.0.0": {
        "call-bind": "1.0.2",
        "for-each": "0.3.3",
        "has-proto": "1.0.1",
        "is-typed-array": "1.1.12"
    },
    "typed-array-byte-offset : 1.0.0": {
        "available-typed-arrays": "1.0.5",
        "call-bind": "1.0.2",
        "for-each": "0.3.3",
        "has-proto": "1.0.1",
        "is-typed-array": "1.1.12"
    },
    "typed-array-length : 1.0.4": {
        "call-bind": "1.0.2",
        "for-each": "0.3.3",
        "is-typed-array": "1.1.12"
    },
    "unbox-primitive : 1.0.2": {
        "call-bind": "1.0.2",
        "has-bigints": "1.0.2",
        "has-symbols": "1.0.3",
        "which-boxed-primitive": "1.0.2"
    },
    "has-bigints : 1.0.2": {},
    "which-boxed-primitive : 1.0.2": {
        "is-bigint": "1.0.4",
        "is-boolean-object": "1.1.2",
        "is-number-object": "1.0.7",
        "is-string": "1.0.7",
        "is-symbol": "1.0.4"
    },
    "is-bigint : 1.0.4": {
        "has-bigints": "1.0.2"
    },
    "is-boolean-object : 1.1.2": {
        "call-bind": "1.0.2",
        "has-tostringtag": "1.0.0"
    },
    "is-number-object : 1.0.7": {
        "has-tostringtag": "1.0.0"
    },
    "array.prototype.findlastindex : 1.2.2": {
        "call-bind": "1.0.2",
        "define-properties": "1.2.0",
        "es-abstract": "1.22.1",
        "es-shim-unscopables": "1.0.0",
        "get-intrinsic": "1.2.1"
    },
    "es-shim-unscopables : 1.0.0": {
        "has": "1.0.3"
    },
    "array.prototype.flat : 1.3.1": {
        "call-bind": "1.0.2",
        "define-properties": "1.2.0",
        "es-abstract": "1.22.1",
        "es-shim-unscopables": "1.0.0"
    },
    "array.prototype.flatmap : 1.3.1": {
        "call-bind": "1.0.2",
        "define-properties": "1.2.0",
        "es-abstract": "1.22.1",
        "es-shim-unscopables": "1.0.0"
    },
    "debug : 3.2.7": {
        "ms": "2.1.2"
    },
    "doctrine : 2.1.0": {
        "esutils": "2.0.3"
    },
    "eslint-import-resolver-node : 0.3.7": {
        "debug": "3.2.7",
        "is-core-module": "2.12.1",
        "resolve": "1.22.3"
    },
    "is-core-module : 2.12.1": {
        "has": "1.0.3"
    },
    "resolve : 1.22.3": {
        "is-core-module": "2.12.1",
        "path-parse": "1.0.7",
        "supports-preserve-symlinks-flag": "1.0.0"
    },
    "path-parse : 1.0.7": {},
    "supports-preserve-symlinks-flag : 1.0.0": {},
    "eslint-module-utils : 2.8.0": {
        "debug": "3.2.7"
    },
    "object.fromentries : 2.0.6": {
        "call-bind": "1.0.2",
        "define-properties": "1.2.0",
        "es-abstract": "1.22.1"
    },
    "object.groupby : 1.0.0": {
        "call-bind": "1.0.2",
        "define-properties": "1.2.0",
        "es-abstract": "1.22.1",
        "get-intrinsic": "1.2.1"
    },
    "object.values : 1.1.6": {
        "call-bind": "1.0.2",
        "define-properties": "1.2.0",
        "es-abstract": "1.22.1"
    },
    "semver : 6.3.1": {},
    "tsconfig-paths : 3.14.2": {
        "@types/json5": "0.0.29",
        "json5": "1.0.2",
        "minimist": "1.2.8",
        "strip-bom": "3.0.0"
    },
    "@types/json5 : 0.0.29": {},
    "json5 : 1.0.2": {
        "minimist": "1.2.8"
    },
    "minimist : 1.2.8": {},
    "strip-bom : 3.0.0": {},
    "eslint-plugin-n : 16.0.1": {
        "@eslint-community/eslint-utils": "4.4.0",
        "builtins": "5.0.1",
        "eslint-plugin-es-x": "7.2.0",
        "ignore": "5.2.4",
        "is-core-module": "2.12.1",
        "minimatch": "3.1.2",
        "resolve": "1.22.3",
        "semver": "7.5.4"
    },
    "builtins : 5.0.1": {
        "semver": "7.5.4"
    },
    "eslint-plugin-es-x : 7.2.0": {
        "@eslint-community/eslint-utils": "4.4.0",
        "@eslint-community/regexpp": "4.6.2"
    },
    "eslint-plugin-promise : 6.1.1": {},
    "eslint-plugin-react : 7.33.1": {
        "array-includes": "3.1.6",
        "array.prototype.flatmap": "1.3.1",
        "array.prototype.tosorted": "1.1.1",
        "doctrine": "2.1.0",
        "estraverse": "5.3.0",
        "jsx-ast-utils": "3.3.5",
        "minimatch": "3.1.2",
        "object.entries": "1.1.6",
        "object.fromentries": "2.0.6",
        "object.hasown": "1.1.2",
        "object.values": "1.1.6",
        "prop-types": "15.8.1",
        "resolve": "2.0.0-next.4",
        "semver": "6.3.1",
        "string.prototype.matchall": "4.0.8"
    },
    "array.prototype.tosorted : 1.1.1": {
        "call-bind": "1.0.2",
        "define-properties": "1.2.0",
        "es-abstract": "1.22.1",
        "es-shim-unscopables": "1.0.0",
        "get-intrinsic": "1.2.1"
    },
    "jsx-ast-utils : 3.3.5": {
        "array-includes": "3.1.6",
        "array.prototype.flat": "1.3.1",
        "object.assign": "4.1.4",
        "object.values": "1.1.6"
    },
    "object.entries : 1.1.6": {
        "call-bind": "1.0.2",
        "define-properties": "1.2.0",
        "es-abstract": "1.22.1"
    },
    "object.hasown : 1.1.2": {
        "define-properties": "1.2.0",
        "es-abstract": "1.22.1"
    },
    "prop-types : 15.8.1": {
        "loose-envify": "1.4.0",
        "object-assign": "4.1.1",
        "react-is": "16.13.1"
    },
    "loose-envify : 1.4.0": {
        "js-tokens": "4.0.0"
    },
    "js-tokens : 4.0.0": {},
    "object-assign : 4.1.1": {},
    "react-is : 16.13.1": {},
    "resolve : 2.0.0-next.4": {
        "is-core-module": "2.12.1",
        "path-parse": "1.0.7",
        "supports-preserve-symlinks-flag": "1.0.0"
    },
    "string.prototype.matchall : 4.0.8": {
        "call-bind": "1.0.2",
        "define-properties": "1.2.0",
        "es-abstract": "1.22.1",
        "get-intrinsic": "1.2.1",
        "has-symbols": "1.0.3",
        "internal-slot": "1.0.5",
        "regexp.prototype.flags": "1.5.0",
        "side-channel": "1.0.4"
    },
    "husky : 8.0.3": {},
    "lint-staged : 13.2.3": {
        "chalk": "5.2.0",
        "cli-truncate": "3.1.0",
        "commander": "10.0.1",
        "debug": "4.3.4",
        "execa": "7.2.0",
        "lilconfig": "2.1.0",
        "listr2": "5.0.8",
        "micromatch": "4.0.5",
        "normalize-path": "3.0.0",
        "object-inspect": "1.12.3",
        "pidtree": "0.6.0",
        "string-argv": "0.3.2",
        "yaml": "2.3.1"
    },
    "chalk : 5.2.0": {},
    "cli-truncate : 3.1.0": {
        "slice-ansi": "5.0.0",
        "string-width": "5.1.2"
    },
    "slice-ansi : 5.0.0": {
        "ansi-styles": "6.2.1",
        "is-fullwidth-code-point": "4.0.0"
    },
    "ansi-styles : 6.2.1": {},
    "is-fullwidth-code-point : 4.0.0": {},
    "string-width : 5.1.2": {
        "eastasianwidth": "0.2.0",
        "emoji-regex": "9.2.2",
        "strip-ansi": "7.1.0"
    },
    "eastasianwidth : 0.2.0": {},
    "emoji-regex : 9.2.2": {},
    "strip-ansi : 7.1.0": {
        "ansi-regex": "6.0.1"
    },
    "ansi-regex : 6.0.1": {},
    "commander : 10.0.1": {},
    "execa : 7.2.0": {
        "cross-spawn": "7.0.3",
        "get-stream": "6.0.1",
        "human-signals": "4.3.1",
        "is-stream": "3.0.0",
        "merge-stream": "2.0.0",
        "npm-run-path": "5.1.0",
        "onetime": "6.0.0",
        "signal-exit": "3.0.7",
        "strip-final-newline": "3.0.0"
    },
    "get-stream : 6.0.1": {},
    "human-signals : 4.3.1": {},
    "is-stream : 3.0.0": {},
    "merge-stream : 2.0.0": {},
    "npm-run-path : 5.1.0": {
        "path-key": "4.0.0"
    },
    "path-key : 4.0.0": {},
    "onetime : 6.0.0": {
        "mimic-fn": "4.0.0"
    },
    "mimic-fn : 4.0.0": {},
    "signal-exit : 3.0.7": {},
    "strip-final-newline : 3.0.0": {},
    "lilconfig : 2.1.0": {},
    "listr2 : 5.0.8": {
        "cli-truncate": "2.1.0",
        "colorette": "2.0.20",
        "log-update": "4.0.0",
        "p-map": "4.0.0",
        "rfdc": "1.3.0",
        "rxjs": "7.8.1",
        "through": "2.3.8",
        "wrap-ansi": "7.0.0"
    },
    "cli-truncate : 2.1.0": {
        "slice-ansi": "3.0.0",
        "string-width": "4.2.3"
    },
    "slice-ansi : 3.0.0": {
        "ansi-styles": "4.3.0",
        "astral-regex": "2.0.0",
        "is-fullwidth-code-point": "3.0.0"
    },
    "astral-regex : 2.0.0": {},
    "is-fullwidth-code-point : 3.0.0": {},
    "string-width : 4.2.3": {
        "emoji-regex": "8.0.0",
        "is-fullwidth-code-point": "3.0.0",
        "strip-ansi": "6.0.1"
    },
    "emoji-regex : 8.0.0": {},
    "colorette : 2.0.20": {},
    "log-update : 4.0.0": {
        "ansi-escapes": "4.3.2",
        "cli-cursor": "3.1.0",
        "slice-ansi": "4.0.0",
        "wrap-ansi": "6.2.0"
    },
    "ansi-escapes : 4.3.2": {
        "type-fest": "0.21.3"
    },
    "type-fest : 0.21.3": {},
    "cli-cursor : 3.1.0": {
        "restore-cursor": "3.1.0"
    },
    "restore-cursor : 3.1.0": {
        "onetime": "5.1.2",
        "signal-exit": "3.0.7"
    },
    "onetime : 5.1.2": {
        "mimic-fn": "2.1.0"
    },
    "mimic-fn : 2.1.0": {},
    "slice-ansi : 4.0.0": {
        "ansi-styles": "4.3.0",
        "astral-regex": "2.0.0",
        "is-fullwidth-code-point": "3.0.0"
    },
    "wrap-ansi : 6.2.0": {
        "ansi-styles": "4.3.0",
        "string-width": "4.2.3",
        "strip-ansi": "6.0.1"
    },
    "p-map : 4.0.0": {
        "aggregate-error": "3.1.0"
    },
    "aggregate-error : 3.1.0": {
        "clean-stack": "2.2.0",
        "indent-string": "4.0.0"
    },
    "clean-stack : 2.2.0": {},
    "indent-string : 4.0.0": {},
    "rfdc : 1.3.0": {},
    "rxjs : 7.8.1": {
        "tslib": "2.6.1"
    },
    "tslib : 2.6.1": {},
    "through : 2.3.8": {},
    "wrap-ansi : 7.0.0": {
        "ansi-styles": "4.3.0",
        "string-width": "4.2.3",
        "strip-ansi": "6.0.1"
    },
    "normalize-path : 3.0.0": {},
    "pidtree : 0.6.0": {},
    "string-argv : 0.3.2": {},
    "yaml : 2.3.1": {},
    "prettier : 3.0.0": {},
    "typescript : 5.1.6": {}
};

let outputData = {
    "flag": true,
    "hoop": {
        "has : 1.0.3": {
            "function-bind": "1.1.1"
        },
        "call-bind : 1.0.2": {
            "function-bind": "1.1.1",
            "get-intrinsic": "1.2.1"
        },
        "define-properties : 1.2.0": {
            "has-property-descriptors": "1.0.0",
            "object-keys": "1.1.1"
        },
        "es-abstract : 1.22.1": {
            "array-buffer-byte-length": "1.0.0",
            "arraybuffer.prototype.slice": "1.0.1",
            "available-typed-arrays": "1.0.5",
            "call-bind": "1.0.2",
            "es-set-tostringtag": "2.0.1",
            "es-to-primitive": "1.2.1",
            "function.prototype.name": "1.1.5",
            "get-intrinsic": "1.2.1",
            "get-symbol-description": "1.0.0",
            "globalthis": "1.0.3",
            "gopd": "1.0.1",
            "has": "1.0.3",
            "has-property-descriptors": "1.0.0",
            "has-proto": "1.0.1",
            "has-symbols": "1.0.3",
            "internal-slot": "1.0.5",
            "is-array-buffer": "3.0.2",
            "is-callable": "1.2.7",
            "is-negative-zero": "2.0.2",
            "is-regex": "1.1.4",
            "is-shared-array-buffer": "1.0.2",
            "is-string": "1.0.7",
            "is-typed-array": "1.1.12",
            "is-weakref": "1.0.2",
            "object-inspect": "1.12.3",
            "object-keys": "1.1.1",
            "object.assign": "4.1.4",
            "regexp.prototype.flags": "1.5.0",
            "safe-array-concat": "1.0.0",
            "safe-regex-test": "1.0.0",
            "string.prototype.trim": "1.2.7",
            "string.prototype.trimend": "1.0.6",
            "string.prototype.trimstart": "1.0.6",
            "typed-array-buffer": "1.0.0",
            "typed-array-byte-length": "1.0.0",
            "typed-array-byte-offset": "1.0.0",
            "typed-array-length": "1.0.4",
            "unbox-primitive": "1.0.2",
            "which-typed-array": "1.1.11"
        },
        "get-intrinsic : 1.2.1": {
            "function-bind": "1.1.1",
            "has": "1.0.3",
            "has-proto": "1.0.1",
            "has-symbols": "1.0.3"
        },
        "is-string : 1.0.7": {
            "has-tostringtag": "1.0.0"
        },
        "function-bind : 1.1.1": {},
        "has-proto : 1.0.1": {},
        "has-symbols : 1.0.3": {},
        "has-property-descriptors : 1.0.0": {
            "get-intrinsic": "1.2.1"
        },
        "object-keys : 1.1.1": {},
        "array-buffer-byte-length : 1.0.0": {
            "call-bind": "1.0.2",
            "is-array-buffer": "3.0.2"
        },
        "arraybuffer.prototype.slice : 1.0.1": {
            "array-buffer-byte-length": "1.0.0",
            "call-bind": "1.0.2",
            "define-properties": "1.2.0",
            "get-intrinsic": "1.2.1",
            "is-array-buffer": "3.0.2",
            "is-shared-array-buffer": "1.0.2"
        },
        "available-typed-arrays : 1.0.5": {},
        "es-set-tostringtag : 2.0.1": {
            "get-intrinsic": "1.2.1",
            "has": "1.0.3",
            "has-tostringtag": "1.0.0"
        },
        "es-to-primitive : 1.2.1": {
            "is-callable": "1.2.7",
            "is-date-object": "1.0.5",
            "is-symbol": "1.0.4"
        },
        "function.prototype.name : 1.1.5": {
            "call-bind": "1.0.2",
            "define-properties": "1.2.0",
            "es-abstract": "1.22.1",
            "functions-have-names": "1.2.3"
        },
        "get-symbol-description : 1.0.0": {
            "call-bind": "1.0.2",
            "get-intrinsic": "1.2.1"
        },
        "globalthis : 1.0.3": {
            "define-properties": "1.2.0"
        },
        "gopd : 1.0.1": {
            "get-intrinsic": "1.2.1"
        },
        "internal-slot : 1.0.5": {
            "get-intrinsic": "1.2.1",
            "has": "1.0.3",
            "side-channel": "1.0.4"
        },
        "is-array-buffer : 3.0.2": {
            "call-bind": "1.0.2",
            "get-intrinsic": "1.2.1",
            "is-typed-array": "1.1.12"
        },
        "is-callable : 1.2.7": {},
        "is-negative-zero : 2.0.2": {},
        "is-regex : 1.1.4": {
            "call-bind": "1.0.2",
            "has-tostringtag": "1.0.0"
        },
        "is-shared-array-buffer : 1.0.2": {
            "call-bind": "1.0.2"
        },
        "is-typed-array : 1.1.12": {
            "which-typed-array": "1.1.11"
        },
        "is-weakref : 1.0.2": {
            "call-bind": "1.0.2"
        },
        "object-inspect : 1.12.3": {},
        "object.assign : 4.1.4": {
            "call-bind": "1.0.2",
            "define-properties": "1.2.0",
            "has-symbols": "1.0.3",
            "object-keys": "1.1.1"
        },
        "regexp.prototype.flags : 1.5.0": {
            "call-bind": "1.0.2",
            "define-properties": "1.2.0",
            "functions-have-names": "1.2.3"
        },
        "safe-array-concat : 1.0.0": {
            "call-bind": "1.0.2",
            "get-intrinsic": "1.2.1",
            "has-symbols": "1.0.3",
            "isarray": "2.0.5"
        },
        "safe-regex-test : 1.0.0": {
            "call-bind": "1.0.2",
            "get-intrinsic": "1.2.1",
            "is-regex": "1.1.4"
        },
        "string.prototype.trim : 1.2.7": {
            "call-bind": "1.0.2",
            "define-properties": "1.2.0",
            "es-abstract": "1.22.1"
        },
        "string.prototype.trimend : 1.0.6": {
            "call-bind": "1.0.2",
            "define-properties": "1.2.0",
            "es-abstract": "1.22.1"
        },
        "string.prototype.trimstart : 1.0.6": {
            "call-bind": "1.0.2",
            "define-properties": "1.2.0",
            "es-abstract": "1.22.1"
        },
        "typed-array-buffer : 1.0.0": {
            "call-bind": "1.0.2",
            "get-intrinsic": "1.2.1",
            "is-typed-array": "1.1.12"
        },
        "typed-array-byte-length : 1.0.0": {
            "call-bind": "1.0.2",
            "for-each": "0.3.3",
            "has-proto": "1.0.1",
            "is-typed-array": "1.1.12"
        },
        "typed-array-byte-offset : 1.0.0": {
            "available-typed-arrays": "1.0.5",
            "call-bind": "1.0.2",
            "for-each": "0.3.3",
            "has-proto": "1.0.1",
            "is-typed-array": "1.1.12"
        },
        "typed-array-length : 1.0.4": {
            "call-bind": "1.0.2",
            "for-each": "0.3.3",
            "is-typed-array": "1.1.12"
        },
        "unbox-primitive : 1.0.2": {
            "call-bind": "1.0.2",
            "has-bigints": "1.0.2",
            "has-symbols": "1.0.3",
            "which-boxed-primitive": "1.0.2"
        },
        "which-typed-array : 1.1.11": {
            "available-typed-arrays": "1.0.5",
            "call-bind": "1.0.2",
            "for-each": "0.3.3",
            "gopd": "1.0.1",
            "has-tostringtag": "1.0.0"
        },
        "for-each : 0.3.3": {
            "is-callable": "1.2.7"
        },
        "has-tostringtag : 1.0.0": {
            "has-symbols": "1.0.3"
        },
        "is-date-object : 1.0.5": {
            "has-tostringtag": "1.0.0"
        },
        "is-symbol : 1.0.4": {
            "has-symbols": "1.0.3"
        },
        "functions-have-names : 1.2.3": {},
        "side-channel : 1.0.4": {
            "call-bind": "1.0.2",
            "get-intrinsic": "1.2.1",
            "object-inspect": "1.12.3"
        },
        "isarray : 2.0.5": {},
        "has-bigints : 1.0.2": {},
        "which-boxed-primitive : 1.0.2": {
            "is-bigint": "1.0.4",
            "is-boolean-object": "1.1.2",
            "is-number-object": "1.0.7",
            "is-string": "1.0.7",
            "is-symbol": "1.0.4"
        },
        "is-bigint : 1.0.4": {
            "has-bigints": "1.0.2"
        },
        "is-boolean-object : 1.1.2": {
            "call-bind": "1.0.2",
            "has-tostringtag": "1.0.0"
        },
        "is-number-object : 1.0.7": {
            "has-tostringtag": "1.0.0"
        }
    },
    "hoopVersion": {
        "has": [
            "1.0.3"
        ],
        "call-bind": [
            "1.0.2"
        ],
        "define-properties": [
            "1.2.0"
        ],
        "es-abstract": [
            "1.22.1"
        ],
        "get-intrinsic": [
            "1.2.1"
        ],
        "is-string": [
            "1.0.7"
        ],
        "function-bind": [
            "1.1.1"
        ],
        "has-proto": [
            "1.0.1"
        ],
        "has-symbols": [
            "1.0.3"
        ],
        "has-property-descriptors": [
            "1.0.0"
        ],
        "object-keys": [
            "1.1.1"
        ],
        "array-buffer-byte-length": [
            "1.0.0"
        ],
        "arraybuffer.prototype.slice": [
            "1.0.1"
        ],
        "available-typed-arrays": [
            "1.0.5"
        ],
        "es-set-tostringtag": [
            "2.0.1"
        ],
        "es-to-primitive": [
            "1.2.1"
        ],
        "function.prototype.name": [
            "1.1.5"
        ],
        "get-symbol-description": [
            "1.0.0"
        ],
        "globalthis": [
            "1.0.3"
        ],
        "gopd": [
            "1.0.1"
        ],
        "internal-slot": [
            "1.0.5"
        ],
        "is-array-buffer": [
            "3.0.2"
        ],
        "is-callable": [
            "1.2.7"
        ],
        "is-negative-zero": [
            "2.0.2"
        ],
        "is-regex": [
            "1.1.4"
        ],
        "is-shared-array-buffer": [
            "1.0.2"
        ],
        "is-typed-array": [
            "1.1.12"
        ],
        "is-weakref": [
            "1.0.2"
        ],
        "object-inspect": [
            "1.12.3"
        ],
        "object.assign": [
            "4.1.4"
        ],
        "regexp.prototype.flags": [
            "1.5.0"
        ],
        "safe-array-concat": [
            "1.0.0"
        ],
        "safe-regex-test": [
            "1.0.0"
        ],
        "string.prototype.trim": [
            "1.2.7"
        ],
        "string.prototype.trimend": [
            "1.0.6"
        ],
        "string.prototype.trimstart": [
            "1.0.6"
        ],
        "typed-array-buffer": [
            "1.0.0"
        ],
        "typed-array-byte-length": [
            "1.0.0"
        ],
        "typed-array-byte-offset": [
            "1.0.0"
        ],
        "typed-array-length": [
            "1.0.4"
        ],
        "unbox-primitive": [
            "1.0.2"
        ],
        "which-typed-array": [
            "1.1.11"
        ],
        "for-each": [
            "0.3.3"
        ],
        "has-tostringtag": [
            "1.0.0"
        ],
        "is-date-object": [
            "1.0.5"
        ],
        "is-symbol": [
            "1.0.4"
        ],
        "functions-have-names": [
            "1.2.3"
        ],
        "side-channel": [
            "1.0.4"
        ],
        "isarray": [
            "2.0.5"
        ],
        "has-bigints": [
            "1.0.2"
        ],
        "which-boxed-primitive": [
            "1.0.2"
        ],
        "is-bigint": [
            "1.0.4"
        ],
        "is-boolean-object": [
            "1.1.2"
        ],
        "is-number-object": [
            "1.0.7"
        ]
    }
}

test('findHoopAndShow', () => {
    it('返回值应该与预期结果一致', () => {
        const result = findHoopAndShow(inputData);
        const res = {
            flag: result[0],
            hoop: result[1],
            hoopVersion: result[2]
        }
        expect(res).toStrictEqual(outputData);


    });
});
