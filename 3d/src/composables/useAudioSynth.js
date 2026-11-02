import { ref } from 'vue'

class AudioSynthesizer {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.droneOsc = null
    this.isMuted = true
  }

  init() {
    if (this.ctx) return
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return

    this.ctx = new AudioContext()
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime)
    this.masterGain.connect(this.ctx.destination)
  }

  toggle(enable) {
    this.init()
    if (!this.ctx) return false

    if (enable) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume()
      }
      this.isMuted = false
      this.playSwoosh()
    } else {
      this.isMuted = true
    }
    return !this.isMuted
  }

  playSwoosh() {
    if (this.isMuted || !this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.15)
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.35)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(600, now)

    gain.gain.setValueAtTime(0.01, now)
    gain.gain.linearRampToValueAtTime(0.15, now + 0.08)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.36)
  }

  playClick() {
    if (this.isMuted || !this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.08)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.09)
  }
}

const synthInstance = new AudioSynthesizer()

export function useAudioSynth() {
  const isSoundActive = ref(false)

  function toggleSound() {
    isSoundActive.value = synthInstance.toggle(!isSoundActive.value)
  }

  function playSlideSound() {
    synthInstance.playSwoosh()
  }

  function playUiClick() {
    synthInstance.playClick()
  }

  return {
    isSoundActive,
    toggleSound,
    playSlideSound,
    playUiClick
  }
}
