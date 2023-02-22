import { toCapitalize } from '.'

describe('toCapitalize', () => {
  it('capitalizes word', () => {
    const word = 'hello'
    const capitalizedWord = toCapitalize(word)
    expect(capitalizedWord).toBe('Hello')
  })

  it('capitalizes multiple words', () => {
    const sentence = 'hello world'
    const capitalizedWord = toCapitalize(sentence)
    expect(capitalizedWord).toBe('Hello World')
  })

  it('returns empty string', () => {
    const invalidWord = ''
    const capitalizedWord = toCapitalize(invalidWord)
    expect(capitalizedWord).toBe('')
  })
})
