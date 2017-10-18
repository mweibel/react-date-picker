import moment from 'moment'

const DEFAULT_WEEK_START_DAY = moment().startOf('week').format('d') * 1

export default function getWeekDayNames (startDay, locale) {
  let weekDays

  if (locale) {
    const data = moment.localeData(locale)

    weekDays = data && data._weekdaysShort
      ? data._weekdaysShort
      : weekDays
  }

  weekDays = (weekDays || moment.weekdaysShort()).concat()

  const names = weekDays
  let index = startDay == null ? DEFAULT_WEEK_START_DAY : startDay

  while (index > 0) {
    names.push(names.shift())
    index--
  }

  return names
}
