import React, { Component } from 'react';
import DragContainer from './drag/DragContainer.js';

function _removeElement(data, sourceRow, sourceColumn) {
  return data[sourceRow].splice(sourceColumn, 1)[0];
}

function _removeEmptyRows(data) {
  for(var i = 0; i < data.length; i++) {
    if(!data[i].length) data.splice(i, 1);
  }
}

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
          { title: 'Large Text4' },
        ], [
          { title: 'Z1', active: true },
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
    var element = _removeElement(this.state.data, sourceRow, sourceColumn);
    this.state.data.splice(targetRow, 0, [element]);
    _removeEmptyRows(this.state.data);
  }

  moveElementToIndex(sourceRow, sourceColumn, targetRow, targetColumn) {
    var element = _removeElement(this.state.data, sourceRow, sourceColumn);
    this.state.data[targetRow].splice(targetColumn, 0, element);
    _removeEmptyRows(this.state.data);
  }

  render() {
    return <DragContainer editor={this}/>;
  }
}
