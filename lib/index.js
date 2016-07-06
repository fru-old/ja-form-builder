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

//var form = $('#main').jaFormBuilder([page1], {first: "initial content"});

ReactDOM.render(<Provider store={store}>
  <Editor />
</Provider>, document.getElementById('main'));
