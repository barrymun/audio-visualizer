(() => {
  const audio: HTMLMediaElement = (document.getElementById('audio') as HTMLMediaElement)!;
  const canvas: HTMLCanvasElement = (document.getElementById('canvas') as HTMLCanvasElement)!;
  const canvasCtx: CanvasRenderingContext2D = canvas.getContext("2d")!;

  // if (audio == null) return;

  const audioCtx = new AudioContext();
  const audioSrc: MediaElementAudioSourceNode = audioCtx.createMediaElementSource(audio!);
  const analyser: AnalyserNode = audioCtx.createAnalyser();

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

  // connect the source back up to the destination, otherwise the sound won't play
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);

  const playBtn: HTMLElement = document.getElementById('play')!;
  playBtn.addEventListener("click", (): void => {

    // check if context is in suspended state (autoplay policy)
    // audio will not play if the context is suspended after a page reload for example
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const isPlaying: boolean = document.body.dataset.playing === "true";

    // play/pause the music
    if (isPlaying) audio.pause();
    else audio.play();
    // change the display text
    playBtn!.innerText = isPlaying ? "Play" : "Pause";
    // toggle the playing data var
    document.body.dataset.playing = isPlaying ? "false" : "true";
  });

  analyser.fftSize = 128;
  const bufferLength: number = analyser.frequencyBinCount;
  const dataArray: Uint8Array = new Uint8Array(bufferLength);
  const barWidth: number = canvas.width / bufferLength;
  let x = 0;
  function animate() {
    x = 0;
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    for (let i = 0; i < bufferLength; i++) {
      let barHeight = dataArray[i];
      canvasCtx.fillStyle = "white";
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth;
    }
    requestAnimationFrame(animate);
  }
  animate();

})();

export {}