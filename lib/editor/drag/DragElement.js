import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import $ from 'jquery';
import Direction from './Direction.js'

const SIDE_DISTANCE = 15;

const dragElementSource = {
  beginDrag(props) {
    props.select(props.row, props.column);
    return props;
  },
  endDrag(props) {
    props.drop(props);
  }
};

const dragElementTarget = {
  hover(props, monitor, component) {

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const height = hoverBoundingRect.bottom - hoverBoundingRect.top;
    const width = hoverBoundingRect.right - hoverBoundingRect.left;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientX = clientOffset.x - hoverBoundingRect.left;
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    function getDirection() {
      if(hoverClientX <= SIDE_DISTANCE) {
        return Direction.LEFT;
      } else if(hoverClientX >= width - SIDE_DISTANCE) {
        return Direction.RIGHT;
      } else if(hoverClientY <= height / 2) {
        return Direction.TOP;
      } else {
        return Direction.BOTTOM;
      }
    }

    props.highlight(props.row, props.column, getDirection());
  }
};

@DropTarget('DragElement', dragElementTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource('DragElement', dragElementSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class DragElement extends Component {

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    element: PropTypes.object.isRequired,
    isDragging: PropTypes.bool.isRequired,
    highlight: PropTypes.func.isRequired,
    drop: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired
  };

  render() {
    const { isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(connectDropTarget(
        <div style={{opacity}} className={this.props.selected&&'active'}>
          <span className="description">
            <span className="handler">::::</span>
            {this.props.element.title}
          </span>
        </div>
    ));
  }
}
