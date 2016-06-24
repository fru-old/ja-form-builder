import React, { Component } from 'react';
import DragElement from './DragElement';
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';
import classNames from 'classnames';
import Direction from './Direction.js'
import './drag.scss';
import isUndefined from 'lodash/isUndefined.js';

@DragDropContext(HTML5Backend) //TouchBackend({ enableMouseEvents: true }))
export default class DragContainer extends Component {
  constructor(props) {
    super(props);
    this.drop = this.drop.bind(this);
    this.highlight = this.highlight.bind(this);
    this.state = {
      data: this.props.editor.getFormData(), highlightRow: -1, highlightColumn: -1, highlightDirection: -1
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

  getHightlightClass(row, column) {
    if(row !== this.state.highlightRow) return;
    if(column !== this.state.highlightColumn && !isUndefined(column)) return;
    return 'highlight-' + this.state.highlightDirection;
  }

  render() {
    return <div id="ja-fb-drag-grid">
      {this.state.data.map((row, index) => this.renderRow(row, index))}
    </div>
  }

  renderRow(elements, row) {
    const className = classNames('row-wrapper', this.getHightlightClass(row));
    return <div key={row} className={className}>
      <div>
        <div className="row">
          {elements.map((element, column) => this.renderElement(element, row, column))}
        </div>
      </div>
    </div>;
  }

  renderElement(element, row, column) {
    const className = classNames('content', this.getHightlightClass(row, column));
    return <div key={column} className="cell">
      <div className={className}>
        <DragElement element={element} drop={this.drop} highlight={this.highlight} row={row} column={column} />
      </div>
    </div>;
  }
}
