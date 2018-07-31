'use strict';

const assert = require('assert');

module.exports = function OrderbyPlugin(Queryable) {
    Queryable.prototype.orderby = function() {
        assert(!(this.orders), 'Duplicate ORDERBY');
        this.orders = [].slice.call(arguments);
        return this;
    };
    /**
     * 与之前的插件不同，本插件callback注入T_2运行时。
     * 这意味着注入代码片段将在映射之后，结果返回之前执行。
     */
    Queryable.preset.T_2.unshift((ctx, res) => {
        if (!(ctx.orders) || !ctx.orders.length) return res;
        return res.sort((prev, cur) =>
            ctx.orders.every(order => !order(prev, cur)) ? -1 : 1
        );
    });
};