import { createAction } from 'redux-actions';
import remove from 'lodash/remove.js';
import forEach from 'lodash/forEach.js';
import flattenDepth from 'lodash/flattenDepth.js';
import find from 'lodash/find.js';
import map from 'lodash/map.js';
import identity from 'lodash/identity.js';
import update from 'immutability-helper';

const editor = {
  openElementSettings: createAction('EDITOR_OPEN_ELEMENT_SETTINGS')
};

function openElementSettings(state, action) {
  alert(action.payload);
  return update(state, {open: {$set: action.payload}, selected: {$set: action.payload}});
}

editor.reducer = {
  [editor.openElementSettings]: openElementSettings
};

export default editor;
