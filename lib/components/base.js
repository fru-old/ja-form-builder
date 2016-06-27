function BaseComponent() {}

BaseComponent.prototype.setProperties = function (newProps, oldProps, invokeRecreate) {
  return invokeRecreate();
};

BaseComponent.prototype.render = function (React) {
  return null;
};

BaseComponent.prototype.setWrapper = function (wrapper) {
  this.wrapper = wrapper;
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

module.exports = BaseComponent;
