'use strict';

const OrderbyWare = require('./naive/queryable-orderby');
const GroupbyWare = require('./naive/queryable-groupby');
const HavingWare = require('./naive/queryable-having');

/**
 * 插件注册顺序应该引起注意。
 * 查询执行时，如果不同插件之间注册了相同的生命阶段，那么注入的函数会按照注册插件时的顺序同步执行。
 */
module.exports = [GroupbyWare, HavingWare, OrderbyWare];