import figlet from 'figlet'
import { type Page } from 'playwright'
import { createBrowser } from './browser'
import {
  enterWord,
  gameFinished,
  getSyllable,
  waitForGameToStart,
  waitForMyTurn,
} from './browser/game'
import { logger } from './logger'
import { WordsUtil } from './utils/words'

async function gameloop(page: Page): Promise<void> {
  const wordsUtil = WordsUtil.create()
  await waitForGameToStart(page)

  while (!(await gameFinished(page))) {
    await waitForMyTurn(page)
    process.stdout.write('🚀 Tu turno \n')
    const syllable = await getSyllable(page)
    if (syllable == null) continue
    const word = wordsUtil.getWordFromSyllable({ syllable })
    if (word == null) continue
    await enterWord(page, word)
    wordsUtil.updateWords({ wordUsed: word })
  }

  await gameloop(page)
}

try {
  const asciiText = figlet.textSync('Bomb Party Bot', 'Big Money-ne')
  process.stdout.write(`${asciiText}\n\n`)

  // const config = await generateConfig()
  const page = await createBrowser()

  await gameloop(page)
  // await setUsernameAndJoin(page, config.username)
} catch (e) {
  logger.error(e)
  process.exit(-1)
}

export {}
