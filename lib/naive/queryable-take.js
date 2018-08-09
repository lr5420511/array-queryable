'use strict';

const assert = require('assert');

module.exports = function TakePlugin(Queryable) {
    Queryable.prototype.take = function() {
        assert(!(this.takes), 'Duplicate TAKE');
        this.takes = [...arguments];
        return this;
    };

    Queryable.preset.T_2.push((ctx, res) => {
        if (!(ctx.takes) || !(ctx.takes.length)) return res;
        let index;
        for (let i = res.length - 1; i >= 0; i--) {
            const vaild = ctx.takes.every(take =>
                take(res[i], i, res)
            ) && ((index = i) || 1);
            if (vaild) break;
        }
        return typeof index === 'undefined' ?
            res : res.slice(0, index + 1);
    });
};