import type { BrowserContext } from 'playwright'
import { chromium } from 'playwright'

export const createBrowser = async (): Promise<BrowserContext> => {
  const browser = await chromium.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disabled-blink-features=AutomationControlled',
      '--disable-web-security',
    ],
  })

  return await browser.newContext()
}
