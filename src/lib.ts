import MagicString from 'magic-string'

export function supportScriptName(code: string, id: string, onlySetup?: boolean) {
  const { name, lang, setup, scriptPos, namePos, isEmpty } = compileScript(code)

  if (!name)
    return null
  if (onlySetup && !setup)
    return null

  const str = new MagicString(code)

  if (isEmpty)
    str.remove(scriptPos.start, scriptPos.end)
  else
    str.remove(namePos.start, namePos.end)

  str.appendLeft(0,
    `<script ${lang ? `lang="${lang}"` : ''}>
import { defineComponent } from 'vue'
export default defineComponent({
  name: '${name}',
})
</script>\n`)

  return {
    map: str.generateMap(),
    code: str.toString(),
  }
}

function compileScript(code: string) {
  const result = parseScript(code)

  if (!result)
    return { name: '', lang: '', setup: false, namePos: { start: 0, end: 0 }, scriptPos: { start: 0, end: 0 }, isEmpty: false }

  return {
    name: result.attrs.name,
    lang: result.attrs.lang,
    setup: !!result.attrs.setup,
    namePos: result.namePos,
    scriptPos: result.scriptPos,
    isEmpty: result.isEmpty,
  }
}

function parseScript(code: string) {
  const regex = /<script([^>]*)>/
  const startMatch = code.match(regex)

  if (!startMatch)
    return ''

  const startTag = startMatch[0]

  const startIndex = code.indexOf(startTag) + startTag.length
  const endIndex = code.indexOf('</script>', startIndex)
  const content = code.slice(startIndex, endIndex)
  const isEmpty = content.replace(/\/\/.*/ig, '').replace(/\/\*\*.*\*\//igs, '').trim().length === 0
  const scriptPos = {
    start: startIndex - startTag.length,
    end: endIndex + '</script>'.length,
  }
  const { attrs, namePos } = parseTag(startMatch[1], scriptPos.start + 7)

  return {
    attrs,
    namePos,
    scriptPos,
    content,
    isEmpty,
  }
}

function parseTag(tag: string, start = 0) {
  const attrs: Record<string, boolean | string> = {}
  const namePos = { start: 0, end: 0 }
  let key = ''
  let value: undefined | string

  function assign(i: number) {
    if (key === 'name') {
      if (typeof value === 'undefined')
        throw new SyntaxError('The name attribute must be assigned a value.')

      namePos.start = i - value.length - 5
      namePos.end = i

      while (tag[namePos.start - 1] === ' ')
        namePos.start -= 1
    }
    if (key)
      attrs[key] = typeof value === 'undefined' ? true : parseQuotes(value)

    key = ''
    value = undefined
  }

  for (let i = 0, len = tag.length; i < len; i++) {
    const char = tag[i]

    if (char === ' ') {
      assign(i)
      continue
    }
    else if (char === '=') {
      value = ''
      continue
    }

    if (typeof value === 'undefined')
      key += char
    else value += char
  }

  assign(tag.length)

  return {
    attrs,
    namePos: {
      start: namePos.start + start,
      end: namePos.end + start,
    },
  }
}

function parseQuotes(str: string): string {
  if (str.length <= 1)
    return str

  if (['\'', '\"'].includes(str[0]) && str[0] === str[str.length - 1])
    return str.slice(1, -1)

  return str
}
