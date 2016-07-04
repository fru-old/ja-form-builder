import assignIn from 'lodash/assignIn.js';

function BaseComponent() {}

// layout Properties:
// styling (font-size) properties?
// add classes?

// (Later) Cursor State:
// Max length
// Guid dashes masking and no need to typ dashes
// Invalid chars
// Validation asap

// (Later) History:
// How fine grained: Cursor state

// (Later) Focus // Blur fallback possible?
// Tabbing fallback

// Table expand with embedded form
// Hierarchy - recursive forms - (embedded form)
// Infinite Recursion disallow

// Form State
// Value State
// Hidden State

// Change form state depending on values or even hidden, yes both
// If
// Normal section can be repeated
// TableRow section
// Button outside of section (repeat multiple sections?)

BaseComponent.prototype.initialize = function (wrapper, value, props) {
  this._wrapper = wrapper;
  this._props = props;
  this.create(value);
};

BaseComponent.prototype.setProperties = function (props, invokeRecreate) {
  this._props = props;
  return invokeRecreate();
};

BaseComponent.prototype.extendProperties = function (props, invokeRecreate) {
  this.setProperties(assignIn(this._props, props), invokeRecreate);
};

BaseComponent.prototype.onChange = function (callback) {
  this._onChange = callback;
};

BaseComponent.prototype.onFocus = function (callback) {
  this._onFocus = callback;
};

BaseComponent.prototype.onBlur = function (callback) {
  this._onBlur = callback;
};

BaseComponent.prototype._triggerOnChange = function () {
  if(this._onChange) this._onChange(this.getValue(), this);
};

BaseComponent.prototype._triggerOnFocus = function () {
  if(this._onFocus) this._onFocus(this.getValue(), this);
};

BaseComponent.prototype._triggerOnBlur = function () {
  if(this._onBlur) this._onBlur(this.getValue(), this);
};

module.exports = BaseComponent;
