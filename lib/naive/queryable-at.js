'use strict';

const assert = require('assert');

module.exports = function AtPlugin(Queryable) {
    //regist 'at' command to prototype of Queryable
    Queryable.prototype.at = function() {
        assert(!(this.ats), 'Duplicate AT');
        this.ats = [...arguments];
        return this;
    };

    //insert handler to T_2 runtime of Queryable
    Queryable.preset.T_2.push((ctx, res) => {
        if (!(ctx.ats)) return res;
        let val = null;
        res.every((cur, i, ar) =>
            !ctx.ats.every(at => at(cur, i, ar)) ||
            ((val = cur) && 0)
        );
        return val;
    });
};