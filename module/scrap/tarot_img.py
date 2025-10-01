#!/usr/bin/env python3
"""
Download the 78 Rider-Waite-Smith tarot cards from Wikimedia Commons.
Images are saved to:
    data/image/cards/<kebab-name>.png
If a file already exists, it is skipped.
"""

import os
import re
import unicodedata
import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

# ------------------------------------------------------------------
# Config
# ------------------------------------------------------------------
WIKI_URL = "https://en.wikipedia.org/wiki/Rider%E2%80%93Waite_Tarot"
SAVE_DIR = "data/image/cards"
HEADERS = {
    # Polite User-Agent as required by Wikimedia
    "User-Agent": "Tarot-Reader-Downloader/1.0 (https://github.com/trungthanhnguyenn)"
}

# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------
def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^\w\s-]", "", text).strip().lower()
    return re.sub(r"[-\s]+", "-", text)

def collect_cards() -> list[tuple[str, str]]:
    html = requests.get(WIKI_URL, headers=HEADERS, timeout=30).text
    soup = BeautifulSoup(html, "html.parser")
    galleries = soup.select("ul.gallery.mw-gallery-nolines")

    cards = []
    for g in galleries:
        for li in g.select("li.gallerybox"):
            title = (li.get("title") or li.select_one(".gallerytext").get_text(strip=True))
            title = re.sub(r"^\d+\s*[-–—]\s*", "", title)
            title = re.sub(r"^\s*I+\s*[-–—]\s*", "", title)

            img = li.find("img")
            if not img:
                continue
            src = img["src"]
            src = re.sub(r"/\d+px-[^/]+$", "/250px-" + src.split("/")[-1], src)
            if src.startswith("//"):
                src = "https:" + src
            cards.append((slugify(title), src))
    assert len(cards) == 78, f"Expected 78 cards, got {len(cards)}"
    return cards

def download(name: str, url: str):
    os.makedirs(SAVE_DIR, exist_ok=True)
    path = os.path.join(SAVE_DIR, f"{name}.png")
    if os.path.exists(path):
        return  # skip if already downloaded

    resp = requests.get(url, headers=HEADERS, stream=True, timeout=30)
    resp.raise_for_status()
    with open(path, "wb") as fh:
        for chunk in resp.iter_content(8192):
            fh.write(chunk)

# ------------------------------------------------------------------
# Entry-point
# ------------------------------------------------------------------
def main():
    cards = collect_cards()
    for name, url in tqdm(cards, desc="Downloading"):
        download(name, url)
    print(f"✅ All 78 images are ready inside '{SAVE_DIR}'")

if __name__ == "__main__":
    main()