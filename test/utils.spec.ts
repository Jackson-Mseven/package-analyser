import { describe, expect, it, test } from 'vitest'
import { resolve } from 'path';
import { checkVersion, nameVersionStringify, nameVersionParse, isNumberStr, dependHash_To_nameVersionsObj } from '../lib/analysisDepend/utils'
import { dependHash_To_nameVersionsObjData } from '../lib/analysisDepend/utilsMock'

test('utils', () => {
    it('checkVersion: ^1.1.1 || ~2.2.2中, 1.15合法, 3.15不合法', () => {
        const checkResult1 = checkVersion('^1.1.1 || ~2.2.2', '1.1.5');
        expect(checkResult1).toEqual(true);
        const checkResult2 = checkVersion('^1.1.1 || ~2.2.2', '3.1.5');
        expect(checkResult2).toEqual(false);
    });

    it('nameVersionStringify: {name:"eslint",version:"^^8.46.0"}"名字版本号字符化为eslint: "^8.46.0" ', () => {
        const result = nameVersionStringify("eslint", "^8.46.0");
        expect(result).toEqual(`eslint : ^8.46.0`)
    });
    it('nameVersionParse: "eslint-plugin-n : ^16.0.1"应解析为{name:"eslint-plugin-n",version:"^16.0.1"}', () => {
        const result = nameVersionParse("eslint-plugin-n : ^16.0.1");

        expect(result).toContain({ name: "eslint-plugin-n", version: "^16.0.1" });
    })

    it('isNumberStr: 区分数字和字符串，前者应返回true后者应返回false', () => {
        expect(isNumberStr('1234')).toEqual(true);
        expect(isNumberStr('1234abc')).toEqual(false);
    });
    it('dependHash_To_nameVersionsObj: 返回结果应与预期数据一致', () => {
        const result = dependHash_To_nameVersionsObj(dependHash_To_nameVersionsObjData.params[0]);
        expect(result).toStrictEqual(dependHash_To_nameVersionsObjData.return)
    })
})

