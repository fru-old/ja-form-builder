import React, { Component } from 'react';
import { connect } from 'react-redux';
import './preview.scss';

class Preview extends Component {

  render() {
    return <div id="ja-fb-drag-preview">
      {this.props.elements.map((row, index) => this.renderRow(row, index))}
    </div>
  }

  renderRow(elements, row) {
    return <div key={row}>
      <div className='row'>
        {elements.map((element, column) => this.renderElement(element, row, column))}
      </div>
    </div>;
  }

  renderElement(element, row, column) {
    var params = {element, row, column};
    return <div key={element.id} className='cell'>{element.title}</div>
  }
}

const props = (state) => {
  return { elements: state.elements }
}

export default connect(props)(Preview);
