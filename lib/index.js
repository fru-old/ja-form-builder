import $ from 'jquery';
import './jquery.js';
import page1 from './examples/1-Simple/page-1.json';
import React from 'react';
import ReactDOM from 'react-dom';
import Editor from './editor/Editor';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducer from './editor/reducer.js';

const store = createStore(reducer);

function toJsVariableName(name) {
  return name.replace(/\s/g, '_');
}

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

console.log(compilePathSegement('test.test[test]'));

function compilePath(path) {

  // context contains index for repeatables
  return {
    get: function(context) {},
    set: function(context, value) {},
    listen: function(context, callback) {}
  }
}


function compileExpression(expression) {
  return function(values){
    var variables = "";
    for (var key in values) {
      variables += 'var ' + toJsVariableName(key) + ' = values["' + key + '"];';
    }
    return eval(variables + expression);
  }
}

//compileExpression('console.log("test" + x)')({x: 1});
//console.log(compileExpression('"test" + x')({x: 2}));


//console.log(page1);
//var form = $('#main').jaFormBuilder([page1], {first: "initial content"});

/*ReactDOM.render(<Provider store={store}>
  <Editor />
</Provider>, document.getElementById('main'));*/
