import $ from 'jquery';
import BaseComponent from './base.js';
import 'jquery-splendid-textchange';

function SingleLineComponent(wrapper, value, props) {
	this.initialize(wrapper, value, props);
};

SingleLineComponent.prototype = new BaseComponent();

SingleLineComponent.prototype.create = function (value) {
	this._input = $('<input type="text" />').appendTo(this._wrapper);
  $(this._input).on('textchange', () => this._triggerOnChange());
  $(this._input).on('focus', () => this._triggerOnFocus());
  $(this._input).on('blur', () => this._triggerOnBlur());
  this.setValue(value);
};

SingleLineComponent.prototype.setValue = function (value) {
	$(this._input).val(value);
};

SingleLineComponent.prototype.getValue = function () {
	return $(this._input).val();
};

SingleLineComponent.prototype.destroy = function () {
	$(this._wrapper).empty();
};

SingleLineComponent.type = 'Basic Input';
SingleLineComponent.component = 'Dropdown List';
SingleLineComponent.preview = function (React) {
	return <div>test</div>
};

module.exports = SingleLineComponent;
