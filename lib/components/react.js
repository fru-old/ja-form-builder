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
    result.onChange((value, context) => {
      this.setState(this.state);
      if(onChange) onChange.call(context, value, context);
    });
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
    var {value, onChange, onBlur, onFocus, ...nonValueProps} = nextProps;
    if(value !== this.type.getValue()) {
        this.type.setValue(value);
    }

    var {value, onChange, onBlur, onFocus, ...previousProps} = this.props;
    console.log(isEqual(nonValueProps, previousProps));
    if(!isEqual(nonValueProps, previousProps)) {
      this.type.setProperties(nonValueProps, () => {
        this.type.destroy();
        this.type = this.createComponent(nextProps);
      });
    }
  }
});
