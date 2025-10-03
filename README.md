# Lali Pili — Birthday Site (static)

This is a small, static, mobile-friendly birthday site celebrating Lali Pili. It's built with plain HTML, CSS and JavaScript and designed to run locally without a server.

## Quick start — open locally
- Option A — Open the file directly (quick):
	- Open the `birthday-site` folder and double-click `index.html` (or right-click -> Open with -> Browser).
	- Note: some browsers restrict certain features (like local fetches) when opening files directly. If you see missing images, use Option B.

- Option B — Serve via a simple local server (recommended):
	- Using Python (works in PowerShell):

```powershell
# from inside the birthday-site folder
python -m http.server 5500
# then open http://localhost:5500 in your browser
```

	- Or use the VS Code Live Server extension (right-click `index.html` -> Open with Live Server).

## Where images live
- Images are referenced from `../Photos/...` relative to the files in `birthday-site`. Keep the `Photos/` folder next to the `birthday-site` folder as in the original workspace. If you move images, update the `photos` array in `scripts.js`.

## Customization
- Change which photos appear in the modal slideshow:
	- Open `scripts.js` and edit the `initSlideshow()` function — the `slides` array lists the images shown by the modal slideshow.
- Background music:
	- Replace `assets/music.mp3` with your audio file and ensure any audio element IDs in `index.html` match the wiring in `scripts.js` if you enable music controls.
- Gallery and lightbox:
	- `gallery.html` is generated from the `photos` array defined at the top of `scripts.js`. Thumbnails are lazy-loaded and include HEIC->.jpg fallback logic.

## Responsive & accessibility notes
- The site includes responsive CSS rules for narrow viewports (mobile). Buttons stack, gallery collapses to one column, and modal images scale to fit the device.
- Keyboard navigation for the slideshow is supported (ArrowLeft / ArrowRight / Escape). The modal also pauses autoplay when hovered.

## Troubleshooting
- Images not loading:
	- Verify the `Photos/` folder exists at the expected path and filenames match those in `scripts.js`.
	- When serving via `file://`, some browsers may block resources — use a local server instead.
- Modal not opening:
	- Ensure JavaScript is enabled and `scripts.js` is loaded (open DevTools Console for errors).

## Files
- `index.html`, `princess.html`, `goddess.html`, `gallery.html`, `wishes.html` — pages
- `styles.css` — styles
- `scripts.js` — main JS (slideshow, gallery, wishes)
- `assets/music.mp3` — placeholder music file (optional)

If you'd like, I can add a short section showing how to edit the slideshow image order or add responsive `srcset` attributes to images for better mobile performance.
