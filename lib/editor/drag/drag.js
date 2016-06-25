import { createAction } from 'redux-actions';
import direction from './direction.js';

const drag = {
  drop: createAction('DRAG_DROP'),
  highlight: createAction('DRAG_HIGHLIGHT'),
  select: createAction('DRAG_SELECT')
};

drag.reducer = {

  [drag.drop]: function(state, action) {
    let {row, column, direction} = state.highlight;
    const {targetRow: row, targetColumn: column} = action.payload;

    if(direction === direction.BOTTOM) row++;
    if(direction === direction.RIGHT && !(row === targetRow && column >= targetRow)) column++;

    if(direction === direction.TOP || direction === direction.BOTTOM) {
      this.props.editor.moveElementToNewRow(targetRow, targetColumn, row);
    } else {
      this.props.editor.moveElementToIndex(targetRow, targetColumn, row, column);
    }
    state.highlight = {};
    state.selection = {};
  },

  [drag.highlight]: function(state, action) {

  },

  [drag.select]: function(state, action) {

  }
};

export default drag;
