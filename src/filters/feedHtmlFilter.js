// feedHtmlFilter.js
export default function (text) {
  // remove html
  text = text.replace(/<.*?>/gi, '')
  if (text.length > 500) text = text.substr(0, 500)
  return text
}
