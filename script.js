const moods = {
  happy: {
    bg: "linear-gradient(135deg,#f6d365,#fda085)",
    cover: "images/happy.jpg",
    songs: [
      { title: "last-days-of-summer", artist: "Unknown Artist", src: "songs/last-days-of-summer-happy.mp3" },
      { title: "bombinsound", artist: "Unknown Artist", src: "songs/bombinsound-happy.mp3" },
      { title: "beautiful-dream", artist: "Unknown Artist", src: "songs/beautiful-dream.mp3" },
      { title: "last-days-of-summer", artist: "Unknown Artist", src: "songs/last-days-of-summer-happy.mp3" },
      { title: "everything-for-me-is-your", artist: "Unknown Artist", src: "songs/everything-for-me-is-your-happy.mp3" }
    ]
  },
  sad: {
    bg: "linear-gradient(135deg,#4facfe,#00f2fe)",
    cover: "images/sad.jpg",
    songs: [
      { title: "the_mountain", artist: "Unknown Artist", src: "songs/the_mountain-sad.mp3" },
      { title: "krasnoshchok", artist: "Unknown Artist", src: "songs/krasnoshchok-sad.mp3" },
      { title: "remembering-you", artist: "Unknown Artist", src: "songs/remembering-you-sad.mp3" },
      { title: "when-you-are-not-with-me", artist: "Unknown Artist", src: "songs/when-you-are-not-with-me-sad.mp3" }
    ]
  },
  chill: {
    bg: "linear-gradient(135deg,#43e97b,#38f9d7)",
    cover: "images/chill.jpg",
    songs: [
      { title: "nastelbom-lofi", artist: "Unknown Artist", src: "songs/nastelbom-lofi-chill.mp3" },
      { title: "paulyudin", artist: "Unknown Artist", src: "songs/paulyudin-chill.mp3" },
      { title: "pretty john", artist: "Unknown Artist", src: "songs/prettyjohn-chill.mp3" }
    ]
  },
  energy: {
    bg: "linear-gradient(135deg,#fa709a,#fee140)",
    cover: "images/energy.jpg",
    songs: [
      { title: "alec_koff-drum-action", artist: "Unknown Artist", src: "songs/alec_koff-drum-action-energy.mp3" },
      { title: "paulyudin-sport", artist: "Unknown Artist", src: "songs/paulyudin-sport-energy.mp3" },
      { title: "the_mountain", artist: "Unknown Artist", src: "songs/the_mountain-energy.mp3" },
      { title: "tunetank-energy-gaming", artist: "Unknown Artist", src: "songs/tunetank-energy-gaming-energy.mp3" }
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