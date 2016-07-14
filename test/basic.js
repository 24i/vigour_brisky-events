'use strict'
const render = require('brisky-core/render')
const Element = require('brisky-core')
const test = require('tape')
const trigger = require('../trigger')
Element.prototype.inject(
  require('../lib'),
  require('../lib/basic')
)

test('basic - add events', (t) => {
  const elem = new Element({
    on: { mousedown () {} }
  })
  const node = render(elem)
  t.true(elem.hasEvents, 'adds hasEvents on element')
  t.equals(node._, elem, 'stores element on node')
  t.false('_s' in node, 'doesn\'t store state on node when no state')
  t.end()
})

test('basic - prevent', (t) => {
  const elem = {
    on: {
      mousedown () {
        t.fail('should be prevented')
      }
    },
    nest: {
      on: {
        mousedown (event) {
          event.prevent = true
        }
      }
    }
  }
  const app = render(elem)
  trigger(app.childNodes[0], 'mousedown')
  t.ok('prevent events')
  t.end()
})

test('basic - up, move, down', (t) => {
  const cases = {
    move: [ 'mousemove', 'touchmove' ],
    down: [ 'mousedown', 'touchstart' ],
    up: [ 'mouseup', 'touchend' ]
  }
  for (let type in cases) {
    let cnt = 0
    let app = render({
      on: { [type] () {
        cnt++
      }}
    })
    for (let i in cases[type]) {
      trigger(app, cases[type][i])
    }
    t.equal(cnt, cases[type].length, `fired for each sub-type "${type}"`)
  }
  t.end()
})

test('basic - remove', (t) => {
  var remove = 0
  var create = 0
  const elem = new Element({
    types: {
      simple: { on: { down () {} } },
      custom: {
        on: {
          properties: {
            hello: {
              createEvent () {
                create++
              },
              removeEvent () {
                remove++
              }
            }
          },
          hello () {}
        }
      }
    },
    a: {
      type: 'simple',
      on: null
    },
    b: {
      type: 'simple',
      on: {
        down: null
      }
    },
    c: {
      type: 'simple',
      on: {
        up: true,
        down: null
      }
    },
    d: {
      type: 'custom',
      on: {
        hello: null
      }
    },
    e: {
      type: 'custom',
      on: {
        field: {}
      }
    }
  })
  t.equal(elem.a.hasEvents, null, 'removed hasEvents from "elem.a"')
  t.equal(elem.b.hasEvents, null, 'removed hasEvents from "elem.b"')
  t.ok(elem.c.hasEvents !== null, '"elem.c" has events')
  t.equal(remove, 1, 'fired removeEvent for custom event')
  t.equal(create, 1, 'fired createEvent for custom event')
  t.equal(elem.b.hasEvents, null, 'removed hasEvents from "elem.e"')
  t.end()
})