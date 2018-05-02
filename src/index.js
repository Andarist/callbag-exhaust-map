export default function exhaustMap(project) {
  return source => (start, sink) => {
    if (start !== 0) return

    let innerTalkback = null
    let sourceTalkback

    const innerSink = (type, data) => {
      if (type === 0) {
        innerTalkback = data
        innerTalkback(1)
        return
      }

      if (type === 1) {
        sink(1, data)
        innerTalkback(1)
        return
      }

      if (type === 2) {
        innerTalkback = null
      }
    }

    const wrappedSink = (type, data) => {
      if (type === 2 && innerTalkback !== null) {
        innerTalkback(2, data)
      }
      sourceTalkback(type, data)
    }

    source(0, (type, data) => {
      if (type === 0) {
        sourceTalkback = data
        sink(0, wrappedSink)
        return
      }

      if (type === 1) {
        if (innerTalkback !== null) {
          return
        }

        project(data)(0, innerSink)
        return
      }

      if (type === 2) {
        sink(2, data)

        if (innerTalkback === null) {
          return
        }

        innerTalkback(2, data)
      }
    })
  }
}
