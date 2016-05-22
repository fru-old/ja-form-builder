import React from 'react';
import ReactDOM from 'react-dom';
import SelectizeComponent from './components/selectize.js';
import ReactWrapper from './components/react.js';
import './editor/tile.scss';
import Container from './sortable/Container';
import classNames from 'classnames';

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

function normalize(data) {
  return data.map( value => {
    if (!value.length) value = [value];
    value.forEach( x => x.id = x.id || guid() );
    return value;
  });
}

var data = normalize([
  [
    { title: 'Input' },
    { title: 'Select' },
    { title: 'Number', isDragging: true }
  ],
  { title: 'Large Text' }
]);

function draw(data, hightlightRow, hightlightColumn, highlightDirection) {
  // Normalize highlight parameters
  if (highlightDirection === 0 && hightlightRow > 0) {
    hightlightRow--;
    highlightDirection = 2;
  }
  if (highlightDirection === 3 && hightlightColumn > 0) {
    hightlightColumn--;
    highlightDirection = 1;
  }
  return <div id="ja-fb-drag-grid">
    {data.map((row, index) => drawRow(row, index, hightlightRow, hightlightColumn, highlightDirection))}
  </div>;
}

function drawRow(row, index, hightlightRow, hightlightColumn, highlightDirection) {
  var highlight = index === hightlightRow && ('highlight-' + highlightDirection);
  var content = row.map((item, indexColumn) => {
    return drawItem(item, indexColumn === hightlightColumn && highlight);
  });
  return <div key={index} className={classNames('row-wrapper', highlight)}><div>
    <div className="row">
      {content}
    </div>
  </div></div>;
}

function drawItem(item, direction) {
  return <div className="cell" key={item.id}>
    <div className={classNames('content', direction)}><div>
      <span className="action"><i className="material-icons">launch</i></span>
      <span className="description">
        <span className="handler">::::</span>
        {item.title}
      </span>
    </div></div>
  </div>;
}

ReactDOM.render(<div>
  {draw(data, 1, 0, 0)}
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
