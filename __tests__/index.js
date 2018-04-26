import forEach from 'callbag-for-each'
import pipe from 'callbag-pipe'
import subject from 'callbag-subject'

import exhaustMap from '../src'

test('works', () => {
  const actual = []

  const makeIncrementingSubject = initial => {
    const inner = subject()
    return (type, data) => {
      if (type === 0) {
        inner(0, data)
        return
      }
      if (type === 1) {
        inner(1, initial++)
        return
      }
      if (type === 2) {
        inner(2)
        return
      }
    }
  }

  const source = makeIncrementingSubject(1)
  let inner

  pipe(
    source,
    exhaustMap(value => {
      inner = makeIncrementingSubject(value)
      return inner
    }),
    forEach(data => {
      actual.push(data)
    }),
  )

  return Promise.resolve()
    .then(() => {
      expect(actual).toEqual([])
    })
    .then(() => {
      source(1)
      source(1)
      source(1)
    })
    .then(() => {
      inner(1)
      inner(1)
    })
    .then(() => {
      source(1)
      source(1)
      source(1)
      source(1)
    })
    .then(() => {
      inner(1)
      source(1)
      inner(2)
    })
    .then(() => {
      source(1)
      source(1)
      source(1)
      source(1)
      source(1)
    })
    .then(() => {
      inner(1)
      inner(1)
    })
    .then(() => {
      source(1)
      source(1)
      inner(1)
      inner(1)
      inner(2)
      source(1)
      inner(1)
    })
    .then(() => {
      expect(actual).toEqual([1, 2, 3, 9, 10, 11, 12, 16])
    })
})
