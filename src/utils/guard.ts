export const guardAsStringArray = (value: unknown): readonly string[] => {
  if (!Array.isArray(value)) throw new Error('Expected an array')

  return value.map((e) => {
    if (typeof e !== 'string') throw new Error('Expected an array of strings')
    return e
  })
}

export const isNonNullable = <T>(t: T | null | undefined): t is T =>
  t !== null && t !== undefined
