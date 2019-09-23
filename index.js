'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function isOverflow(el) {
  var curOverflow = el.style.overflow;
  if (!curOverflow || curOverflow === 'visible') {
    el.style.overflow = 'hidden';
  }

  var isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;

  el.style.overflow = curOverflow;
  return isOverflowing;
}

var OverflowBox = function (_React$Component) {
  _inherits(OverflowBox, _React$Component);

  function OverflowBox(props) {
    _classCallCheck(this, OverflowBox);

    var _this = _possibleConstructorReturn(this, (OverflowBox.__proto__ || Object.getPrototypeOf(OverflowBox)).call(this, props));

    _this.state = {
      check: true,
      low: 0,
      high: 500,
      str: props.str
    };
    _this.handleWindowResize = _this.handleWindowResize.bind(_this);
    return _this;
  }

  _createClass(OverflowBox, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.str !== this.props.str) {
        this.setState({
          check: true,
          low: 0,
          high: 500,
          str: nextProps.str
        });
      }
    }
  }, {
    key: 'handleWindowResize',
    value: function handleWindowResize() {
      var _this2 = this;

      clearTimeout(this.timerResize);
      this.timerResize = setTimeout(function () {
        _this2.setState({
          check: true
        });
      }, 200);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this3 = this;

      window.addEventListener('resize', this.handleWindowResize);
      // delay for cases where this component is mounted but page css is not
      this.timerOverflow = setTimeout(function () {
        if (!isOverflow(_this3.el)) {
          return _this3.setState({
            check: false
          });
        }
        _this3.setState({
          str: _this3.props.str.slice(0, _this3.state.high)
        });
      }, 100);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.timerOverflow);
      clearTimeout(this.timerResize);
      window.removeEventListener('resize', this.handleWindowResize);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var _this4 = this;

      var _state = this.state,
          low = _state.low,
          high = _state.high,
          check = _state.check;

      if (!check) return;
      if (low + 1 < high) {
        var mid = Math.floor((high + low) / 2);
        this.setState({
          str: this.props.str.slice(0, mid) + (mid === 0 ? '' : '...')
        }, function () {
          if (!_this4.state.check) return;
          if (!isOverflow(_this4.el)) {
            _this4.setState({
              low: mid
            });
          } else {
            _this4.setState({
              high: mid
            });
          }
        });
      } else {
        setTimeout(function () {
          var str = _this4.props.str.slice(0, Math.floor((high + low) / 2));
          _this4.setState({
            low: 0,
            high: 500,
            check: false,
            str: low >= 499 ? str : str.length === 0 ? '' : str + '...'
          });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var str = this.state.str;

      return _react2.default.createElement(
        'div',
        {
          ref: function ref(el) {
            _this5.el = el;
          },
          style: { overflow: 'hidden', height: '100%', position: 'absolute' }
        },
        str
      );
    }
  }]);

  return OverflowBox;
}(_react2.default.Component);

exports.default = OverflowBox;
//# sourceMappingURL=index.js.map