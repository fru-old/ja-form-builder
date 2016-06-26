import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';
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
    if(isUndefined(column)) {
      if(highlight.direction !== 0 && highlight.direction !== 2) return;
    } else {
      if(column !== highlight.column) return;
      if(highlight.direction !== 1 && highlight.direction !== 3) return;
    }
    return 'highlight-' + highlight.direction;
  }

  render() {
    return <div id="ja-fb-drag-grid">
      {this.props.elements.map((row, index) => this.renderRow(row, index))}
    </div>
  }

  renderRow(elements, row) {
    return <div key={row} className={this.getHightlightClass(row)}>
      <div className='row'>
        {elements.map((element, column) => this.renderElement(element, row, column))}
      </div>
    </div>;
  }

  renderElement(element, row, column) {
    var params = {className: this.getHightlightClass(row, column), element, row, column};
    return <DragElement key={element.id} {...params} />;
  }
}

const props = (state) => {
  return { elements: state.elements, highlight: state.highlight }
}

export default connect(props)(DragContainer);
