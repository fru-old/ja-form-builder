import { createAction } from 'redux-actions';
import DirectionEnum from './direction.js';
import remove from 'lodash/remove.js';
import forEach from 'lodash/forEach.js';
import flattenDepth from 'lodash/flattenDepth.js';
import find from 'lodash/find.js';
import map from 'lodash/map.js';
import identity from 'lodash/identity.js';
import update from 'immutability-helper';

const drag = {
  drop: createAction('DRAG_DROP'),
  highlight: createAction('DRAG_HIGHLIGHT'),
  select: createAction('DRAG_SELECT')
};

function _copyElementsArraysInState(state) {
  let elements = state.elements;
  elements = map(elements, (row) => map(row, identity) );
  return update(state, {elements: {$set: elements}});
}

function _removeElement(state, id, notRow, notColumn) {
  const removeFilter = (row) => (element, column) => {
    return element.id === id && (row !== notRow || column !== notColumn);
  };
  forEach(state.elements, (rowItems, row) => remove(rowItems, removeFilter(row)));
  remove(state.elements, (row) => !row.length);
}

function _getElementById(state, id) {
  return find(flattenDepth(state.elements, 2), {id: id});
}

/**
 *
 */
function drop(state, action) {
  let {row, column, direction} = state.highlight;
  const id = action.payload;
  const element = _getElementById(state, id);

  if(direction === DirectionEnum.BOTTOM) row++;
  if(direction === DirectionEnum.RIGHT) column++;

  state = _copyElementsArraysInState(state);
  if(direction === DirectionEnum.TOP || direction === DirectionEnum.BOTTOM) {
    state.elements.splice(row, 0, [element]);
    column = 0;
  } else {
    state.elements[row].splice(column, 0, element);
  }

  _removeElement(state, id, row, column);
  state.highlight = {};
  return state;
}

/**
 *
 */
function highlight(state, action) {
  let {row, column, direction} = action.payload;
  if (direction === DirectionEnum.TOP && row > 0) {
    row--;
    direction = DirectionEnum.BOTTOM;
  }
  if (direction === DirectionEnum.LEFT && column > 0) {
    column--;
    direction = DirectionEnum.RIGHT;
  }
  return update(state, {highlight: {$set: {row, column, direction}}});
}

/**
 *
 */
function select(state, action) {
  return update(state, {selected: {$set: action.payload}});
}

drag.reducer = {
  [drag.drop]: drop,
  [drag.highlight]: highlight,
  [drag.select]: select
};

export default drag;
