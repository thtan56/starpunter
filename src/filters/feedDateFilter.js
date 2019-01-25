// feedDateFilter.js
export default function (s) {
  if (!window.Intl) return s
  // convert to date
  if (!(s instanceof Date)) {
    let orig = s
    s = new Date(s)
    if (s === 'Invalid Date') return orig
  }
  return new Intl.DateTimeFormat().format(s)
}
