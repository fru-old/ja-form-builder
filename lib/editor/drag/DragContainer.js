import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';
import classNames from 'classnames';
import isUndefined from 'lodash/isUndefined.js';
import DragElement from './DragElement';
import Direction from './Direction.js'
import './drag.scss';

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
};

@DragDropContext(isTouchDevice() ? TouchBackend({ enableMouseEvents: true }) : HTML5Backend)
export default class DragContainer extends Component {
  constructor(props) {
    super(props);
    this.drop = this.drop.bind(this);
    this.highlight = this.highlight.bind(this);
    this.select = this.select.bind(this);
    this.state = {highlight: {}, selection: {}};
  }

  drop(dragged) {
    let {row, column, direction} = this.state.highlight;

    if(direction === Direction.BOTTOM) row++;
    if(direction === Direction.RIGHT && !(row === dragged.row && column >= dragged.column)) column++;

    if(direction === Direction.TOP || direction === Direction.BOTTOM) {
      this.props.editor.moveElementToNewRow(dragged.row, dragged.column, row);
    } else {
      this.props.editor.moveElementToIndex(dragged.row, dragged.column, row, column);
    }
    this.setState({highlight: {}, selection: {}});
  }

  highlight(row, column, direction) {
    if (direction === Direction.TOP && row > 0) {
      row--;
      direction = Direction.BOTTOM;
    }
    if (direction === Direction.LEFT && column > 0) {
      column--;
      direction = Direction.RIGHT;
    }
    this.setState({highlight: {row, column, direction}});
  }

  select(row, column) {
    this.setState({selection: {row, column}});
  }

  getHightlightClass(row, column) {
    const highlight = this.state.highlight;
    if(row !== highlight.row) return;
    if(column !== highlight.column && !isUndefined(column)) return;
    return 'highlight-' + highlight.direction;
  }

  render() {
    return <div id="ja-fb-drag-grid">
      {this.props.editor.getFormData().map((row, index) => this.renderRow(row, index))}
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
    const selected = this.state.selection.row === row && this.state.selection.column === column;
    return <div key={column} className="cell">
      <div className={className}>
        <DragElement element={element} selected={selected} drop={this.drop} highlight={this.highlight} select={this.select} row={row} column={column} />
      </div>
    </div>;
  }
}
