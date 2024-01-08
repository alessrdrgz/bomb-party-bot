import type { Page } from 'playwright'
import { chromium } from 'playwright'

export const createBrowser = async (): Promise<Page> => {
  const browser = await chromium.connectOverCDP('http://localhost:9222')
  const context = browser.contexts()[0]

  if (context == null) throw new Error('Browser context not found')
  const gamePage = context
    .pages()
    .find((page) => page.url().includes('jklm.fun'))

  if (gamePage == null) throw new Error('Game page not found')
  return gamePage
}
