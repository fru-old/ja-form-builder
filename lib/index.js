import React from 'react';
import ReactDOM from 'react-dom';
import SelectizeComponent from './components/selectize.js';
import ReactWrapper from './components/react.js';
import './editor/tile.scss';
import Container from './sortable/Container';

ReactDOM.render(
  <div>
    <ReactWrapper type={SelectizeComponent}/>
    <div className="component-tile">
      <h3>Test Icon</h3>
      <span><span>Ziehen</span></span>
      <Container />
      <div className="content"><br/><br/><br/><br/></div>
    </div>
  </div>,
  document.getElementById('main')
);
