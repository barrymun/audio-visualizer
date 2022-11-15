(() => {
  // const AudioContext = window.AudioContext;
  // const audioCtx: AudioContext = new AudioContext();
  const audio: HTMLMediaElement | null = document.querySelector('audio');
  console.log(audio)
  // if (audio == null) return;
  // const track: MediaElementAudioSourceNode = audioCtx.createMediaElementSource(audio!);
  // const analyser = audioCtx.createAnalyser();
  // track.connect(analyser)
  // analyser.connect(audioCtx.destination);
  // console.log(analyser.frequencyBinCount)

  // const gainNode: GainNode = audioCtx.createGain();
  //
  // // panning
  // const pannerOptions = {pan: 0};
  // const panner = new StereoPannerNode(audioCtx, pannerOptions);
  //
  // track.connect(gainNode).connect(panner).connect(audioCtx.destination);

  const playBtn: HTMLElement | null = document.getElementById('play');
  playBtn!.addEventListener("click", () => {
    const isPlaying: boolean = document.body.dataset.playing === "true";

    // play/pause the music
    if (isPlaying) audio!.pause();
    else audio!.play();
    // change the display text
    playBtn!.innerText = isPlaying ? "Play" : "Pause";
    // toggle the playing data var
    document.body.dataset.playing = isPlaying ? "false" : "true";
  });
})()

export {}