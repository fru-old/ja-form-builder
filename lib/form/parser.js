
const operatorChars = {
  '!': 1, '-': 1, '+': 1, '*': 1, '/': 1, '%': 1, '<': 1, '=': 1, '>': 1, ',': 1,
  '&': 1, '|': 1, '^': 1, '?': 1, ':': 1, '(': 1, ')': 1, '[': 1, ']': 1
};

const constantStrings = {
  'true': 1, 'false': 1, 'NaN': 1, 'undefined': 1, 'null': 1
};

const keywordStrings = {
  'function': 1, 'window': 1, 'global': 1, 'this': 1, 'eval': 1, 'Function': 1
};

function error(message, start, end) { throw {message, start, end: end || (start + 1)};}
function unexpected(c, i) { error('Unexpected symbol "' + c + '"', i) };

function tokenizePath(path) {

  const START = 0;
  const AFTER_POINT = 1;
  const AFTER_OPERATOR = 2;
  const AFTER_OPERATOR_SPACE = 3;
  const AFTER_QUOTE_START = 4;
  const AFTER_QUOTE_END = 5;
  const AFTER_ESCAPE = 6;
  const AFTER_IDENTIFIER = 7;
  const AFTER_IDENTIFIER_SPACE = 8;
  const AFTER_NUMBER = 9;
  const AFTER_NUMBER_POINT = 10;

  var result = [], last, state = START, quote;

  for (var i = 0; i < path.length; i++) {
    var c = path.charAt(i);

    // Quotes and escaping
    if(c === '\\') {
      if(!quote) unexpected(c, i);
      last.string += c;
      state = AFTER_ESCAPE;
    } else if(c === quote && state !== AFTER_ESCAPE) {
      last.string += c;
      quote = null;
      state = AFTER_QUOTE_END;
    } else if(quote) {
      last.string += c;
    } else if(c === '\'' || c === '\"') {
      if(state === AFTER_POINT) unexpected(c, i);
      if(state === AFTER_NUMBER) unexpected(c, i);
      if(state === AFTER_IDENTIFIER) unexpected(c, i);
      if(state === AFTER_NUMBER_POINT) unexpected(c, i);
      if(state === AFTER_IDENTIFIER_SPACE) unexpected(c, i);
      result.push(last = {string: c});
      quote = c;
      state = AFTER_QUOTE_START;

    // Operators
    } else if(operatorChars[c]) {
      if(state === AFTER_POINT) unexpected(c, i);
      if(state === AFTER_NUMBER_POINT) unexpected(c, i);
      if(state === AFTER_OPERATOR_SPACE) result.push(last = {space: true});
      result.push(last = {operator: c});
      state = AFTER_OPERATOR;
    } else if(/\s/.test(c)) {
      if(state === AFTER_POINT) unexpected(c, i);
      if(state === AFTER_OPERATOR || state === AFTER_OPERATOR_SPACE) {
        state = AFTER_OPERATOR_SPACE;
      } else if(state === AFTER_IDENTIFIER || state === AFTER_IDENTIFIER_SPACE) {
        state = AFTER_IDENTIFIER_SPACE;
      }

    // Identifiers
    } else if(c === '.') {
      if(state === AFTER_OPERATOR && last.operator === ']') {
        result.push({identifier: last = ['']});
        state = AFTER_POINT;
      }
      else if(state === AFTER_IDENTIFIER) { state = AFTER_POINT; last.push(''); }
      else if(state === AFTER_NUMBER) { state = AFTER_NUMBER_POINT; last.number += '.'; }
      else unexpected(c, i);
    } else {
      if(state === AFTER_IDENTIFIER_SPACE) unexpected(c, i);
      if(state === AFTER_QUOTE_END) unexpected(c, i);
      if(state === AFTER_IDENTIFIER || state === AFTER_POINT) {
        last[last.length-1] += c;
        state = AFTER_IDENTIFIER;
      } else if(state === AFTER_NUMBER || state === AFTER_NUMBER_POINT) {
        last.number += c;
        if(isNaN(+last.number)) throw "Not a valid number " + last.number;
        state = AFTER_NUMBER;
      } else if(!isNaN(c)) {
        result.push(last = {number: c});
        state = AFTER_NUMBER;
      } else {
        result.push({identifier: last = [c]});
        state = AFTER_IDENTIFIER;
      }
    }
  }
  return result;
}

function parse(path) {
  var result = tokenizePath(path);

  function recurse(remainder, i) {
    if(remainder[i].operator === '[') {
      var result = getSubExpressionContent(remainder.slice(i+1));
      remainder[i] = {expression: result.expression};
      remainder.splice(i+1, remainder.length - (result.rest + i + 1));
    } else if(remainder[i].identifier) {
      normalizeIdentifier(remainder, i);
    }
  }

  function getSubExpressionContent(remainder) {
    for(var i = 0; i < remainder.length; i++) {
      if(remainder[i].operator === ']') {
        return {rest: remainder.length - i - 1, expression: remainder.slice(0,i)};
      }
      recurse(remainder, i);
    }
    throw "Unexpected ending of path";
  }

  function getIndex(remainder, i) {
    var open = (remainder[i+1] || {}).operator === '[';
    var number = (remainder[i+2] || {}).number;
    var close = (remainder[i+3] || {}).operator === ']';
    if(!open || !close || isNaN(+number)) throw "Expected constant index after " + remainder[i].identifier;
    result.splice(i, 4);
    return +number;
  }

  function normalizeIdentifier(remainder, i) {

    var id = remainder[i];
    var next = remainder[i+1] || {};
    var first = id.identifier[0];

    if(keywordStrings[first] || (constantStrings[first] && id.identifier.length > 1)) {
      throw "Can't use keyword as first part of identifier";
    } else if(constantStrings[first]) {
      remainder[i] = {constant: first};
    }

    if(next.operator === '(') {
      id.function = id.identifier;
      delete id.identifier;

    } else if(first === '$root' || first === '$parent') {
      if(first === '$root') { id.root = '$root'; }
      else if(first === '$parent') { id.root = '$parents'; id.index = 0; }
      id.identifier.shift();

    } else if(first === '$parents') {
      var index = getIndex(remainder, i);
      remainder[i].root = '$parents';
      remainder[i].index = index;

    } else {
      id.root = '$data';
    }
  }

  for(var i = 0; i < result.length; i++) {
    recurse(result, i);
  }

  return result;
}

export default parse;
