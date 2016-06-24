import React, { Component } from 'react';
import DragContainer from './drag/DragContainer.js';

export default class Editor extends Component {

  constructor() {
    super();
    this.state = {
      data: [
        [
          { title: 'R1' },
          { title: 'R2' },
          { title: 'R3' },
          { title: 'R4' },
        ], [
          { title: 'T1' },
          { title: 'T2' },
          { title: 'T3' },
          { title: 'T4' },
        ], [
          { title: 'Large Text2' },
        ], [
          { title: 'Z1' },
          { title: 'Z2' },
          { title: 'Z3' },
          { title: 'Z4' },
        ]
      ]
    };
  }

  getFormData() {
    return this.state.data;
  }

  moveElementToNewRow(sourceRow, sourceColumn, targetRow) {
    var element = _removeElement(sourceRow, sourceColumn);
    this.state.data.splice(targetRow, 0, [element]);
  }

  moveElementToIndex(sourceRow, sourceColumn, targetRow, targetColumn) {
    var element = _removeElement(sourceRow, sourceColumn);
    this.state.data[targetRow].splice(targetColumn, 0, element);
  }

  _removeElement(sourceRow, sourceColumn) {
    var element = this.state.data[sourceRow].splice(sourceColumn, 1)[0];
    if(!this.state.data[sourceRow].length) {
      this.state.data.splice(sourceRow, 1);
    }
    return element;
  }

  render() {
    return <DragContainer editor={this}/>;
  }
}
