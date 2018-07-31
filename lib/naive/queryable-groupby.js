/**
 * 原生插件queryable-groupby，用于演示插件注入运行时的步骤。
 * 注意对插件命名，可以在Queryable.plugins查阅安装的插件。
 * Alex liao @2018-7-31 
 */
'use strict';

const assert = require('assert');

module.exports = function GroupbyPlugin(Queryable) {
    //step 1: regist groupby command to prototype of Queryable
    Queryable.prototype.groupby = function() {
        assert(!(this.groups), 'Duplicate GROUPBY');
        this.groups = [].slice.call(arguments);
        return this;
    };
    //step 2: insert hook handler to T_1 runtime of Queryable
    Queryable.preset.T_1.unshift((ctx, res) => {
        if (!(ctx.groups)) return res;
        return [
            [], ...res
        ].reduce((ar, cur, i) => {
            [ar, ...ctx.groups].reduce((domain, group) => {
                const key = group(cur, i - 1, res);
                let _ = [];
                return domain.every(cur =>
                    !(cur[0] === key && (_ = cur[1]))
                ) ? (domain.push([key, _]) && _) : _;
            }).push(cur);
            return ar;
        });
    });
};