// music.js - মিউজিক প্লেয়ার অ্যাপ
function launchMusicPlayer() {
  const wrap = document.createElement("div");
  wrap.className = "app-music";
  wrap.innerHTML = `
        <div class="music-header">
            <h2>🎵 Music Player</h2>
            <button class="add-music-btn">➕ Add Music</button>
        </div>
        
        <div class="player-controls">
            <div class="song-info">
                <div class="current-song">No song selected</div>
                <div class="song-time">00:00 / 00:00</div>
            </div>
            
            <div class="control-buttons">
                <button class="prev-btn">⏮️</button>
                <button class="play-btn">▶️</button>
                <button class="pause-btn" style="display:none;">⏸️</button>
                <button class="next-btn">⏭️</button>
                <button class="stop-btn">⏹️</button>
            </div>
            
            <div class="progress-container">
                <input type="range" class="progress-bar" value="0" max="100">
                <div class="volume-control">
                    <span>🔈</span>
                    <input type="range" class="volume-slider" value="70" max="100">
                    <span>🔊</span>
                </div>
            </div>
        </div>
        
        <div class="playlist-section">
            <h3>📋 Playlist</h3>
            <div class="playlist-items"></div>
        </div>
        
        <input type="file" id="music-file-input" accept="audio/*" multiple style="display:none;">
    `;
  const audio = new Audio();
  let currentPlaylist = [];
  let currentSongIndex = -1;
  let isPlaying = false;
  // Event listeners
  const fileInput = wrap.querySelector('#music-file-input');
  const addMusicBtn = wrap.querySelector('.add-music-btn');
  const playBtn = wrap.querySelector('.play-btn');
  const pauseBtn = wrap.querySelector('.pause-btn');
  const prevBtn = wrap.querySelector('.prev-btn');
  const nextBtn = wrap.querySelector('.next-btn');
  const stopBtn = wrap.querySelector('.stop-btn');
  const progressBar = wrap.querySelector('.progress-bar');
  const volumeSlider = wrap.querySelector('.volume-slider');
  const playlistContainer = wrap.querySelector('.playlist-items');
  const currentSongDisplay = wrap.querySelector('.current-song');
  const songTimeDisplay = wrap.querySelector('.song-time');
  
  addMusicBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('audio/')) {
        addToPlaylist(file);
      }
    });
  });
  playBtn.addEventListener('click', playMusic);
  pauseBtn.addEventListener('click', pauseMusic);
  prevBtn.addEventListener('click', playPrevious);
  nextBtn.addEventListener('click', playNext);
  stopBtn.addEventListener('click', stopMusic);
  progressBar.addEventListener('input', (e) => {
    if (audio.duration) {
      audio.currentTime = (e.target.value / 100) * audio.duration;
    }
  });
  volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
  });
  
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('ended', playNext);
  
  function addToPlaylist(file) {
    const song = {
      name: file.name.replace(/\.[^/.]+$/, ""),
      file: file,
      url: URL.createObjectURL(file)
    };
    currentPlaylist.push(song);
    
    const playlistItem = document.createElement('div');
    playlistItem.className = 'playlist-item';
    playlistItem.innerHTML = `
            <span class="song-name">${song.name}</span>
            <button class="play-song-btn">▶️</button>
        `;
    playlistItem.querySelector('.play-song-btn').addEventListener('click', () => {
      playSong(currentPlaylist.length - 1);
    });
    
    playlistContainer.appendChild(playlistItem);
  }
  
  function playSong(index) {
    if (currentPlaylist.length === 0) return;
    
    currentSongIndex = index;
    const song = currentPlaylist[index];
    
    audio.src = song.url;
    audio.play();
    
    currentSongDisplay.textContent = song.name;
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    isPlaying = true;
  }
  
  function playMusic() {
    if (currentPlaylist.length === 0) return;
    if (currentSongIndex === -1) {
      playSong(0);
    } else {
      audio.play();
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'inline-block';
      isPlaying = true;
    }
  }
  
  function pauseMusic() {
    audio.pause();
    playBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    isPlaying = false;
  }
  
  function stopMusic() {
    audio.pause();
    audio.currentTime = 0;
    playBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    isPlaying = false;
  }
  
  function playPrevious() {
    if (currentPlaylist.length === 0) return;
    let newIndex = currentSongIndex - 1;
    if (newIndex < 0) newIndex = currentPlaylist.length - 1;
    
    playSong(newIndex);
  }
  
  function playNext() {
    if (currentPlaylist.length === 0) return;
    let newIndex = currentSongIndex + 1;
    if (newIndex >= currentPlaylist.length) newIndex = 0;
    
    playSong(newIndex);
  }
  
  function updateProgress() {
    if (audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progress;
      
      const currentTime = formatTime(audio.currentTime);
      const duration = formatTime(audio.duration);
      songTimeDisplay.textContent = `${currentTime} / ${duration}`;
    }
  }
  
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  createWindow("Music Player", wrap, "music");
}

// apps.js এ যোগ করুন
apps.music = {
  id: 'music',
  name: 'Music Player',
  icon: '🎵',
  description: 'Play your favorite music',
  isOpen: false,
  launch: launchMusicPlayer
};