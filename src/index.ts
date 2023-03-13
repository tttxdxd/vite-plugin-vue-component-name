import type { Plugin } from 'vite'
import { supportScriptName } from './lib'

export interface ComponentNameOptions {
  /**
   * Turn on name extension
   * @default true
   */
  enable?: boolean
  /**
   * Only allow setup script with name attribute
   * @default false
   */
  setup?: boolean
  /**
   * Use file path generator component name
   * @default false
   */
  filepath?: boolean
}

export default (options: ComponentNameOptions = {}): Plugin => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { enable = true, setup = false, filepath = false } = options

  return {
    name: 'vite:component-name-support',
    enforce: 'pre',
    async transform(code: string, id: string) {
      if (!enable)
        return null
      if (!(/\.vue$/.test(id)))
        return null

      return supportScriptName(code, id, setup) as any
    },
  }
}
