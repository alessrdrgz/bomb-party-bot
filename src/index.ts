import figlet from 'figlet'
import { createBrowser } from './browser'
import {
  enterWord,
  getSyllable,
  setUsernameAndJoin,
  waitForGameToStart,
  waitForMyTurn,
} from './browser/game'
import { generateConfig } from './config'
import { logger } from './logger'
import { WordsUtil } from './utils/words'
try {
  const asciiText = figlet.textSync('Bomb Party Bot', 'Big Money-ne')
  process.stdout.write(`${asciiText}\n\n`)
  const wordsUtil = WordsUtil.create()
  const config = await generateConfig()
  const page = await (await createBrowser()).newPage()

  await page.goto(config.url)
  await setUsernameAndJoin(page, config.username)
  await waitForGameToStart(page)

  while (true) {
    await waitForMyTurn(page)
    process.stdout.write('🚀 Tu turno')
    const syllable = await getSyllable(page)
    if (syllable == null) continue
    const word = wordsUtil.getWordFromSyllable({ syllable })
    if (word == null) continue
    await enterWord(page, word)
    wordsUtil.updateWords({ wordUsed: word })
  }
} catch (e) {
  logger.error(e)
  process.exit(-1)
}

export {}
