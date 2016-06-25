import { createAction } from 'redux-actions';
import direction from './direction.js';
import remove from 'lodash/remove.js';
import forEach from 'lodash/forEach.js';
import flattenDepth from 'lodash/flattenDepth.js';
import find from 'lodash/find.js';

const drag = {
  drop: createAction('DRAG_DROP'),
  highlight: createAction('DRAG_HIGHLIGHT'),
  select: createAction('DRAG_SELECT')
};

function _removeElement(state, id, notRow, notColumn) {
  const removeFilter = (row) => (element, column) => {
    return element.id === id && row !== notRow && column !== notColumn;
  };
  forEach(state.elements, (rowItems, row) => remove(rowItems, removeFilter(row)));
  remove(state.elements, (row) => !row.length);
}

function _getElementById(state, id) {
  return find(flattenDepth(state.elements, 2), {id: id});
}

function drop(state, action) {
  let {row, column, direction} = state.highlight;
  const id = state.payload.id;
  const element = _getElementById(id);

  if(direction === direction.BOTTOM) row++;
  if(direction === direction.RIGHT) column++;

  if(direction === direction.TOP || direction === direction.BOTTOM) {
    state.elements.splice(row, 0, [element]);
    column = 0;
  } else {
    state.elements[row].splice(column, 0, element);
  }
  _removeElement(state, id, row, column);
  state.highlight = {};
}

function highlight(state, action) {
  let {row, column, direction} = state.payload;
  if (direction === Direction.TOP && row > 0) {
    row--;
    direction = Direction.BOTTOM;
  }
  if (direction === Direction.LEFT && column > 0) {
    column--;
    direction = Direction.RIGHT;
  }
  state.highlight = {row, column, direction};
}

function select(state, action) {
  state.selected = state.payload.id;
}

drag.reducer = {
  [drag.drop]: drop,
  [drag.highlight]: highlight,
  [drag.select]: select
};

export default drag;
