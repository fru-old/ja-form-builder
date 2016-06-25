import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';
import classNames from 'classnames';
import isUndefined from 'lodash/isUndefined.js';
import DragElement from './DragElement';
import { connect } from 'react-redux';
import './drag.scss';

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
}

@DragDropContext(isTouchDevice() ? TouchBackend({ enableMouseEvents: true }) : HTML5Backend)
class DragContainer extends Component {

  getHightlightClass(row, column) {
    const highlight = this.props.highlight;
    if(row !== highlight.row) return;
    if(column !== highlight.column && !isUndefined(column)) return;
    return 'highlight-' + highlight.direction;
  }

  render() {
    return <div id="ja-fb-drag-grid">
      {this.props.elements.map((row, index) => this.renderRow(row, index))}
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
    return <div key={element.id} className="cell">
        <DragElement className={className} element={element} row={row} column={column} />
    </div>;
  }
}

const props = (state) => {
  return { elements: state.elements, highlight: state.highlight }
}

export default connect(props)(DragContainer);
