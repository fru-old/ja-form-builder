import React from 'react';
import ReactDOM from 'react-dom';
import SelectizeComponent from './components/selectize.js';
import ReactWrapper from './components/react.js';
import './editor/tile.scss';
import Container from './sortable/Container';
import classNames from 'classnames';

ReactDOM.render(<div>
  <Container/>
</div>, document.getElementById('main'));
