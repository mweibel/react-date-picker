export default (moment, configOrRange) => {
  let range = configOrRange
  let inclusive = true

  if (!Array.isArray(configOrRange) && typeof configOrRange === 'object') {
    range = configOrRange.range

    if (configOrRange.inclusive !== undefined) {
      inclusive = !!configOrRange.inclusive
    }
  }

  const start = range[0]
  const end = range.length >= 2 && range[range.length - 1]

  if (!moment) {
    return false
  }

  if (start && end) {
    const insideRange = start.isBefore(moment) && end.isAfter(moment)

    return inclusive
      ? insideRange || start.isSame(moment) || end.isSame(moment)
      : insideRange
  }

  return false
}
