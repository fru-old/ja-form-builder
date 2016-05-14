function BaseComponent() {}

BaseComponent.prototype.setProperties = function (newProps, oldProps, invokeRecreate) {
  return invokeRecreate();
};

BaseComponent.prototype.resetValue = function (value) {
  return this.setValue(value);
};

BaseComponent.prototype.onChange = function (callback) {
  this._onChange = callback;
};

BaseComponent.prototype.onFocus = function (callback) {
  this._onFocus = callback;
};

// TODO: Fallback when onBlur is not provided

BaseComponent.prototype.onBlur = function (callback) {
  this._onBlur = callback;
};

module.exports = BaseComponent;
