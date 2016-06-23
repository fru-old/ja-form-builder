import React, { Component } from 'react';
import update from 'react/lib/update';
import Card from './Card';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
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
    { title: 'R1' },
    { title: 'R2' },
    { title: 'R3' },
    { title: 'R4' },
  ],
  [
    { title: 'T1' },
    { title: 'T2' },
    { title: 'T3' },
    { title: 'T4' },
  ],
  { title: 'Large Text' },
  [
    { title: 'Z1' },
    { title: 'Z2' },
    { title: 'Z3' },
    { title: 'Z4' },
  ]
]);

@DragDropContext(HTML5Backend) //TouchBackend({ enableMouseEvents: true })
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.drop = this.drop.bind(this);
    this.highlight = this.highlight.bind(this);
    this.state = {
      data: data, highlightRow: -1, highlightColumn: -1, highlightDirection: -1
    };
  }

  drop(dragged) {

    var rowArray = this.state.data[dragged.row];
    var element = rowArray[dragged.column];
    rowArray.splice(dragged.column, 1);
    var direction = this.state.highlightDirection;
    var row = this.state.highlightRow;
    var column = this.state.highlightColumn;

    if(direction === 2) row++;
    if(direction === 1 && !(row === dragged.row && column >= dragged.column)) column++;

    if(direction === 0 || direction === 2) {
      this.state.data.splice(row, 0, [element]);
    } else {
      this.state.data[row].splice(column, 0, element);
    }

    for(var i = 0; i < this.state.data.length; i++) {
      if(!this.state.data[i].length) this.state.data.splice(i, 1);
    }
    console.log(this.state.data);
    //console.log(this.state.data);
    // remove dragged
    // if(highlightDirection)
    this.setState({highlightRow: -1, highlightColumn: -1, highlightDirection: -1});
  }

  highlight(highlightRow, highlightColumn, highlightDirection) {
    if (highlightDirection === 0 && highlightRow > 0) {
      highlightRow--;
      highlightDirection = 2;
    }
    if (highlightDirection === 3 && highlightColumn > 0) {
      highlightColumn--;
      highlightDirection = 1;
    }
    this.setState({highlightRow, highlightColumn, highlightDirection});
  }

  drawRow(row, index, highlightRow, highlightColumn, highlightDirection) {
    var highlightClass = index === highlightRow && ('highlight-' + highlightDirection);
    var {drop, highlight} = this;
    return <div key={index} className={classNames('row-wrapper', highlightClass)}><div>
      <div className="row">
        {row.map((item, indexColumn) => {
          var direction = indexColumn === highlightColumn && highlightClass;
          return <div className="cell" key={item.id}>
            <div className={classNames('content', direction)}>
              <Card key={indexColumn} title={item.title} drop={drop} highlight={highlight} column={indexColumn} row={index} />
            </div>
          </div>;
        })}
      </div>
    </div></div>;
  }

  render() {
    var {highlightRow, highlightColumn, highlightDirection, data} = this.state;
    return <div id="ja-fb-drag-grid">
      {data.map((row, index) => this.drawRow(row, index, highlightRow, highlightColumn, highlightDirection))}
    </div>
  }
}
