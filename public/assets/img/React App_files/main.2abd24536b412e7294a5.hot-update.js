webpackHotUpdate("main",{

/***/ "./src/components/AddTo.js":
/*!*********************************!*\
  !*** ./src/components/AddTo.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AddTo; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _jsxFileName = "/Users/aditya/Desktop/my-react/src/components/AddTo.js";

class AddTo extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(...args) {
    super(...args);

    this.inputStyle = () => {
      return {
        width: "90%",
        fontSize: "25px",
        padding: "10px",
        textAlign: "center"
      };
    };

    this.state = {
      title: 'as'
    };

    this.onSubmit = e => {
      e.preventDefault();
      this.props.addList(this.state.title);
      this.setState({
        title: ''
      });
    };

    this.onChange = e => {
      this.setState({
        [e.target.name]: e.target.value
      });
    };
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
      onSubmit: this.onSubmit,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 29
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      type: "text",
      placeholder: "Enter new Task",
      onChange: this.onChange,
      value: this.state.title,
      style: this.inputStyle(),
      __source: {
        fileName: _jsxFileName,
        lineNumber: 30
      },
      __self: this
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      type: "submit",
      value: "submit",
      style: {},
      __source: {
        fileName: _jsxFileName,
        lineNumber: 31
      },
      __self: this
    }));
  }

}

/***/ })

})
//# sourceMappingURL=main.2abd24536b412e7294a5.hot-update.js.map