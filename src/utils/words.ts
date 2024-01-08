import spanishWords from 'an-array-of-spanish-words' assert { type: 'json' }
import { guardAsStringArray } from './guard'

export class WordsUtil {
  private words: ReturnType<typeof guardAsStringArray>

  static readonly create = (): WordsUtil => new this()

  private constructor() {
    this.words = guardAsStringArray(spanishWords)
  }

  readonly getWords = (): readonly string[] => this.words

  readonly updateWords = ({ wordUsed }: { wordUsed: string }): void => {
    if (wordUsed != null) {
      this.words = this.words.filter((word) => word !== wordUsed)
    }
  }

  readonly getWordFromSyllable = ({
    syllable,
  }: {
    syllable: string
  }): string | undefined => {
    if (syllable.length != null && syllable.length > 0) {
      const words = this.words.filter(
        (w) => w.length > 2 && w.toLowerCase().includes(syllable.toLowerCase()),
      )
      const [word] = words.sort((a, b) => a.length - b.length)
      return word
    }
  }
}
