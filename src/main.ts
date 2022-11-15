(() => {
  const audio: HTMLMediaElement = (document.getElementById('audio') as HTMLMediaElement)!;
  const canvas: HTMLCanvasElement = (document.getElementById('canvas') as HTMLCanvasElement)!;
  const canvasCtx: CanvasRenderingContext2D = canvas.getContext("2d")!;
  const audioCtx = new AudioContext();
  const audioSrc: MediaElementAudioSourceNode = audioCtx.createMediaElementSource(audio!);
  const analyser: AnalyserNode = audioCtx.createAnalyser();
  analyser.fftSize = 128;
  analyser.smoothingTimeConstant = 0.85;

  // connect the source back up to the destination, otherwise the sound won't play
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);

  const getIsPlaying = (): boolean => document.body.dataset.playing === "true";

  const togglePlayPauseState = (): void => {
    let isPlaying: boolean = getIsPlaying();
    // change the display text
    playBtn!.innerText = isPlaying ? "Play" : "Pause";
    // toggle the playing data var
    document.body.dataset.playing = isPlaying ? "false" : "true";
  };

  // audio ended listener
  audio.addEventListener('ended', () => togglePlayPauseState());

  const playBtn: HTMLElement = document.getElementById('play')!;
  playBtn.addEventListener("click", (): void => {

    // check if context is in suspended state (autoplay policy)
    // audio will not play if the context is suspended after a page reload for example
    if (audioCtx.state === 'suspended') audioCtx.resume();

    let isPlaying: boolean = getIsPlaying();

    // play/pause the music
    if (isPlaying) audio.pause();
    else audio.play();

    togglePlayPauseState();
  });

  const bufferLength: number = analyser.frequencyBinCount;
  const dataArray: Uint8Array = new Uint8Array(bufferLength);
  const barWidth: number = canvas.width / bufferLength;

  let x: number = 0;
  function animate(): void {
    x = 0;
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i: number = 0; i < bufferLength; i++) {
      let barHeight: number = dataArray[i] * 0.5;
      canvasCtx.fillStyle = "white";
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth;
    }
    requestAnimationFrame(animate);
  }
  animate();

})();

export {}