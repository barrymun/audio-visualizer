(() => {
  const MAX_VALUE: number = 255;

  const audio: HTMLMediaElement = (document.getElementById('audio') as HTMLMediaElement)!;
  const visualizer: HTMLDivElement = (document.getElementById('visualizer') as HTMLDivElement)!;
  const audioCtx = new AudioContext();
  const audioSrc: MediaElementAudioSourceNode = audioCtx.createMediaElementSource(audio!);
  const analyser: AnalyserNode = audioCtx.createAnalyser();
  /**
   * w.r.t. analyser.fftSize: (64, 128, 256 tested. 128 seems the most appropriate)
   * "A higher value will result in more details in the frequency domain but fewer details in the time domain."
   */
  analyser.fftSize = 128;
  analyser.smoothingTimeConstant = 0.85;

  // connect the source back up to the destination, otherwise the sound won't play
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);

  const bufferLength: number = analyser.frequencyBinCount;
  const dataArray: Uint8Array = new Uint8Array(bufferLength);

  let spanElements: Array<HTMLSpanElement> = [];
  for (let i: number = 0; i < bufferLength; i++) {
    const spanElement: HTMLSpanElement = document.createElement('span');
    spanElement.classList.add('visualizer-node');
    spanElements.push(spanElement);
    visualizer.appendChild(spanElement);
  }

  /**
   * based on https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteFrequencyData
   * note that "The frequency data is composed of integers on a scale from 0 to 255." - as per the docs
   */
  const animate = (): void => {
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(dataArray);
    for (let i: number = 0; i < bufferLength; i++) {
      let val = dataArray[i];
      if (val < (MAX_VALUE / 4)) val *= 2;
      else if (val < (MAX_VALUE / 2)) val *= 1.2;
      else if (val < (MAX_VALUE / 4) * 3) val /= 1.2;
      else val /= 2;
      // TODO: change this based on the window height (css media queries alone will not be enough)
      spanElements[i].style.transform = `rotateZ(${i * (360 / bufferLength)}deg) translate(-50%, ${val * 0.03}rem)`;
    }
  };
  animate();

  const getIsPlaying = (): boolean => document.body.dataset.playing === "true";

  const togglePlayPauseState = (): void => {
    let isPlaying: boolean = getIsPlaying();
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

})();

export {}