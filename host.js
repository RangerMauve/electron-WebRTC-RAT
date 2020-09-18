const EventEmitter = require('event')
const robot = require('robotjs')
const { desktopCapturer } = require('electron')

class Host extends EventEmitter {
  constructor ({
    simplepeer,
    getUserMedia = getDefultGetUsermedia
  }) {
    super()
    this.simplepeer = simplepeer
    this.getUserMedia = getUserMedia
  }

  async init () {
    this.simplepeer.on('data', (data) => this._handleData(data))

    const sources = await desktopCapturer.getSources({
      types: ['screen']
    })

    if (!sources.length) throw new Error('No screen sources available. Check the electron docs to see if your platform is supported')
    if (sources.length > 1) console.warn('Your computer has more than one screen, this project currently only handles one.')

    const source = sources[0]
    const stream = await this.getUserMedia({
      audio: true,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id
        }
      }
    })
    this.simplepeer.addStream(stream)
  }

  _handleData (data) {
    try {
      const parsed = JSON.parse(data)

      const { command } = parsed

      if (command === 'mouse-move') {
        const { x, y } = parsed
        robot.moveMouse(x, y)
      } else if (command === 'mouse-toggle') {
        const { down, button } = parsed
        robot.mouseToggle(down, button)
      } else if (command === 'key-toggle') {
        const { key, down, modifier } = parsed
        robot.keyToggle(key, down, modifier)
      }
    } catch (e) {
      this.emit('error', e)
    }
  }
}

function getDefultGetUsermedia () {
  if (typeof navigator === 'undefined') throw new Error('Must provide getUserMedia implementation')
  if (typeof (navigator.mediaDevices) === 'undefined') throw new Error('Must provide getUserMedia implementation')
  if (typeof (navigator.mediaDevices.getUserMedia) === 'undefined') throw new Error('Must provide getUserMedia implementation')

  return (...args) => navigator.mediaDevices.getUserMedia(...args)
}

async function create (opts) {
  const host = new Host(opts)

  await host.init()

  return host
}

module.exports = {
  create,
  Host
}
