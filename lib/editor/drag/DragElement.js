import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import $ from 'jquery';
import DirectionEnum from './direction.js';
import drag from './drag.js';

const SIDE_DISTANCE = 15;

const dragElementSource = {
  beginDrag(props) {
    props.dispatch(drag.select(props.id));
    return props;
  },
  endDrag(props) {
    props.dispatch(drag.drop(props.element.id));
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
        return DirectionEnum.LEFT;
      } else if(hoverClientX >= width - SIDE_DISTANCE) {
        return DirectionEnum.RIGHT;
      } else if(hoverClientY <= height / 2) {
        return DirectionEnum.TOP;
      } else {
        return DirectionEnum.BOTTOM;
      }
    }

    const highlight = {row: props.row, column: props.column, direction: getDirection()};
    props.dispatch(drag.highlight(highlight));
  }
};

@DropTarget('DragElement', dragElementTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
class DragElement extends Component {

  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    element: PropTypes.object.isRequired,
    className: PropTypes.string.isRequired
  };

  render() {
    return this.props.connectDropTarget(
      <div className='outer-content'>
        <div className={this.props.className}>
          <InnerDragElement {...this.props}/>
        </div>
      </div>
    );
  }
}

@DragSource('DragElement', dragElementSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class InnerDragElement extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    element: PropTypes.object.isRequired,
    isDragging: PropTypes.bool.isRequired
  };

  render() {
    const { isDragging, connectDragSource } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(
      <div style={{opacity}} className={this.props.selected && 'active'}>
        <span className="description">
          <span className="handler">::::</span>
          {this.props.element.title}
        </span>
      </div>
    );
  }
}

const props = (state, props) => {
  return { selected: state.selected === props.element.id }
}

export default connect(props)(DragElement);
