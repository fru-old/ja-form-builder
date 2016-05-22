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


/*
ReactDOM.render(
  <div>
    <ReactWrapper type={SelectizeComponent}/>
    <div id="ja-fb-drag-grid">
      <div className="row-wrapper highlight"><div>
        <div className="row">
          <div className="cell">
            <div className="content"><div>
              <span className="action"><i className="material-icons">launch</i></span>
              <span className="description">
                <span className="handler">::::</span>
                Reach
              </span>
            </div></div>
          </div>
          <div className="cell">
            <div className="content"><div>
              <span className="action">Drop</span>
              <span className="description">
                <span className="handler">::::</span>
                Reach
              </span>
            </div></div>
          </div>
          <div className="cell">
            <div className="content"><div>
              <span className="action"><i className="material-icons">launch</i></span>
              <span className="description">
                <span className="handler">::::</span>
                Reach
              </span>
            </div></div>
          </div>
        </div>
      </div></div>
      <div className="row-wrapper"><div>
        <div className="row">
          <div className="cell">
            <div className="content"><div>
              <span className="description">
                <span className="handler">::::</span>
                Reach
              </span>
            </div></div>
          </div>
        </div>
      </div></div>
    </div>
    {/*<Container/>}
  </div>,
  document.getElementById('main')
);*/
