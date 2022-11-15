let audio: HTMLAudioElement | null = document.querySelector('audio');

const playBtn: HTMLElement | null = document.getElementById('play');
playBtn!.onclick = () => {
  const isPlaying: boolean = document.body.dataset.playing === "true";

  // play/pause the music
  if (isPlaying) audio?.pause();
  else audio?.play();
  // change the display text
  playBtn!.innerText = isPlaying ? "Play" : "Pause";
  // toggle the playing data var
  document.body.dataset.playing = isPlaying ? "false" : "true";
};

export {}