const noop = () => {}

export default function exhaustMap(project) {
  return source => (start, sink) => {
    if (start !== 0) return

    let projected = null
    let completed = false

    source(0, (type, data) => {
      if (type === 0) return

      if (type === 1) {
        if (projected !== null) return
        projected = project(data)

        projected(0, (type, data) => {
          if (type === 0) {
            sink(0, noop)
            return
          }

          if (type === 1) {
            sink(1, data)
            return
          }

          if (type === 2) {
            projected = null
            if (completed) {
              sink(2)
            }
          }
        })
        return
      }

      if (type === 2) {
        completed = true
        if (projected === null || data !== undefined) {
          sink(2, data)
        }
      }
    })
  }
}
