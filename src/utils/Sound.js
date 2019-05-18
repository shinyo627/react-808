class Sound {

    constructor(path) {
        const AudioContext = window.AudioContext || window.webkitAudioContext || window.MozAudioContext
        this.audioContext = new AudioContext()
        this.isSafariFixed = false
        this.boundSafariFix = this.safariFix.bind(this)
        window.addEventListener('click', this.boundSafariFix, false)
        if (!this.buffer) this.loadSound(path)
    }

    safariFix() {
        console.log('safariFix', this)
        if (this.isSafariFixed) {
            window.removeEventListener('click', this.boundSafariFix, false)
            console.log('removed listener')
            return
        }
        console.log('running')
        // create empty buffer, connect to speakers and play the file
        var buffer = this.audioContext.createBuffer(1, 1, 22050)
        var source = this.audioContext.createBufferSource()
        source.buffer = buffer
        source.connect(this.audioContext.destination)
        source.start(0)
        this.isSafariFixed = true
    }

    async loadSound(path) {
        this.recorderNode = this.audioContext.createGain()
        this.recorderNode.gain.value = 1
        this.buffer = null
        this.path = path
        const response = await fetch(path)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await this.decodeAudioDataAsync(
            this.audioContext, arrayBuffer
        )
        this.buffer = audioBuffer
    }

    async decodeAudioDataAsync(audioContext, arrayBuffer) {
        return new Promise((resolve, reject) => {
            audioContext.decodeAudioData(
                arrayBuffer,
                buffer => resolve(buffer),
                e => reject(e)
            )
        })
    }

    play(gainValue = 1, rateValue = 1) {
        this.audioContext.resume()
        const gain = this.audioContext.createGain()
        const sound = this.audioContext.createBufferSource()
        gain.gain.value = gainValue
        sound.playbackRate.value = rateValue
        sound.buffer = this.buffer
        sound.connect(gain)
        gain.connect(this.recorderNode)
        gain.connect(this.audioContext.destination)
        sound.start(0)
    }
}

export default Sound
