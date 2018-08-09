'use strict';

const assert = require('assert');

module.exports = function SkipPlugin(Queryable) {
    //regist 'skip' command to prototype of Queryable
    Queryable.prototype.skip = function() {
        assert(!(this.skips), 'Duplicate SKIP');
        this.skips = [...arguments];
        return this;
    };

    //insert handler to T_2 runtime of Queryable
    Queryable.preset.T_2.push((ctx, res) => {
        if (!(ctx.skips) || !(ctx.skips.length)) return res;
        let index;
        res.every((cur, i, ar) =>
            !ctx.skips.every(skip => skip(cur, i, ar)) ||
            ((index = i) && 0)
        );
        return typeof index === 'undefined' ?
            res : res.slice(index);
    });
};