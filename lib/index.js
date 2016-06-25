import React from 'react';
import ReactDOM from 'react-dom';
import Editor from './editor/Editor';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducer from './editor/reducer.js';

const store = createStore(reducer);

ReactDOM.render(<Provider store={store}>
  <Editor />
</Provider>, document.getElementById('main'));
