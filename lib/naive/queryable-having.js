/**
 * 原生插件queryable-having，用于演示插件注入运行时的步骤
 * Alex liao @2018-7-31 
 */
'use strict';

module.exports = function HavingPlugin(Queryable) {
    //add having command to prototype of Queryable
    Queryable.prototype.having = function() {
        if (!(this.haves)) this.haves = [];
        this.haves.push([...arguments]);
        return this;
    };
    //to T_1 runtime of Queryable
    Queryable.preset.T_1.push((ctx, res) => {
        if (!(ctx.haves)) return res;
        return res.filter((cur, i, ar) =>
            ctx.haves.every(have => !have.every(vailder =>
                !vailder(cur, i, ar)
            ))
        );
    });
};