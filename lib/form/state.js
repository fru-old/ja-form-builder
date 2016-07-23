import parse from './parser.js';
import isString from 'lodash/isString.js';
import isArray from 'lodash/isArray.js';
import isNumber from 'lodash/isNumber.js';
import map from 'lodash/map.js';
import bind from 'lodash/bind.js';

function parsePathSegment(segment) {
  if(isArray(segment)) return map(segment, parsePathSegment);
  if(isString(segment)) return parse(segment);
  if(isNumber(segment)) return [{index: segment}];
  throw "Unexpected type " + (typeof segment);
}

function subContextGet() {

}

function subContextSet() {

}

function subContextListen() {

}

function buildSubContext(segment, rootpath, context) {
  var path = rootpath.concat(parsePathSegment(segment));
  var result = function(segment) { return buildSubContext(segment, path, context); };
  var subContext = { context, path };
  result.get = bind(subContextGet, subContext);
  result.set = bind(subContextSet, subContext);
  result.exec = bind(subContextExec, subContext);
  result.listen = bind(subContextListen, subContext);
  return result;
}

function Context() {
  this._data = {};
  this._directParent = null; // so that previous contexts can be detached???
  // But what about $parent.test // that can not be so easily detached because it is no subtree!!!
}
Context.prototype.path = function(segment) { return buildSubContext(segment, [], this); };
Context.prototype.exec = function(form, parameter) {};

// context used in:
// expression properties e.g. $if
// => But complex expressions are difficult to parse
// => Single object that describes alle context (hidden, output, $buildin)
// => Readonly, unless programatic set

// programaticaly: path('t')('t').get();
// path => can use programatic api

// Every element has a context => which has a path => How to remove state from the single global object after path changes?
export default Context;
