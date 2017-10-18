import React from 'react'
import Component from '@zippytech/react-class'

import assign from 'object-assign'
import { Flex } from '@zippytech/react-flex'
import toMoment from './toMoment'
import join from './join'
import joinFunctions from './joinFunctions'
import bemFactory from './bemFactory'

import Footer from './Footer'
import YearView from './YearView'

import assignDefined from './assignDefined'

const bem = bemFactory('react-date-picker__history-view')

const preventDefault = (e) => {
  e.preventDefault()
}

import DecadeView, {
  prepareDateProps,
  getInitialState,

  onViewDateChange,
  onActiveDateChange,
  onChange,
  navigate,
  select,
  confirm,
  gotoViewDate
} from './DecadeView'

export default class HistoryView extends Component {
  constructor (props) {
    super(props)

    this.state = getInitialState(props)
  }

  componentWillUnmount () {
    this.unmounted = true
  }

  toMoment (date, format) {
    return toMoment(date, format, this.props)
  }

  render () {
    const dateProps = prepareDateProps(this.props, this.state)

    const props = this.p = assign({}, this.props, dateProps)

    props.children = React.Children.toArray(props.children)

    const className = join(
      props.className,
      bem(),
      props.theme && bem(null, `theme-${props.theme}`)
    )

    const commonProps = assignDefined({}, {
      locale: props.locale,
      theme: props.theme,
      minDate: props.minDate,
      maxDate: props.maxDate,

      viewDate: props.viewMoment,
      activeDate: props.activeDate,
      date: props.date,

      dateFormat: props.dateFormat
    })

    const yearViewProps = assign({}, commonProps)

    const decadeViewProps = assign({}, commonProps, {
      ref: view => { this.decadeView = view }
    })

    const flexProps = assign({}, this.props)

    delete flexProps.activeDate
    delete flexProps.adjustDateStartOf
    delete flexProps.adjustMaxDateStartOf
    delete flexProps.adjustMinDateStartOf

    delete flexProps.cleanup

    delete flexProps.date
    delete flexProps.dateFormat
    delete flexProps.defaultDate
    delete flexProps.defaultViewDate

    delete flexProps.focusDecadeView
    delete flexProps.focusYearView
    delete flexProps.footer

    delete flexProps.locale

    delete flexProps.maxDate
    delete flexProps.minDate

    delete flexProps.onOkClick
    delete flexProps.onCancelClick
    delete flexProps.okOnEnter

    delete flexProps.navigation

    delete flexProps.theme

    delete flexProps.viewMoment

    if (typeof props.cleanup === 'function') {
      props.cleanup(flexProps)
    }

    return <Flex
      inline
      column
      alignItems='stretch'
      {...flexProps}
      className={className}
    >
      {this.renderYearView(yearViewProps)}
      {this.renderDecadeView(decadeViewProps)}
      {this.renderFooter()}
    </Flex>
  }

  renderFooter () {
    const props = this.p
    const children = props.children

    if (!props.footer) {
      return null
    }

    const footerChild = children.filter(c => c && c.props && c.props.isDatePickerFooter)[0]

    if (footerChild) {
      const newFooterProps = {
        onOkClick: joinFunctions(this.onOkClick, footerChild.props.onOkClick),
        onCancelClick: joinFunctions(this.onCancelClick, footerChild.props.onCancelClick)
      }

      if (footerChild.props.centerButtons === undefined) {
        newFooterProps.centerButtons = true
      }
      if (footerChild.props.todayButton === undefined) {
        newFooterProps.todayButton = false
      }
      if (footerChild.props.clearButton === undefined) {
        newFooterProps.clearButton = false
      }

      return React.cloneElement(footerChild, newFooterProps)
    }

    return <Footer
      todayButton={false}
      clearButton={false}
      onOkClick={this.onOkClick}
      onCancelClick={this.onCancelClick}
      centerButtons
    />
  }

  onOkClick () {
    if (this.props.onOkClick) {
      const dateMoment = this.p.activeMoment
      const dateString = this.format(dateMoment)
      const timestamp = +dateMoment

      this.props.onOkClick(dateString, { dateMoment, timestamp })
    }
  }

  onCancelClick () {
    if (this.props.onCancelClick) {
      this.props.onCancelClick()
    }
  }

  renderYearView (yearViewProps) {
    const props = this.p
    const children = props.children

    const yearViewChild = children.filter(c => c && c.props && c.props.isYearView)[0]
    const yearViewChildProps = yearViewChild ? yearViewChild.props : {}

    const tabIndex = yearViewChildProps.tabIndex == null
      ? null
      : yearViewChildProps.tabIndex

    yearViewProps.tabIndex = tabIndex

    if (props.focusYearView === false || tabIndex == null) {
      yearViewProps.tabIndex = null
      yearViewProps.onFocus = this.onYearViewFocus
      yearViewProps.onMouseDown = this.onYearViewMouseDown
    }

    assign(yearViewProps, {
      // viewDate: props.moment || props.viewDate,
      onViewDateChange: joinFunctions(
        this.onViewDateChange,
        yearViewChildProps.onViewDateChange
      ),
      onActiveDateChange: joinFunctions(
        this.onActiveDateChange,
        yearViewChildProps.onActiveDateChange
      ),
      onChange: joinFunctions(
        this.handleYearViewOnChange,
        yearViewChildProps.onChange
      )
    })

    if (yearViewChild) {
      return React.cloneElement(yearViewChild, yearViewProps)
    }

    return <YearView {...yearViewProps} />
  }

