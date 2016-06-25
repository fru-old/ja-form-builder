import { createAction, handleActions } from 'redux-actions';
import drag from './drag/drag.js';

const defaults = {
  highlight: {},
  select: {},
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

export default handleActions({
  ...drag.reducer
}, defaults);
