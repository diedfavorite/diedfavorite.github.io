import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace any text content inside playMedia buttons with an icon
text = re.sub(r'(<button[^>]*onclick="playMedia\([^)]+\)"[^>]*>)[^<]*(<|/button>)', r'\1<img src="https://win98icons.alexmeub.com/icons/png/media_player_stream_sun-0.png" width="12" height="12"></button>', text)

# Replace any text content inside pauseMedia buttons with an icon
text = re.sub(r'(<button[^>]*onclick="pauseMedia\([^)]+\)"[^>]*>)[^<]*(<|/button>)', r'\1<strong style="margin:0 -2px">||</strong></button>', text)

# Replace any text content inside stopMedia buttons with an icon
text = re.sub(r'(<button[^>]*onclick="stopMedia\([^)]+\)"[^>]*>)[^<]*(<|/button>)', r'\1<img src="https://win98icons.alexmeub.com/icons/png/media_player_stream_sun-1.png" width="12" height="12" style="filter: grayscale(1);"></button>', text)

# Replace fullscreenVideo buttons
text = re.sub(r'(<button[^>]*onclick="fullscreenVideo\([^)]+\)"[^>]*>)[^<]*(<|/button>)', r'\1[  ]</button>', text)

# Replace save buttons
text = re.sub(r'(<button[^>]*title="Save / Download"[^>]*>)[^<]*(<|/button>)', r'\1<img src="https://win98icons.alexmeub.com/icons/png/save-0.png" width="12" height="12"></button>', text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
