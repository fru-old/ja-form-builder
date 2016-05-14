import React from 'react';
import ReactDOM from 'react-dom';

module.exports = React.createClass({

  render: function () {
    return <div ref="wrapper"></div>;
  },

  componentDidMount: function () {
    this.createComponent(this.props);
  },

  componentWillUnmount: function () {
    this.type.destroy();
  },

  createComponent: function (params) {
    var {type, value, onChange, onFocus, onBlur, ...props} = params;
    this.type = new type(this.refs.wrapper, value, props);
    if(onChange) this.type.onChange(onChange);
    if(onFocus) this.type.onFocus(onFocus);
    if(onBlur) this.type.onBlur(onBlur);
  },

  componentWillReceiveProps: function (nextProps) {
    this.type.setProperties(nextProps, this.props, () => {
      this.type.destroy();
      this.createComponent(nextProps);
    });
  },

});
