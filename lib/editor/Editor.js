import React, { Component } from 'react';
import DragContainer from './drag/DragContainer.js';
import { connect } from 'react-redux';

class Editor extends Component {
  render() {
    return <div>
      Test2 {Object.keys(this.props) + ''}
      <DragContainer />
    </div>;
  }
}

export default connect()(Editor);
