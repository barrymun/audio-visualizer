(() => {
  const audio: HTMLMediaElement = (document.getElementById('audio') as HTMLMediaElement)!;
  const visualizer: HTMLDivElement = (document.getElementById('visualizer') as HTMLDivElement)!;
  const audioCtx = new AudioContext();
  const audioSrc: MediaElementAudioSourceNode = audioCtx.createMediaElementSource(audio!);
  const analyser: AnalyserNode = audioCtx.createAnalyser();
  // analyser.fftSize = 64;
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

  const clamp = (num: number, min: number, max: number): number => {
    if (num >= max) return max;
    if (num <= min) return min;
    return num;
  }

  const animate = (): void => {
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(dataArray);
    for (let i: number = 0; i < bufferLength; i++) {
      let item = dataArray[i];
      item = item > 150 ? item / 1.5 : item * 1.5;
      spanElements[i].style.transform = `rotateZ(${i * (360 / bufferLength)}deg) translate(-50%, ${clamp(item, 100, 150)}px)`;
      // spanElements[i].style.transform = `rotateZ(${i * (360 / bufferLength)}deg) translate(-50%, 100px)`;
    }
  };
  animate();

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

})();

export {}