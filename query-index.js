'use strict';

const Queryable = require('./lib/queryable');

const query = module.exports = () => new Queryable();

query.Queryable = Queryable;