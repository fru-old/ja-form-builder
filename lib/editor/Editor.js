import React, { Component } from 'react';
import DragContainer from './drag/DragContainer.js';
import Preview from './preview/Preview.js';
import { connect } from 'react-redux';
import ComponentWrapper from '../components/react.js';
import singleline from '../components/singleline.js';


class Editor extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      prop1: ''
    };
  }

  render() {
    return <div>
      <input value={this.state.value} onChange={(e) => this.setState({value: e.target.value})}/><br/>
      <input value={this.state.prop1} onChange={(e) => this.setState({prop1: e.target.value})}/><br/>
      {this.state.value} {this.state.prop1}<br/>
      <br/>
      <ComponentWrapper type={singleline}/>
      <br/>
      <br/>
      Test2 {Object.keys(this.props) + ''}
      <DragContainer />
      <Preview />
    </div>;
  }
}

export default connect()(Editor);
