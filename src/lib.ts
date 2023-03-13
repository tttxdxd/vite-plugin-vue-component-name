
import MagicString from 'magic-string'

export function supportScriptName(code: string, id: string, onlySetup?: boolean) {
  const { name, lang, setup } = compileScript(code)

  if (!name) return null
  if (onlySetup && !setup) return null

  const str = new MagicString(code)

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

function compileCode(code: string, type: 'script') {
  const regex = new RegExp(`<${type}[^>]*>`)
  const startMatch = code.match(regex)

  if (!startMatch) return ''

  const startTag = startMatch[0]
  const startIndex = code.indexOf(startTag) + + startTag.length
  const endIndex = code.indexOf(`</${type}>`, startIndex)

  return {
    startTag,
    content: code.slice(startIndex, endIndex)
  }
}

function parseTag(code: string, type: 'script' | 'template' | 'style') {
  const regex = new RegExp(`<${type}[^>]*>`)
  const match = code.match(regex)

  if (!match) return null

  const tag = match[0]
  const attrs: Record<string, boolean | string> = {}

  for (const [key, value] of tag.split(' ').map(pair => pair.split('='))) {
    if (typeof value === 'undefined') attrs[key] = true
    if (typeof value === 'string') {
      if (['\'', '\"'].includes(value) && value[0] === value[value.length - 1]) attrs[key] = value.slice(1, -1)
      else attrs[key] = value
    }
  }

  return {
    tag,
    attrs
  }
}

function compileScript(code: string) {
  const result = parseTag(code, 'script')

  if (!result) return { name: '', lang: '' }

  return {
    name: result.attrs.name,
    lang: result.attrs.lang,
    setup: !!result.attrs.setup,
  }
}
