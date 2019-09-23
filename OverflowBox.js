import React from 'react'

function isOverflow(el) {
  const curOverflow = el.style.overflow
  if (!curOverflow || curOverflow === 'visible') {
    el.style.overflow = 'hidden'
  }

  const isOverflowing =
    el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight

  el.style.overflow = curOverflow
  return isOverflowing
}


export default class OverflowBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      check: true,
      low: 0,
      high: 500,
      str: props.str
    }
    this.handleWindowResize = this.handleWindowResize.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.str !== this.props.str) {
      this.setState({
        check: true,
        low: 0,
        high: 500,
        str: nextProps.str
      })
    }
  }
  handleWindowResize() {
    clearTimeout(this.timerResize)
    this.timerResize = setTimeout(() => {
      this.setState({
        check: true
      })
    }, 200)
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize)
    // delay for cases where this component is mounted but page css is not
    this.timerOverflow = setTimeout(() => {
      if (!isOverflow(this.el)) {
        return this.setState({
          check: false
        })
      }
      this.setState({
        str: this.props.str.slice(0, this.state.high)
      })
    }, 100)
  }
  componentWillUnmount() {
    clearTimeout(this.timerOverflow)
    clearTimeout(this.timerResize)
    window.removeEventListener('resize', this.handleWindowResize)
  }

  componentDidUpdate() {
    const { low, high, check } = this.state
    if (!check) return
    if (low + 1 < high) {
      const mid = Math.floor((high + low) / 2)
      this.setState(
        {
          str: this.props.str.slice(0, mid) + (mid === 0 ? '' : '...')
        },
        () => {
          if (!this.state.check) return
          if (!isOverflow(this.el)) {
            this.setState({
              low: mid
            })
          } else {
            this.setState({
              high: mid
            })
          }
        }
      )
    } else {
      setTimeout(() => {
        const str = this.props.str.slice(0, Math.floor((high + low) / 2))
        this.setState({
          low: 0,
          high: 500,
          check: false,
          str: low >= 499 ? str : str.length === 0 ? '' : str + '...'
        })
      })
    }
  }

  render() {
    const { str } = this.state
    return (
      <div
        ref={(el) => {
          this.el = el
        }}
        style={{ overflow: 'hidden', height: '100%', position: 'absolute' }}
      >
        {str}
      </div>
    )
  }
}
