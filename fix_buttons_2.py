import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace play button line
html = re.sub(r'<button onclick="playMedia\(([^)]+)\)".*?>.*?(?=<button onclick="pauseMedia)',
              r'<button onclick="playMedia(\1)">&#9654;</button>\n                ', html, flags=re.DOTALL)

# Replace pause button line
html = re.sub(r'<button onclick="pauseMedia\(([^)]+)\)".*?>.*?(?=<button onclick="stopMedia)',
              r'<button onclick="pauseMedia(\1)"><strong>||</strong></button>\n                ', html, flags=re.DOTALL)

# Replace stop button line
html = re.sub(r'<button onclick="stopMedia\(([^)]+)\)".*?>.*?(?=<button.*confirmDownload|<button.*fullscreen)',
              r'<button onclick="stopMedia(\1)">&#9632;</button>\n                ', html, flags=re.DOTALL)

# Replace save button line
html = re.sub(r'<button[^>]*onclick="confirmDownload\(([^,]+),([^)]+)\)"[^>]*>.*?(?=<input)',
              r'<button onclick="confirmDownload(\1,\2)" title="Save / Download"><img src="https://win98icons.alexmeub.com/icons/png/save-0.png" width="14" height="14" style="image-rendering:pixelated"></button>\n                ', html, flags=re.DOTALL)

# Replace fullscreen button line
html = re.sub(r'<button onclick="fullscreenVideo\(([^)]+)\)"[^>]*>.*?(?=<input)',
              r'<button onclick="fullscreenVideo(\1)" style="min-width:20px; height:20px; font-size:10px; padding:0; font-weight:bold;">&#9633;</button>\n              ', html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
