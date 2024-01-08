export const formQuery = (elements: string[]): string => elements.join(' > ')
export const waitFor = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
