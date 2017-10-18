import NAV_KEYS from './navKeys'

export default function (event) {
  const key = event.key

  if (this.props.onKeyDown) {
    if (this.props.onKeyDown(event) === false) {
      return
    }
  }

  if (key == 'Enter' && this.p.activeDate) {
    this.confirm(this.p.activeDate, event)
  }

  const navKeys = this.p.navKeys || NAV_KEYS
  const dir = navKeys[key]

  if (!dir) {
    return
  }

  event.preventDefault()
  this.navigate(dir, event)
}
