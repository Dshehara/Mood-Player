const moods = {
  happy: {
    bg: "linear-gradient(135deg,#f6d365,#fda085)",
    cover: "images/happy.jpg",
    songs: [
      { title: "Happy Morning", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
      { title: "Sunny Day", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
      { title: "Joy Ride", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
      { title: "Good Vibes", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }
    ]
  },

  sad: {
    bg: "linear-gradient(135deg,#4facfe,#00f2fe)",
    cover: "images/sad.jpg",
    songs: [
      { title: "Lonely Night", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
      { title: "Deep Thoughts", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
      { title: "Blue Rain", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
      { title: "Lost Memories", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" }
    ]
  },

  chill: {
    bg: "linear-gradient(135deg,#43e97b,#38f9d7)",
    cover: "images/chill.jpg",
    songs: [
      { title: "LoFi Relax", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
      { title: "Calm Breeze", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
      { title: "Evening Chill", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3" },
      { title: "Soft Flow", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" }
    ]
  },

  energy: {
    bg: "linear-gradient(135deg,#fa709a,#fee140)",
    cover: "images/energy.jpg",
    songs: [
      { title: "Workout Boost", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3" },
      { title: "Power Run", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3" },
      { title: "High Energy", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" },
      { title: "Fast Lane", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" }
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

  /* highlight mood */
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
