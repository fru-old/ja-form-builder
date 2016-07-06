import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import classNames from 'classnames';
import { connect } from 'react-redux';
import $ from 'jquery';
import DirectionEnum from './direction.js';
import drag from './dragActions.js';
import editor from '../editorActions.js';

const SIDE_DISTANCE = 15;

const dragElementSource = {
  beginDrag(props) {
    props.dispatch(drag.toogleSelection(null));
    console.log(props);
    return props;
  },
  endDrag(props) {
    props.dispatch(drag.drop(props.element.id));
  }
};

const dragElementTarget = {
  hover(props, monitor, component) {

    var isFullWidth = (monitor.getItem().element || {}).fullWidth || (props.element || {}).fullWidth;

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
      if(hoverClientX <= SIDE_DISTANCE && !isFullWidth) {
        return DirectionEnum.LEFT;
      } else if(hoverClientX >= width - SIDE_DISTANCE && !isFullWidth) {
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
    className: PropTypes.string
  };

  render() {
    return this.props.connectDropTarget(
      <div className="cell">
        <div className={classNames(this.props.className, this.props.element.verticalSpacing && 'verticalSpacing')}>
          <InnerDragElement {...this.props} ref="element"/>
        </div>
      </div>
    );
  }

  componentDidMount() {
    $(findDOMNode(this.refs.element)).on('mousedown tap', () => {
      if(new Date().getTime() - this.lastClick < 300) {
        this.props.dispatch(editor.openElementSettings(this.props.element.id))
        this.lastClick = null;
      } else {
        this.props.dispatch(drag.toogleSelection(this.props.element.id));
        this.lastClick = new Date().getTime();
      }
    });
  }

  componentWillUnmount() {
    $(findDOMNode(this.refs.element)).off('mousedown tap');
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
    const className = classNames('content', this.props.selected && 'active');

    return connectDragSource(
      <div style={{opacity}} className={className}>
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
