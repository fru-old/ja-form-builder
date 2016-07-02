import $ from 'jquery';
import 'selectize/dist/js/selectize.js';
import 'selectize/dist/css/selectize.css';
import BaseComponent from './base.js';

function SelectizeComponent(value, props) {
  // TODO later
  /**/
};

SelectizeComponent.prototype = new BaseComponent();

SelectizeComponent.prototype.create = function () {
	$('<input type="text" />').appendTo(this.wrapper).selectize({
		persist: false,
		createOnBlur: true,
		create: true
	});
};

SelectizeComponent.prototype.setValue = function (value) {

};

SelectizeComponent.prototype.getValue = function () {

};

SelectizeComponent.prototype.destroy = function () {

};

SelectizeComponent.type = 'Basic Input';
SelectizeComponent.component = 'Dropdown List';
SelectizeComponent.preview = function (React) {
	return <div>test</div>
};

module.exports = SelectizeComponent;
