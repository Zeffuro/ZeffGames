const NOTE_FREQUENCIES = {
    "C0": 16.35, "C#0": 17.32, "D0": 18.35, "D#0": 19.45, "E0": 20.60,
    "F0": 21.83, "F#0": 23.12, "G0": 24.50, "G#0": 25.96, "A0": 27.50,
    "A#0": 29.14, "B0": 30.87,
    "C1": 32.70, "C#1": 34.65, "D1": 36.71, "D#1": 38.89, "E1": 41.20,
    "F1": 43.65, "F#1": 46.25, "G1": 49.00, "G#1": 51.91, "A1": 55.00,
    "A#1": 58.27, "B1": 61.74,
    "C2": 65.41, "C#2": 69.30, "D2": 73.42, "D#2": 77.78, "E2": 82.41,
    "F2": 87.31, "F#2": 92.50, "G2": 98.00, "G#2": 103.83, "A2": 110.00,
    "A#2": 116.54, "B2": 123.47,
    "C3": 130.81, "C#3": 138.59, "D3": 146.83, "D#3": 155.56, "E3": 164.81,
    "F3": 174.61, "F#3": 185.00, "G3": 196.00, "G#3": 207.65, "A3": 220.00,
    "A#3": 233.08, "B3": 246.94,
    "C4": 261.63, "C#4": 277.18, "D4": 293.66, "D#4": 311.13, "E4": 329.63,
    "F4": 349.23, "F#4": 369.99, "G4": 392.00, "G#4": 415.30, "A4": 440.00,
    "A#4": 466.16, "B4": 493.88,
    "C5": 523.25, "C#5": 554.37, "D5": 587.33, "D#5": 622.25, "E5": 659.25,
    "F5": 698.46, "F#5": 739.99, "G5": 783.99, "G#5": 830.61, "A5": 880.00,
    "A#5": 932.33, "B5": 987.77
};

class SoundPlayer {
    constructor(){
        this.type = "sine";
        this.volume = 1;
        this.playTune = {
            ff: () => this.playNotes([
                "C5", "C5", "C5", "C5", "=", "=", 
                "G#4", "=", "=", "A#4", "=", "=", "C5", null,
                "A#4", "C5", "=", "="
            ], 360)
        };
    }

    playNotes(notes, bpm = 120) {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const beatLength = 60 / bpm; // seconds per beat
        let currentTime = context.currentTime;
        let lastOsc = null;

        for (const note of notes) {
            if (note === "=" && lastOsc) {
                // Extend last note
                lastOsc.stop(currentTime + beatLength * 0.9);
                currentTime += beatLength;
                continue;
            }
            const freq = NOTE_FREQUENCIES[note];
            if (!freq) {
                currentTime += beatLength; // handle rest
                continue;
            }

            const osc = context.createOscillator();
            const gain = context.createGain();

            osc.type = this.type;
            osc.frequency.value = freq;

            gain.gain.value = this.volume;

            osc.connect(gain);
            gain.connect(context.destination);

            // Schedule note start/stop
            osc.start(currentTime);
            osc.stop(currentTime + beatLength * 0.9); // 90% of beat for slight gap

            lastOsc = osc;
            currentTime += beatLength;
        }
    }

    setType(type){
        this.type = type;
    }

    setVolume(volume){
        this.volume = volume;
    }
}

export { SoundPlayer }