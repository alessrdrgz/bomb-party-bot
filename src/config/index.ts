import type { Interface } from 'node:readline/promises'
import * as readLine from 'node:readline/promises'
import { logger } from '../logger'

interface Config {
  url: string
  username: string
}

const clearLastLine = (): void => {
  process.stdout.moveCursor(0, -1)
  process.stdout.clearLine(1)
}

const getUsername = async (io: Interface): Promise<string> => {
  const name = await io.question('Introduce tu nombre de usuario: ')
  clearLastLine()
  clearLastLine()
  if (name.length >= 2) return name
  else {
    logger.error('El nombre de usuario debe tener al menos 2 caracteres')
    return await getUsername(io)
  }
}

const getCode = async (io: Interface): Promise<string> => {
  const code = await io.question('Introduce el código de la sala: ')
  clearLastLine()
  clearLastLine()
  if (code.match(/^[A-Z]{4}$/) != null) return code
  else {
    logger.error('El código de la sala debe tener 4 letras mayúsculas')
    return await getCode(io)
  }
}

const userInput = async (): Promise<{ code: string; username: string }> => {
  const io = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const username = await getUsername(io)
  const code = await getCode(io)

  io.close()
  return { code, username }
}

export const generateConfig = async (): Promise<Config> => {
  const { code, username } = await userInput()
  return {
    url: `https://jklm.fun/${code}`,
    username,
  }
}
