
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

export default function (path) {

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
      i++;
      var exp = compileSubExpression(path.substr(i));
      i += exp.index;
      result.push({ expression: exp.expression});
    } else {
      if(state === AFTER_EXPRESSION) throw 'Unexpected symbol ' + c + ' at ' + i;
      if(state !== AFTER_IDENTIFIER) result.push(current = { identifier: '' });
      state = AFTER_IDENTIFIER;
      current.identifier += c;
    }
  }
  return result;
};
