import $ from 'jquery';
import 'selectize/dist/js/selectize.js';
import 'selectize/dist/css/selectize.css';
import BaseComponent from './base.js';

/*
$(function(){

})*/

function SelectizeComponent(wrapper, value, props) {
  this.wrapper = wrapper;
  $('<input type="text"/>').appendTo(wrapper).selectize({
	    persist: false,
	    createOnBlur: true,
	    create: true
	});
};

SelectizeComponent.prototype = new BaseComponent();

SelectizeComponent.prototype.setValue = function (value) {

};

SelectizeComponent.prototype.destroy = function () {

};

SelectizeComponent.type = 'Basic Input';
SelectizeComponent.component = 'Dropdown List';
SelectizeComponent.preview = function (React) {
	return <div>test</div>
};

module.exports = SelectizeComponent;
