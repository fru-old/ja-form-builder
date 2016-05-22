import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import ItemTypes from './ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';
import classNames from 'classnames';

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move'
};

const cardSource = {
  beginDrag(props) {
    return props;
  }
};

const cardTarget = {
  hover(props, monitor, component) {

    const sideDistance = 15;
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

    const isLeft = hoverClientX <= sideDistance;
    const isRight = hoverClientX >= width - sideDistance;
    const isTop = hoverClientY <= height / 2;

    var direction = 2;
    if(isLeft) direction = 3;
    else if(isRight) direction = 1;
    else if(isTop) direction = 0;

    props.highlight(props.row, props.column, direction);
  },
  drop(props, monitor) {
    props.drop(monitor.getItem(), props);
  }
};

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    isDragging: PropTypes.bool.isRequired,
    highlight: PropTypes.func.isRequired,
    drop: PropTypes.func.isRequired
  };

  render() {
    const { title, isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(connectDropTarget(
        <div style={{opacity}}>
          <span className="action"><i className="material-icons">launch</i></span>
          <span className="description">
            <span className="handler">::::</span>
            {title}
          </span>
        </div>
    ));
  }
}
