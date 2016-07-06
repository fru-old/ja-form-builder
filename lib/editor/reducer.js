import { handleActions } from 'redux-actions';
import drag from './drag/dragActions.js';
import editor from './editorActions.js';

const defaults = {
  highlight: {},
  selected: null,
  open: null,
  elements: [
    [
      { id: 1, title: 'R1' },
      { id: 2, title: 'R2' },
      { id: 3, title: 'R3' },
      { id: 4, title: 'R4' },
    ], [
      { id: 5, title: 'T1' },
      { id: 6, title: 'T2' },
      { id: 7, title: 'T3' },
      { id: 8, title: 'T4' },
    ], [
      { id: 9, title: 'Large Text4', fullWidth: true, verticalSpacing: true },
    ], [
      { id: 10, title: 'Z1' },
      { id: 11, title: 'Z2' },
      { id: 12, title: 'Z3' },
      { id: 13, title: 'Z4' },
    ]
  ]
};

export default handleActions({
  ...drag.reducer,
  ...editor.reducer
}, defaults);
