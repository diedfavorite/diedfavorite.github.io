import re

def build_beat(title, filename, i):
    return f"""            <div class="win95-media-player">
              <div class="media-title">{title}</div>
              <audio id="audio-beats-{i}" src="beats/{filename}"></audio>
              <div class="media-controls">
                <button onclick="playMedia('audio-beats-{i}')">&#9654;</button>
                <button onclick="pauseMedia('audio-beats-{i}')"><strong>||</strong></button>
                <button onclick="stopMedia('audio-beats-{i}')">&#9632;</button>
                <button onclick="confirmDownload('beats/{filename}', '{filename}')" title="Save / Download"><img src="https://win98icons.alexmeub.com/icons/png/save-0.png" width="14" height="14" style="image-rendering:pixelated"></button>
                <input type="range" class="media-slider" id="slider-audio-beats-{i}" value="0" step="0.1" oninput="seekMedia('audio-beats-{i}', this.value)">
                <div class="media-time sunken-panel" id="time-audio-beats-{i}">00:00</div>
              </div>
            </div>"""

def build_loop(title, filename, i):
    return f"""            <div class="win95-media-player">
              <div class="media-title">{title}</div>
              <audio id="audio-loops-{i}" src="loops/{filename}"></audio>
              <div class="media-controls">
                <button onclick="playMedia('audio-loops-{i}')">&#9654;</button>
                <button onclick="pauseMedia('audio-loops-{i}')"><strong>||</strong></button>
                <button onclick="stopMedia('audio-loops-{i}')">&#9632;</button>
                <button onclick="confirmDownload('loops/{filename}', '{filename}')" title="Save / Download"><img src="https://win98icons.alexmeub.com/icons/png/save-0.png" width="14" height="14" style="image-rendering:pixelated"></button>
                <input type="range" class="media-slider" id="slider-audio-loops-{i}" value="0" step="0.1" oninput="seekMedia('audio-loops-{i}', this.value)">
                <div class="media-time sunken-panel" id="time-audio-loops-{i}">00:00</div>
              </div>
            </div>"""

beats = [
    ("children , 143.400 , + 50 cents", "Children , 143.400 , + 50 Cents.mp3"),
    ("claude , code , 160 , + 50 cents", "Claude , Code , 160 , + 50 Cents.mp3"),
    ("jessie , 140 , + 50 cents", "Jessie , 140 , + 50 Cents.mp3"),
    ("new , season , 140", "New , Season , 140.mp3"),
    ("speedrun , 140 , + 50 cents", "Speedrun , 140 , + 50 Cents.mp3")
]

loops = [
    ("children , 4 bars loop", "Children , 4 Bars Loop , Each Stems , Spacing 1 Bar.mp3"),
    ("jessie , 4 bars loop", "Jessie , 4 Bars Loop , Each Stems , Spacing 1 Bar.mp3")
]

video_controls = """<!-- transport controls -->
            <div style="display:flex; align-items:center; gap:2px; background:#c0c0c0; padding:1px 0;">
              <button onclick="playMedia('video-main')" style="min-width:20px; height:20px; font-size:10px; padding:0;">&#9654;</button>
              <button onclick="pauseMedia('video-main')" style="min-width:20px; height:20px; font-size:10px; padding:0;"><strong>||</strong></button>
              <button onclick="stopMedia('video-main')" style="min-width:20px; height:20px; font-size:10px; padding:0;">&#9632;</button>
              <button onclick="fullscreenVideo('video-main')" style="min-width:20px; height:20px; font-size:10px; padding:0; font-weight:bold;">&#9633;</button>
              <input type="range" id="slider-video-main" class="media-slider" value="0" step="0.1" oninput="seekMedia('video-main', this.value)" style="flex:1; margin:0 3px;">
              <div class="media-time sunken-panel" id="time-video-main" style="width:40px; text-align:center; background:#000; color:#00ff00; font-family:'Courier New',monospace; font-size:10px; padding:2px;">00:00</div>
            </div>"""

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Restore Beats
beats_html = "\n".join([build_beat(b[0], b[1], i+1) for i, b in enumerate(beats)])
html = re.sub(r'<div class="track-list" id="beats-content" style="max-height: 250px; overflow-y: auto;">.*?</div>\s*</fieldset>',
              f'<div class="track-list" id="beats-content" style="max-height: 250px; overflow-y: auto;">\n{beats_html}\n          </div>\n        </fieldset>', html, flags=re.DOTALL)

# Restore Loops
loops_html = "\n".join([build_loop(b[0], b[1], i+1) for i, b in enumerate(loops)])
html = re.sub(r'<div class="track-list" id="loops-content" style="max-height: 250px; overflow-y: auto;">.*?</div>\s*</fieldset>',
              f'<div class="track-list" id="loops-content" style="max-height: 250px; overflow-y: auto;">\n{loops_html}\n          </div>\n        </fieldset>', html, flags=re.DOTALL)

# Restore Video
html = re.sub(r'<!-- transport controls -->.*?</div>\s*</div>\s*<!-- playlist panel -->',
              f'{video_controls}\n          </div>\n          <!-- playlist panel -->', html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
