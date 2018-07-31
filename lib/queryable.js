/**
 * Alex liao @2018-7-31
 * 
 * 集合处理工具，支持插件机制拓展工具运行时，工具初步支持过滤，映射功能。
 * 原生插件（path: ./naive）支持分组，分组过滤以及排序功能。
 * 
 * 添加更多插件到文件夹（path: ./extend）下，丰富工具运行时。
 * 扩展插件写法参见文件夹（path: ./naive）下原生插件。
 */

'use strict';

const assert = require('assert');

const Queryable = module.exports = function() {
    this.source = null;
    this.filters = []; //运行时过滤功能callbacks
    this.mappers = null; //运行时映射功能callbacks
};

Queryable.prototype = {
    constructor: Queryable,
    from: function() {
        assert(!(this.source), 'Duplicate FROM');
        //将多个数据源合并为一个
        this.source = [...arguments].reduce((prev, cur) =>
            prev.map(me => cur.map(cur =>
                Array.isArray(me) ? [...me, cur] : [me, cur]
            )).reduce((prev, cur) => prev.concat(cur))
        );
        return this;
    },
    where: function() {
        this.filters.push([...arguments]);
        return this;
    },
    select: function() {
        assert(!(this.mappers), 'Duplicate SELECT');
        this.mappers = [].slice.call(arguments);
        return this;
    },
    emit: function(callbacks, ar) {
        return [ar, ...callbacks].reduce((res, callback) =>
            callback(this, res)
        );
    },
    execute: function() {
        let res = this.source;
        if (!res) return [];
        const pre = Queryable.preset;
        res = this.emit(pre.T_0, res); //T_0 hook point, 执行注入该点的callbacks
        res = res.filter((cur, i, ar) =>
            this.filters.every(vailders =>
                !vailders.every(vailder => !vailder(cur, i, ar))
            )
        );
        res = this.emit(pre.T_1, res); //T_1 hook point
        res = this.mappers ? [res, ...this.mappers].reduce((ar, callback) =>
            ar.map((cur, i, ar) => callback(cur, i, ar))
        ) : res;
        return this.emit(pre.T_2, res); //T_2 hook point
    }
};

Queryable.preset = {
    T_0: [], //execute begin filter
    T_1: [], //execute begin map
    T_2: [] //execute begin return
};

//install plugins
Queryable.plugins = require('./config').filter(plugin =>
    plugin(Queryable) || true
);