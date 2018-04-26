# callbag-exhaust-map

Callbag operator that maps to inner source and ignores other values until that source completes.

## Example

```js
import debounce from 'callbag-debounce'
import exhaustMap from 'callbag-exhaust-map'
import filter from 'callbag-filter'
import forEach from 'callbag-for-each'
import fromEvent from 'callbag-from-event'
import fromPromise from 'callbag-from-promise'
import map from 'callbag-map'
import pairwise from 'callbag-pairwise'
import pipe from 'callbag-pipe'

pipe(
  fromEvent(window, 'scroll'),
  map(({ target: { clientHeight, scrollHeight, scrollTop } }) => ({
    clientHeight,
    scrollHeight,
    scrollTop,
  })),
  pairwise,
  debounce(200),
  filter(([prev, current]) => {
    const scrollingDown = prev.scrollTop < current.scrollTop
    const nearBottom =
      (current.scrollTop + current.clientHeight) / current.scrollHeight > 0.9
    return scrollingDown && nearBottom
  }),
  exhaustMap(() => fromPromise(fetchItems())),
  forEach(items => {
    console.log(items)
  }),
)
```
