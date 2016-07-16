
function compilePath(path) {

  var START = 0;
  var AFTER_POINT = 1;
  var AFTER_EXPRESSION = 2;
  var AFTER_IDENTIFIER = 3;

  var result = [], current, state = START;

  for (var i = 0; i < path.length; i++) {
    var c = path.charAt(i);

    if(c === '.') {
      if(state === START || state === AFTER_POINT) throw 'Unexpected symbol "." at ' + i;
      state = AFTER_POINT;
    } else if(c === '[') {
      if(state === AFTER_POINT) throw 'Unexpected symbol "[" at ' + i;
      state = AFTER_EXPRESSION;
      var exp = compileSubExpression(path.substr(i));
      i += exp.index;
      result.push({ exp: exp.expression});
    } else {
      if(state === AFTER_EXPRESSION) throw 'Unexpected symbol ' + c + ' at ' + i;
      if(state !== AFTER_IDENTIFIER) current = result[result.length] = { val: '' };
      state = AFTER_IDENTIFIER;
      current.val += c;
    }
  }
  return result;
}

function compileSubExpression(path) {
  var expectClosingQuote = '';
  var expectQuotedChar = false;
  var expectClosingSquareBracketCount = 1;

  for (var i = 0; i < path.length; i++) {
    var c = path.charAt(i);

    if(expectClosingQuote) {
      if(c === '\\') expectQuotedChar = true;
      else {
        if(!expectQuotedChar && c === expectClosingQuote) expectClosingQuote = '';
        expectQuotedChar = false;
      }
    } else {
      if(c === '\'' || c === '\"') expectClosingQuote = c;
      if(c === '[') expectClosingSquareBracketCount++;
      if(c === ']') expectClosingSquareBracketCount--;
      if(!expectClosingSquareBracketCount) {
        return { index: i, expression: path.substr(0,i) };
      }
    }
  }
  throw 'Unexpected end of expression: ' + path;
}

console.log(JSON.stringify(compilePath("['sadasdasd'].Test 1234b.[['sas\\'asd\" a[]sdasdasd'].xyz + 4].[$index]")));


function compilePathSegement(path, isSubExpression) {

  var result = [], state = 0, current, quote;

  function other(c, inQuote) {
    if(inQuote) return c !== '\\' && c !== quote;
    return c !== '.' && c !== '[' && c !== ']' && c !== '\\' && c !== '\'' && c !== '"';
  }

  for (var i = 0; i < path.length; i++) {
    var c = path.charAt(i);

    // Input: test.test
    // State: 0t 2e 2s 2t 2. 1t 2e 2s 2t -> 2
    if((state === 0 || state === 1) && other(c)) {
      current = result[result.length] = {value: c}; state = 2;
    }
    else if(state === 2 && other(c)) { current.value += c; }
    else if(state === 2 && c === '.') { state = 1; }

    // Input: a['bc']
    // State: 0a 2[ 3' 4b 5c 5' 6] -> 7
    else if(state === 2 && c === '[') { state = 3; }
    else if(state === 3 && (c === '\'' || c === '"')) {
      current = result[result.length] = {value: c}; state = 4; quote = c;
    }
    else if((state === 4 || state === 5) && other(c, true)) { state = 5; current.value += c; }
    else if(state === 5 && c === quote) { state = 6; current.value += c; }
    else if(state === 6 && c === ']') { state = 7; }

    // Character ']' can only be followed by '[' or '.'
    else if(state === 7 && c === '[') { state = 3; }
    else if(state === 7 && c === '.') { state = 1; }

    // Input: a['\'']
    // State: 0a 2[ 3' 4\ 8' 5' 6] -> 7
    else if((state === 4 || state === 5) && c === '\\') { state = 8; current.value += c; }
    else if(state === 8) { state = 5; current.value += c; }

    // Support sub expressions
    else if(state === 3 && other(c)) {
      var segment = compilePathSegement(path.substr(i), true);
      i += segment.index;
      result.push(segment.segment);
      state = 7;
    }
    else if((state === 2 || state === 7) && c === ']' && isSubExpression) {
      return { index: i, segment: {sub: result} };
    }
    else {
      throw 'Unexpected symbol ' + c + ' at ' + i;
    }
  }

  if((state !== 2 && state !== 7) || isSubExpression) {
    throw 'Unexpected end of string';
  }

  return { result };
}
