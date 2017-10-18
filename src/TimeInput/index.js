import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from '@zippytech/react-class'

import raf from 'raf'

import assign from 'object-assign'

import Clock from '../Clock'

import getSelectionStart from './getSelectionStart'
import getSelectionEnd from './getSelectionEnd'
import setCaretPosition from './setCaretPosition'
import getNewValue from './getNewValue'

export {
  getSelectionStart,
  getSelectionEnd,

  getNewValue,
  setCaretPosition
}

export default class TimeInput extends Component {
  constructor (props) {
    super(props)

    const format = props.format || props.timeFormat

    if (format.indexOf('hh') != 0 && format.indexOf('HH') != 0) {
      console.warn('Please start your time format with 2 digit hours.')
    }

    let hours24 = true
    let meridiem = format.indexOf('a') != -1 || format.indexOf('A') != -1

    if (format.indexOf('hh') == 0) {
      hours24 = false
    }

    const separator = props.separator ||
                        format && format.length > 2
      ? format.charAt(2)
      : ':'
    const hasSeconds = format.indexOf('ss') != -1

    if (hasSeconds && format.charAt(5) != separator) {
      console.warn('Expected minutes-seconds separator to be same as hours-minutes separator. (at position 5)')
    }

    let defaultValue = '00' + separator + '00'

    if (hasSeconds) {
      defaultValue += separator + '00'
    }
    if (meridiem) {
      defaultValue += ' am'
    }

    this.state = {
      valueRange: props.valueRange || 0,
      separator,
      hours24,
      meridiem,
      value: props.defaultValue || defaultValue
    }
  }

  render () {
    const props = this.p = assign({}, this.props)

    props.value = this.state.value // props.value !== undefined?
    // props.value:
    // this.state.value

    return <input
      {...props}
      defaultValue={undefined}
      value={props.value}
      onKeyDown={this.onKeyDown}
      onChange={this.onChange}
    />
  }

  onChange (event) {
    event.stopPropagation()
  }

  onKeyDown (event) {
    const value = this.p.value

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event)
    }

    const range = this.getSelectedRange()
    const separator = this.props.separator || this.state.separator || ':'

    const { value: newValue, update, caretPos } = getNewValue({
      range,
      event,

      circular: this.props.circular,
      propagate: this.props.propagate,

      oldValue: value,
      separator,
      meridiem: this.state.meridiem,
      hours24: this.state.hours24,
      incrementNext: this.props.incrementNext

    })

    const updateCaretPos = () => {
      if (caretPos != undefined) {
        this.setCaretPosition(caretPos)
      }
    }

    if (update || caretPos) {
      event.preventDefault()
    }

    if (update) {
      this.setValue(newValue, updateCaretPos)
    } else {
      raf(updateCaretPos)
    }
  }

  getInput () {
    return findDOMNode(this)
  }

  setCaretPosition (pos) {
    const dom = this.getInput()
    dom && setCaretPosition(dom, pos)
  }

  setValue (value, callback) {
    // if (this.props.value === undefined){
    this.setState({
      now: Date.now(),
      value
    }, typeof callback === 'function' && callback)
    // } else {
    //   this.updateCallback = callback
    // }

    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  componentDidUpdate () {
    if (this.updateCallback) {
      this.updateCallback()
      this.updateCallback = null
    }
  }

  getSelectedRange () {
    const dom = this.getInput()

    return {
      start: getSelectionStart(dom),
      end: getSelectionEnd(dom)
    }
  }

  getSelectedValue () {
    const range = this.getSelectedRange()
    const value = this.p.value

    return value.substring(range.start, range.end)
  }

  onTimeChange (value) {
    const time = value.split(':')

    this.setState({
      minutes: time[0] * 60 + time[1]
    })
  }

  renderClock () {
    const props = this.p
    const clock = props.children
      .filter(child => child && child.props && child.props.isTimePickerClock)[0]

    const clockProps = {
      time: this.state.minutes || props.date,
      showSecondsHand: true
    }

    if (clock) {
      return React.cloneElement(clock, clockProps)
    }

    return <Clock {...clockProps} />
  }
}

TimeInput.defaultProps = {
  theme: 'default',

  circular: true,
  propagate: true,
  incrementNext: true
}

TimeInput.propTypes = {
  format: PropTypes.string,
  value: (props, propName) => {
    if (props[propName] !== undefined) {
      console.warn('Due to performance considerations, TimeInput will only be uncontrolled.')
    }
  }
}
