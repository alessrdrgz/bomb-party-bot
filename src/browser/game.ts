import { type Page } from 'playwright'
import { logger } from '../logger'

const sleep = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

const clearLastLine = (): void => {
  process.stdout.moveCursor(0, -1)
  process.stdout.clearLine(1)
}

export const waitForGameToStart = async (page: Page): Promise<void> => {
  process.stdout.write('Esperando a entrar a una sala... \n')
  const statusLocator = page
    .frameLocator('iframe')
    .first()
    .locator('header.status')

  while (await statusLocator.isHidden()) {
    await sleep(1000)
  }

  clearLastLine()

  const joinRoomButtonLocator = page
    .frameLocator('iframe')
    .first()
    .locator('button:text("Unirse al juego")')

  if (await joinRoomButtonLocator.isVisible())
    await joinRoomButtonLocator.click()

  try {
    let gameStarting = false
    let cooldown = 0
    let previousStatus = ''
    while (!gameStarting) {
      if (await statusLocator.isHidden()) throw new Error('GAME_ROOM_EXITED')
      const status = await statusLocator.textContent()
      if (status != null && status.includes('La ronda comenzará')) {
        gameStarting = true
        const match = status.match(/\d+/g)
        cooldown = match != null ? parseInt(match[0]) : 0
      } else if (status !== null && status !== previousStatus) {
        clearLastLine()
        logger.info(status)
      }
      previousStatus = status ?? previousStatus
      await sleep(500)
    }

    let gameStarted = false
    setTimeout(() => {
      logger.info('GAME STARTED')
      gameStarted = true
    }, cooldown * 1000)

    // eslint-disable-next-line no-unmodified-loop-condition
    while (!gameStarted) {
      const status = await statusLocator.textContent()
      if (status !== null && status !== previousStatus) {
        clearLastLine()
        logger.info(status)
      }
      previousStatus = status ?? previousStatus
    }
  } catch (e) {
    clearLastLine()
    await waitForGameToStart(page)
  }
}

export const setUsernameAndJoin = async (
  page: Page,
  username: string,
): Promise<void> => {
  await page.getByPlaceholder('Tu nombre de usuario').fill(username)
  await page.getByText('OK').click()
  await page
    .frameLocator('iframe')
    .first()
    .locator('button:text("Unirse al juego")')
    .click()
}

export const gameFinished = async (page: Page): Promise<boolean> => {
  const winnerLocator = page.frameLocator('iframe').first().locator('div.medal')
  return await winnerLocator.isVisible()
}
export const waitForMyTurn = async (page: Page): Promise<void> => {
  // Escribe aquí para chatear.

  const selfTurnLocator = page
    .frameLocator('iframe')
    .first()
    .locator('div.selfTurn')

  const otherTurnLocator = page
    .frameLocator('iframe')
    .first()
    .locator('div.otherTurn')

  let myTurn = selfTurnLocator != null && !(await selfTurnLocator.isHidden())
  let previousTurn = ''

  while (!myTurn) {
    const selfTurnHidden = await selfTurnLocator.isHidden()
    const otherTurnText = await otherTurnLocator.textContent()
    const otherTurnHidden = await otherTurnLocator.isHidden()
    if (selfTurnLocator != null && !selfTurnHidden) {
      myTurn = true
    } else if (
      otherTurnLocator != null &&
      !otherTurnHidden &&
      otherTurnText != null &&
      otherTurnText !== previousTurn
    ) {
      clearLastLine()
      logger.info(otherTurnText)
    }

    if (otherTurnText != null) previousTurn = otherTurnText
  }

  if (previousTurn !== '') clearLastLine()
}

export const getSyllable = async (page: Page): Promise<string | null> => {
  return await page
    .frameLocator('iframe')
    .first()
    .locator('div.syllable')
    .textContent()
}

const randomInteger = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

const randomizeDelay = (charactersCount: number): number => {
  const config = {
    lower:
      charactersCount < 15 ? randomInteger(75, 95) : randomInteger(95, 110),
    upper:
      charactersCount < 15 ? randomInteger(80, 100) : randomInteger(100, 150),
  }

  const delays = Array.from(
    { length: 5 },
    (_, i) => (Math.random() % 2 > 0.5 ? config.lower : config.upper) + i,
  )

  return delays[Math.floor(Math.random() * delays.length)]
}
export const enterWord = async (page: Page, word: string): Promise<void> => {
  const inputLocator = page
    .frameLocator('iframe')
    .first()
    .locator('div.selfTurn > form > input.styled')

  await sleep(Math.floor(Math.random() * 2500 + 500))
  const delay = randomizeDelay(word.length)
  await inputLocator.pressSequentially(word, { delay })
  await inputLocator.press('Enter')
  clearLastLine()
}
