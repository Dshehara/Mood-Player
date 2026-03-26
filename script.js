const moods = {
  happy: {
    bg: "linear-gradient(135deg,#f6d365,#fda085)",
    cover: "images/happy.jpg",
    songs: [
      { title: "happy-childrens", artist: "Unknown Artist", src: "https://pixabay.com/music/happy-childrens-tunes-happy-444082/" },
      { title: "modern-classical-relaxing", artist: "Unknown Artist", src: "https://pixabay.com/music/modern-classical-relaxing-happy-piano-291014/" },
      { title: "modern-classical-golden-sunset", artist: "Unknown Artist", src: "https://pixabay.com/music/modern-classical-golden-sunset-piano-music-200136/" },
      { title: "modern-classical-piano-melody", artist: "Unknown Artist", src: "https://pixabay.com/music/modern-classical-piano-melody-277609/" },
      { title: "happy-childrens-tunes", artist: "Unknown Artist", src: "https://pixabay.com/music/happy-childrens-tunes-upbeat-energy-happy-folk-157754/" }
    ]
  },
  sad: {
    bg: "linear-gradient(135deg,#4facfe,#00f2fe)",
    cover: "images/sad.jpg",
    songs: [
      { title: "solo-piano-sad", artist: "Unknown Artist", src: "https://pixabay.com/music/solo-piano-sad-sad-music-485935/" },
      { title: "solo-piano1", artist: "Unknown Artist", src: "https://pixabay.com/music/solo-piano-sad-sad-music-490012/" },
      { title: "solo-piano2", artist: "Unknown Artist", src: "https://pixabay.com/music/solo-piano-sad-sad-music-499904/" },
      { title: "drama-scene-sad", artist: "Unknown Artist", src: "https://pixabay.com/music/drama-scene-sad-sad-piano-music-311697/" }
    ]
  },
  chill: {
    bg: "linear-gradient(135deg,#43e97b,#38f9d7)",
    cover: "images/chill.jpg",
    songs: [
      { title: "beats-chill", artist: "Unknown Artist", src: "https://pixabay.com/music/beats-chill-chill-music-505125/" },
      { title: "sweet-life-luxury", artist: "Unknown Artist", src: "https://pixabay.com/music/beats-sweet-life-luxury-chill-438146/" },
      { title: "chill-beats", artist: "Unknown Artist", src: "https://pixabay.com/music/beats-chill-beats-chill-491676/" }
    ]
  },
  energy: {
    bg: "linear-gradient(135deg,#fa709a,#fee140)",
    cover: "images/energy.jpg",
    songs: [
      { title: "sport-rock", artist: "Unknown Artist", src: "https://pixabay.com/music/rock-energy-catcher-a-sport-rock-183632/" },
      { title: "percussion-drum-action", artist: "Unknown Artist", src: "https://pixabay.com/music/percussion-drum-action-energy-493409/" },
      { title: "gaming-sport-beat", artist: "Unknown Artist", src: "https://pixabay.com/music/trap-energy-gaming-sport-beat-347787/" },
      { title: "energy-pop", artist: "Unknown Artist", src: "https://pixabay.com/music/future-bass-energy-pop-198537/" }
    ]
  }
};

let currentMood = localStorage.getItem("mood") || "happy";
let songs = moods[currentMood].songs;
let index = 0;
let isShuffle = false;
let isRepeat = false;

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const player = document.querySelector(".player");

const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const playlist = document.getElementById("playlist");

/* Load Mood */
function loadMood(moodName) {
  currentMood = moodName;
  localStorage.setItem("mood", currentMood);

  songs = moods[currentMood].songs;
  index = 0;

  document.body.style.background = moods[currentMood].bg;
  cover.src = moods[currentMood].cover;

  /* ⭐ highlight mood */
  document.querySelectorAll(".mood").forEach(btn => {
      btn.classList.remove("active");
  });
  document.querySelector(`[data-mood="${currentMood}"]`).classList.add("active");

  loadSong(songs[index]);
  loadPlaylist();
}

/* Load Song */
function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;
}

/* Play / Pause */
playBtn.onclick = () => {
  audio.paused ? audio.play() : audio.pause();
};

/* Sync UI */
audio.addEventListener("play", () => {
  playBtn.textContent = "⏸";
  player.classList.add("playing");
});

audio.addEventListener("pause", () => {
  playBtn.textContent = "▶";
  player.classList.remove("playing");
});

/* Next / Prev */
document.getElementById("next").onclick = nextSong;
document.getElementById("prev").onclick = prevSong;

function nextSong() {
  if (isShuffle) {
    index = Math.floor(Math.random() * songs.length);
  } else {
    index = (index + 1) % songs.length;
  }
  loadSong(songs[index]);
  loadPlaylist();
  audio.play();
}

function prevSong() {
  index = (index - 1 + songs.length) % songs.length;
  loadSong(songs[index]);
  loadPlaylist();
  audio.play();
}

/* Shuffle */
document.getElementById("shuffle").onclick = () => {
  isShuffle = !isShuffle;
};

/* Repeat */
document.getElementById("repeat").onclick = () => {
  isRepeat = !isRepeat;
  audio.loop = isRepeat;
};

/* Volume */
document.getElementById("volume").oninput = e => {
  audio.volume = e.target.value;
};

/* Progress + Time */
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + "%";
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

/* Seek */
document.querySelector(".progress-container").onclick = e => {
  const width = e.currentTarget.clientWidth;
  audio.currentTime = (e.offsetX / width) * audio.duration;
};

/* Format time */
function formatTime(time) {
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m}:${s < 10 ? '0' + s : s}`;
}

/* Playlist */
function loadPlaylist() {
  playlist.innerHTML = "";

  songs.forEach((song, i) => {
    const div = document.createElement("div");
    div.className = "song";

    if (i === index) div.classList.add("active");

    div.innerText = `${song.title} — ${song.artist}`;

    div.onclick = () => {
      index = i;
      loadSong(song);
      loadPlaylist();
      audio.play();
    };

    playlist.appendChild(div);
  });
}

/* Loader */
window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loader").classList.add("hide");
    }, 2000); // 2 seconds
});

/* Mood buttons */
document.querySelectorAll(".mood").forEach(btn => {
  btn.onclick = () => {
    loadMood(btn.dataset.mood);
  };
});

/* Init */
loadMood(currentMood);
