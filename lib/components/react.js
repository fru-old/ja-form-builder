import React from 'react';
import ReactDOM from 'react-dom';
import isEqual from 'lodash/isEqual.js';

module.exports = React.createClass({

  render: function () {
    return <div ref="wrapper"></div>;
  },

  createComponent: function (params) {
    var {type, value, onChange, onFocus, onBlur, ...props} = params;
    var wrapper = ReactDOM.findDOMNode(this.refs.wrapper);
    var result = new type(wrapper, value, props);
    if(onChange) result.onChange(onChange);
    if(onFocus) result.onFocus(onFocus);
    if(onBlur) result.onBlur(onBlur);
    return result;
  },

  componentDidMount: function () {
    this.type = this.createComponent(this.props);
  },

  componentWillUnmount: function () {
    this.type.destroy();
  },

  componentWillReceiveProps: function (nextProps) {
    var {value, ...nonValueProps} = nextProps;
    if(value !== this.props.value) {
      if(value !== this.type.getValue()) {
        this.type.setValue(value);
      }
    }

    var {value, ...previousProps} = this.props;
    console.log(nonValueProps.onChange);
    console.log(previousProps.onChange);
    console.log(isEqual(nonValueProps.onChange, previousProps.onChange));
    console.log(isEqual(nonValueProps.type, previousProps.type));
    console.log(isEqual(nonValueProps, previousProps));
    if(!isEqual(nonValueProps, previousProps)) {
      this.type.setProperties(nonValueProps, () => {
        this.type.destroy();
        this.type = this.createComponent(nextProps);
      });
    }
  }
});