  renderDecadeView (decadeViewProps) {
    const props = this.p
    const children = props.children
    const decadeViewChild = children.filter(c => c && c.props && c.props.isDecadeView)[0]

    const decadeViewChildProps = decadeViewChild ? decadeViewChild.props : {}

    const tabIndex = decadeViewChildProps.tabIndex == null
      ? null
      : decadeViewChildProps.tabIndex

    decadeViewProps.tabIndex = tabIndex

    if (props.focusDecadeView === false || tabIndex == null) {
      decadeViewProps.tabIndex = null
      decadeViewProps.onMouseDown = this.onDecadeViewMouseDown
    }

    assign(decadeViewProps, {
      onConfirm: joinFunctions(
        this.handleDecadeViewOnConfirm,
        decadeViewChildProps.onConfirm
      ),
      onViewDateChange: joinFunctions(
        this.handleDecadeOnViewDateChange,
        decadeViewChildProps.onViewDateChange
      ),
      onActiveDateChange: joinFunctions(
        this.handleDecadeOnActiveDateChange,
        decadeViewChildProps.onActiveDateChange
      ),
      onChange: joinFunctions(
        this.handleDecadeOnChange,
        decadeViewChildProps.onChange
      )
    })

    if (decadeViewChild) {
      return React.cloneElement(decadeViewChild, decadeViewProps)
    }

    return <DecadeView {...decadeViewProps} />
  }

  onYearViewFocus () {
    if (this.props.focusYearView === false) {
      this.focus()
    }
  }

  focus () {
    if (this.decadeView && this.props.focusDecadeView) {
      this.decadeView.focus()
    }
  }

  onYearViewMouseDown (e) {
    preventDefault(e)

    this.focus()
  }

  onDecadeViewMouseDown (e) {
    preventDefault(e)
  }

  format (mom, format) {
    format = format || this.props.dateFormat

    return mom.format(format)
  }

  handleDecadeViewOnConfirm () {
    if (this.props.okOnEnter) {
      this.onOkClick()
    }
  }

  onKeyDown (event) {
    if (event.key == 'Escape') {
      return this.onCancelClick()
    }

    if (this.decadeView) {
      this.decadeView.onKeyDown(event)
    }

    return undefined
  }

  confirm (date, event) {
    return confirm.call(this, date, event)
  }

  navigate (direction, event) {
    return navigate.call(this, direction, event)
  }

  select ({ dateMoment, timestamp }, event) {
    return select.call(this, { dateMoment, timestamp }, event)
  }

  handleDecadeOnViewDateChange (dateString, { dateMoment, timestamp }) {
    const props = this.p
    const currentViewMoment = props.viewMoment

    if (currentViewMoment) {
      dateMoment.set('month', currentViewMoment.get('month'))
      dateString = this.format(dateMoment)
      timestamp = +dateMoment
    }

    this.onViewDateChange(dateString, { dateMoment, timestamp })
  }

  handleDecadeOnActiveDateChange (dateString, { dateMoment, timestamp }) {
    const props = this.p
    const currentViewMoment = props.viewMoment

    if (currentViewMoment) {
      dateMoment.set('month', currentViewMoment.get('month'))
      dateString = this.format(dateMoment)
      timestamp = +dateMoment
    }

    this.onActiveDateChange(dateString, { dateMoment, timestamp })
  }

  handleDecadeOnChange (dateString, { dateMoment, timestamp }, event) {
    const props = this.p
    const currentViewMoment = props.viewMoment

    if (currentViewMoment) {
      dateMoment.set('month', currentViewMoment.get('month'))
      dateString = this.format(dateMoment)
      timestamp = +dateMoment
    }

    this.onChange(dateString, { dateMoment, timestamp }, event)
  }

  handleYearViewOnChange (dateString, { dateMoment, timestamp }, event) {
    const props = this.p
    const currentMoment = props.moment

    if (currentMoment) {
      dateMoment.set('year', currentMoment.get('year'))
      dateString = this.format(dateMoment)
      timestamp = +dateMoment
    }

    this.onChange(dateString, { dateMoment, timestamp }, event)
  }

  onViewDateChange (dateString, { dateMoment, timestamp }) {
    return onViewDateChange.call(this, { dateMoment, timestamp })
  }

  gotoViewDate ({ dateMoment, timestamp }) {
    return gotoViewDate.call(this, { dateMoment, timestamp })
  }

  onActiveDateChange (dateString, { dateMoment, timestamp }) {
    return onActiveDateChange.call(this, { dateMoment, timestamp })
  }

  onChange (dateString, { dateMoment, timestamp }, event) {
    return onChange.call(this, { dateMoment, timestamp }, event)
  }
}

HistoryView.defaultProps = {
  okOnEnter: true,

  footer: true,
  theme: 'default',
  navigation: true,

  focusYearView: false,
  focusDecadeView: true,

  dateFormat: 'YYYY-MM-DD',

  adjustDateStartOf: 'month',
  adjustMinDateStartOf: 'month',
  adjustMaxDateStartOf: 'month'
}
