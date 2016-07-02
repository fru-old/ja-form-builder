import assignIn from 'lodash/assignIn.js';

function BaseComponent() {}

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
