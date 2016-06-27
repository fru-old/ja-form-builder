import React from 'react';
import ReactDOM from 'react-dom';

module.exports = React.createClass({

  render: function () {
    return <div ref="wrapper">{this.type.render(React)}</div>;
  },

  createComponent: function (params) {
    var {type, value, onChange, onFocus, onBlur, ...props} = params;
    var result = new type(value, props);
    if(onChange) result.onChange(onChange);
    if(onFocus) result.onFocus(onFocus);
    if(onBlur) result.onBlur(onBlur);
    return result;
  },

  componentWillMount: function () {
    this.type = this.createComponent(this.props);
  },

  componentDidMount: function () {
    this.type.setWrapper(React.findDOMNode(this.refs.wrapper));
    this.type.create();
  },

  componentWillUnmount: function () {
    this.type.destroy();
  },

  componentWillReceiveProps: function (nextProps) {
    this.type.setProperties(nextProps, this.props, () => {
      this.type.destroy();
      this.type = this.createComponent(nextProps);
      this.type.setWrapper(React.findDOMNode(this.refs.wrapper));
      this.type.create();
    });
  }

});
