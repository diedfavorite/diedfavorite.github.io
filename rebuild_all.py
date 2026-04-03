with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

missing_part1 = """    <!-- loops window -->
    <div class="window desktop-window draggable hidden" id="window-loops" style="width: 380px; top: 30%; left: 40%;">
      <div class="title-bar">
        <div class="title-bar-text">loops.exe</div>
        <div class="title-bar-controls">
          <button aria-label="Minimize" onclick="minimizeWindow('window-loops')"></button>
          <button aria-label="Maximize" onclick="maximizeWindow('window-loops')"></button>
          <button aria-label="Close" onclick="closeWindow('window-loops')"></button>
        </div>
      </div>
      <div class="window-body">
        <fieldset>
          <legend>loops</legend>
          <div class="track-list" id="loops-content" style="max-height: 250px; overflow-y: auto;">
            <div class="win95-media-player">
              <div class="media-title">children , 4 bars loop</div>
              <audio id="audio-loops-1" src="loops/Children , 4 Bars Loop , Each Stems , Spacing 1 Bar.mp3"></audio>
              <div class="media-controls">
                <button onclick="playMedia('audio-loops-1')">&#9654;</button>
                <button onclick="pauseMedia('audio-loops-1')"><strong>||</strong></button>
                <button onclick="stopMedia('audio-loops-1')">&#9632;</button>
                <button onclick="confirmDownload('loops/Children , 4 Bars Loop , Each Stems , Spacing 1 Bar.mp3', 'Children , 4 Bars Loop , Each Stems , Spacing 1 Bar.mp3')" title="Save / Download"><img src="https://win98icons.alexmeub.com/icons/png/save-0.png" width="14" height="14" style="image-rendering:pixelated"></button>
                <input type="range" class="media-slider" id="slider-audio-loops-1" value="0" step="0.1" oninput="seekMedia('audio-loops-1', this.value)">
                <div class="media-time sunken-panel" id="time-audio-loops-1">00:00</div>
              </div>
            </div>
            <div class="win95-media-player">
              <div class="media-title">jessie , 4 bars loop</div>
              <audio id="audio-loops-2" src="loops/Jessie , 4 Bars Loop , Each Stems , Spacing 1 Bar.mp3"></audio>
              <div class="media-controls">
                <button onclick="playMedia('audio-loops-2')">&#9654;</button>
                <button onclick="pauseMedia('audio-loops-2')"><strong>||</strong></button>
                <button onclick="stopMedia('audio-loops-2')">&#9632;</button>
                <button onclick="confirmDownload('loops/Jessie , 4 Bars Loop , Each Stems , Spacing 1 Bar.mp3', 'Jessie , 4 Bars Loop , Each Stems , Spacing 1 Bar.mp3')" title="Save / Download"><img src="https://win98icons.alexmeub.com/icons/png/save-0.png" width="14" height="14" style="image-rendering:pixelated"></button>
                <input type="range" class="media-slider" id="slider-audio-loops-2" value="0" step="0.1" oninput="seekMedia('audio-loops-2', this.value)">
                <div class="media-time sunken-panel" id="time-audio-loops-2">00:00</div>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </div>

    <!-- video window -->
    <div class="window desktop-window draggable hidden" id="window-video" style="width: 420px; top: 15%; left: 35%;">
      <div class="title-bar">
        <div class="title-bar-text">Videos</div>
        <div class="title-bar-controls">
          <button aria-label="Minimize" onclick="minimizeWindow('window-video')"></button>
          <button aria-label="Maximize" onclick="maximizeWindow('window-video')"></button>
          <button aria-label="Close" onclick="closeWindow('window-video')"></button>
        </div>
      </div>
      <div class="window-body">
        <div style="background:#000080; color:#fff; padding:4px 8px; font-weight:bold; display:flex; align-items:center; gap:6px;">
          <img src="https://win98icons.alexmeub.com/icons/png/media_player-0.png" width="16" height="16">
          <span id="video-status">Jessie</span>
        </div>
        <div style="display:flex; gap:0; background:#c0c0c0;">
          <div style="flex:1; padding:6px; display:flex; flex-direction:column; gap:4px;">
            <video id="video-main" src="videos/Jessie.mp4" playsinline style="width:100%; height:160px; object-fit:contain; background:#000; box-shadow:inset 2px 2px #808080, inset -2px -2px #fff; display:block;"></video>
            <!-- transport controls -->
            <div style="display:flex; align-items:center; gap:2px; background:#c0c0c0; padding:1px 0;">
              <button onclick="playMedia('video-main')" style="min-width:20px; height:20px; font-size:10px; padding:0;">&#9654;</button>
              <button onclick="pauseMedia('video-main')" style="min-width:20px; height:20px; font-size:10px; padding:0;"><strong>||</strong></button>
              <button onclick="stopMedia('video-main')" style="min-width:20px; height:20px; font-size:10px; padding:0;">&#9632;</button>
              <button onclick="fullscreenVideo('video-main')" style="min-width:20px; height:20px; font-size:10px; padding:0; font-weight:bold;">&#9633;</button>
              <input type="range" id="slider-video-main" class="media-slider" value="0" step="0.1" oninput="seekMedia('video-main', this.value)" style="flex:1; margin:0 3px;">
              <div class="media-time sunken-panel" id="time-video-main" style="width:40px; text-align:center; background:#000; color:#00ff00; font-family:'Courier New',monospace; font-size:10px; padding:2px;">00:00</div>
            </div>
          </div>
          <!-- playlist panel -->
          <div style="width:120px; padding:6px; padding-left:0; display:flex; flex-direction:column; gap:2px;">
            <div style="font-size:11px; font-weight:bold; margin-bottom:2px;">Playlist</div>
            <div class="sunken-panel playlist-item playlist-select" id="vpl-0" onclick="switchVideo('videos/Jessie.mp4', 'Jessie', 0)" style="background:#000080; color:#fff;">Jessie</div>
            <div class="sunken-panel playlist-item" id="vpl-1" onclick="switchVideo('videos/Speedrun , 140 , + 50 Cents.mp4', 'Speedrun', 1)">Speedrun</div>
            <div class="sunken-panel playlist-item" id="vpl-2" onclick="switchVideo('videos/New , Season , 140.mp4', 'New Season', 2)">New Season</div>
          </div>
        </div>
      </div>
    </div>

    <!-- socials window -->
    <div class="window desktop-window draggable hidden" id="window-socials" style="width: 280px; top: 40%; left: 50%;">
      <div class="title-bar">
        <div class="title-bar-text">social medias</div>
        <div class="title-bar-controls">
          <button aria-label="Minimize" onclick="minimizeWindow('window-socials')"></button>
          <button aria-label="Maximize" onclick="maximizeWindow('window-socials')"></button>
          <button aria-label="Close" onclick="closeWindow('window-socials')"></button>
        </div>
      </div>
      <div class="window-body">
        <ul class="tree-view">
          <li><strong>Links</strong>
            <ul>
              <li><a href="https://soundcloud.com/diedfavorite" target="_blank"><img src="https://win98icons.alexmeub.com/icons/png/sndvol32_main-0.png" width="16" height="16" style="vertical-align:middle; margin-right:4px;">SoundCloud</a></li>
              <li><a href="https://www.youtube.com/channel/UCBbEHHbCSTX5fPUr0oUWcsA" target="_blank"><img src="https://win98icons.alexmeub.com/icons/png/movie_maker-0.png" width="16" height="16" style="vertical-align:middle; margin-right:4px;">YouTube</a></li>
              <li><a href="https://www.instagram.com/diedfavorite/" target="_blank"><img src="https://win98icons.alexmeub.com/icons/png/camera3-0.png" width="16" height="16" style="vertical-align:middle; margin-right:4px;">Instagram</a></li>
              <li><a href="https://discord.gg/3BmCPz6w" target="_blank"><img src="https://win98icons.alexmeub.com/icons/png/msg_information-0.png" width="16" height="16" style="vertical-align:middle; margin-right:4px;">Discord</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>

    <!-- licensing window -->
    <div class="window desktop-window draggable hidden" id="window-licensing" style="width: 320px; top: 25%; left: 45%;">
      <div class="title-bar">
        <div class="title-bar-text">licensing.txt - Notepad</div>
        <div class="title-bar-controls">
          <button aria-label="Minimize" onclick="minimizeWindow('window-licensing')"></button>
          <button aria-label="Maximize" onclick="maximizeWindow('window-licensing')"></button>
          <button aria-label="Close" onclick="closeWindow('window-licensing')"></button>
        </div>
      </div>
      <div class="window-body">
        <textarea style="width: 100%; height: 200px; font-family: 'Courier New', monospace; font-size: 12px; resize: none;" readonly>
FREE FOR PROFIT LICENSE

All beats and loops provided are completely FREE FOR PROFIT use.

REQUIREMENT:
You MUST credit @diedfavorite wherever the song is released (title, description, or credits).
Example: "prod. @diedfavorite"

Thank you for your support.
        </textarea>
      </div>
    </div>

    <!-- recycle bin window -->
    <div class="window desktop-window draggable hidden" id="window-recyclebin" style="width: 300px; top: 35%; left: 35%;">
      <div class="title-bar">
        <div class="title-bar-text">Recycle Bin</div>
        <div class="title-bar-controls">
          <button aria-label="Minimize" onclick="minimizeWindow('window-recyclebin')"></button>
          <button aria-label="Maximize" onclick="maximizeWindow('window-recyclebin')"></button>
          <button aria-label="Close" onclick="closeWindow('window-recyclebin')"></button>
        </div>
      </div>
      <div class="window-body">
        <div style="background:#fff; border:2px inset #dfdfdf; height:150px; display:flex; align-items:center; justify-content:center; color:#808080; font-style:italic;">
          Recycle Bin is empty
        </div>
        <div style="margin-top:8px; display:flex; justify-content:flex-end;">
          <button onclick="closeWindow('window-recyclebin')">Close</button>
        </div>
      </div>
    </div>

    <!-- display properties window -->
    <div class="window desktop-window draggable hidden" id="window-display" style="width: 350px; top: 15%; left: 30%;">
      <div class="title-bar">
        <div class="title-bar-text">Display Properties</div>
        <div class="title-bar-controls">
          <button aria-label="Minimize" onclick="minimizeWindow('window-display')"></button>
          <button aria-label="Maximize" onclick="maximizeWindow('window-display')"></button>
          <button aria-label="Close" onclick="closeWindow('window-display')"></button>
        </div>
      </div>
      <div class="window-body">
        <!-- monitor preview -->
        <div style="display:flex; justify-content:center; margin-bottom:10px;">
          <div style="width:160px; height:120px; border:8px solid #c0c0c0; border-radius:4px 4px 0 0; background:#000; position:relative; box-shadow:inset 1px 1px #fff, inset -1px -1px #808080;">
            <div id="bg-preview" style="position:absolute; top:4px; left:4px; right:4px; bottom:4px; background:#008080;"></div>
            <div style="position:absolute; bottom:-12px; left:50%; transform:translateX(-50%); width:60px; height:12px; background:#c0c0c0; border-radius:0 0 2px 2px;"></div>
          </div>
        </div>

        <div style="display:flex; gap:10px;">
          <!-- Section 1: Solid Colors -->
          <fieldset style="flex:1; margin:0; padding:6px 8px;">
            <legend style="font-size:11px;">Solid Color</legend>
            <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:4px;">
              <div class="bg-swatch" style="background:#008080;" onclick="selectBg(this, '#008080')" title="Teal (Default)"></div>
              <div class="bg-swatch" style="background:#000080;" onclick="selectBg(this, '#000080')" title="Navy"></div>
              <div class="bg-swatch" style="background:#800000;" onclick="selectBg(this, '#800000')" title="Maroon"></div>
              <div class="bg-swatch" style="background:#808000;" onclick="selectBg(this, '#808000')" title="Olive"></div>
              <div class="bg-swatch" style="background:#800080;" onclick="selectBg(this, '#800080')" title="Purple"></div>
              <div class="bg-swatch" style="background:#c0c0c0;" onclick="selectBg(this, '#c0c0c0')" title="Silver"></div>
              <div class="bg-swatch" style="background:#000000;" onclick="selectBg(this, '#000000')" title="Black"></div>
              <div class="bg-swatch" style="background:#ff0000;" onclick="selectBg(this, '#ff0000')" title="Red"></div>
              <div class="bg-swatch" style="background:#00ff00;" onclick="selectBg(this, '#00ff00')" title="Green"></div>
              <div class="bg-swatch" style="background:#0000ff;" onclick="selectBg(this, '#0000ff')" title="Blue"></div>
            </div>
          </fieldset>
"""

