
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

  // Check identifiers and assign context
  for(var i = 0; i < result.length; i++) {
    var identifier = result[i].identifier;
    if(identifier) {
      var first = identifier[0];
      if(keywordStrings[first] || (constantStrings[first] && identifier.length > 1)) {
        throw "Can't use keyword as first part of identifier";
      } else if(constantStrings[first]) {
        result[i] = {constant: first};
        continue;
      }

      function getIndex() {
        var open = (result[i+1] || {}).operator === '[';
        var number = (result[i+2] || {}).number;
        var close = (result[i+3] || {}).operator === ']';
        if(!open || !close || isNaN(+number)) throw "Expected constant index after " + first;
        result.splice(i, 4);
        return +number;
      }

      var r = result[i];
      if(first === '$root' || first === '$parent') {
        if(first === '$root') { r.root = '$root'; }
        else if(first === '$parent') { r.root = '$parents'; r.index = 0; }
        identifier.shift();
      }
      else if(first === '$parents') {
        var index = getIndex();
        result[i].root = '$parents';
        result[i].index = index;
      }
      else {
        r.root = '$data';
      }
    }
  }

  // Parse Subexpressions and functions
  for(var i = 0; i < result.length; i++) {
    function recurse() {
      var name = result[i] || {};
      var next = result[i+1] || {};
      var start = i;
      if(next.operator === '[') {
        i++;
        for(; i < result.length; i++) {
          if(result[i].operator === ']') {

            recurse();
            return;
          } else if(result[i].identifier) recurse();
        }
      } else if(next.operator === '(') {
        result[i] = name = {call: name.identifier, args: []};
        i++;
        for(; i < result.length; i++) {
          if(result[i].operator === ')' || result[i].operator === ',') {
            if(start + 2 !== i) name.args.push(result.slice(start + 2, i));
            console.log(JSON.stringify(result, null, 2));
            result.splice(start + 1, i - start);


            //console.log(JSON.stringify(result.slice(start + 1, i + 1), null, 2));

            console.log(JSON.stringify(result, null, 2));
            console.log(i);
            console.log(i - start);
            i -= (i - start + 1);
            //console.log(i)
            //console.log(i);
            recurse();
            if(result[i].operator === ')') return;
          } else if(result[i].identifier) recurse();
        }
      } else return;
      throw "Unexpected ending of path";
    }
    if(result[i].identifier) recurse();
  }


  return result;
}

export default parse;