missing_part2 = """  <!-- start menu -->
  <div id="start-menu" class="hidden" style="position:fixed; bottom:30px; left:0; width:180px; background:#c0c0c0; border-top:2px solid #dfdfdf; border-left:2px solid #dfdfdf; border-right:2px solid #000; border-bottom:2px solid #000; z-index:99999; display:flex; padding:2px;">
    <!-- vertical banner -->
    <div style="width:24px; background:#000080; display:flex; align-items:flex-end; padding-bottom:5px;">
      <span style="color:#c0c0c0; writing-mode:vertical-rl; transform:rotate(180deg); font-family:Arial,sans-serif; font-weight:bold; font-size:16px;">
        <span style="color:#fff;">Windows</span> 95
      </span>
    </div>
    <!-- menu items -->
    <div style="flex:1; display:flex; flex-direction:column; padding:2px;">
      <div class="menu-item" onclick="openWindow('window-beats')">
        <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-0.png" width="24" height="24">
        <span>Beats</span>
      </div>
      <div class="menu-item" onclick="openWindow('window-loops')">
        <img src="https://win98icons.alexmeub.com/icons/png/directory_closed-0.png" width="24" height="24">
        <span>Loops</span>
      </div>
      <div class="menu-item" onclick="openWindow('window-video')">
        <img src="https://win98icons.alexmeub.com/icons/png/media_player-0.png" width="24" height="24">
        <span>Videos</span>
      </div>
      <div class="menu-item" onclick="openWindow('window-socials')">
        <img src="https://win98icons.alexmeub.com/icons/png/network_normal_two_pcs-0.png" width="24" height="24">
        <span>Social Medias</span>
      </div>
      <div class="menu-item" onclick="openWindow('window-display')">
        <img src="https://win98icons.alexmeub.com/icons/png/display_properties-0.png" width="24" height="24">
        <span>Display Properties</span>
      </div>
      <div class="menu-divider"></div>
      <div class="menu-item" onclick="alert('Shutting down...')">
        <img src="https://win98icons.alexmeub.com/icons/png/shut_down_normal-0.png" width="24" height="24">
        <span>Shut Down...</span>
      </div>
    </div>
  </div>

  <!-- desktop context menu -->
  <div id="desktop-contextmenu" class="hidden" style="position:absolute; width:150px; background:#c0c0c0; border-top:1px solid #fff; border-left:1px solid #fff; border-right:1px solid #000; border-bottom:1px solid #000; z-index:99998; padding:2px;">
    <div class="ctx-item" onclick="openWindow('window-display')">Properties</div>
    <div class="menu-divider"></div>
    <div class="ctx-item" onclick="location.reload()">Refresh</div>
  </div>

  <!-- taskbar -->
  <div id="taskbar">
    <button class="start-btn" onclick="toggleStartMenu()">
      <img src="https://win98icons.alexmeub.com/icons/png/windows-0.png" alt="start" class="start-icon-anim">
      <strong>start</strong>
    </button>
    <div class="taskbar-divider"></div>
    <!-- quick launch -->
    <div style="display:flex; align-items:center; gap:3px; padding:0 4px;">
      <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-0.png" width="16" height="16" style="image-rendering:pixelated; cursor:pointer;" onclick="openWindow('window-beats')" title="Beats">
      <img src="https://win98icons.alexmeub.com/icons/png/directory_closed-0.png" width="16" height="16" style="image-rendering:pixelated; cursor:pointer;" onclick="openWindow('window-loops')" title="Loops">
      <img src="https://win98icons.alexmeub.com/icons/png/media_player-0.png" width="16" height="16" style="image-rendering:pixelated; cursor:pointer;" onclick="openWindow('window-video')" title="Videos">
    </div>
    <div class="taskbar-divider"></div>
    <!-- Now Playing Container -->
    <div id="now-playing-container" style="display:none; align-items:center; gap:4px; padding:0 4px; box-shadow:inset -1px -1px #fff, inset 1px 1px #808080; background:#000; height:22px; width:130px; overflow:hidden; flex-shrink:0; cursor:default; margin-right:4px;">
      <img src="https://win98icons.alexmeub.com/icons/png/media_player_stream_sun-0.png" width="14" height="14" style="flex-shrink:0;">
      <div style="width:100%; overflow:hidden;">
        <span id="now-playing-text" style="color:#00ff00; font-family:'Courier New', monospace; font-size:10px; white-space:nowrap; display:inline-block;"></span>
      </div>
    </div>
    <div id="taskbar-items">
      <!-- active windows appear here -->
    </div>
    <div class="taskbar-divider"></div>
    <div id="tray">
      <img src="https://win98icons.alexmeub.com/icons/png/loudspeaker_rays-0.png" width="16" height="16" title="Volume" style="cursor:pointer;" onclick="toggleVolumePopup(event)">
      <span id="tray-date" style="margin:0 4px; font-weight:normal;"></span>
      <span id="clock">12:00 pm</span>
    </div>
  </div>
"""

# Now we inject missing_part1 before <!-- Section 2: Patterns -->
import re
html = re.sub(r'(<!-- Section 2: Patterns -->)', lambda m: missing_part1 + '\n        ' + m.group(1), html)

# Inject missing_part2 before <!-- volume popup -->
html = re.sub(r'(<!-- volume popup -->)', lambda m: missing_part2 + '\n  ' + m.group(1), html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
