# Gihyun Kim — personal website

A multi-page personal site with an "engineering drawing set" identity: every page
is a numbered sheet with a title block, drawn in Lora + Inter + IBM Plex Mono on
technical-paper grid. No build step, no database — just files.

Pages: **Home** · **About** · **CV** · **Projects** · **Personal** · **Log (Blog)**.
Interactive bits: live 3D models with a wireframe-to-solid intro and a SECTION A–A
cut slider (home), drawing-sheet project cards with revision histories, an animated
journey map (personal), scroll reveals, lightbox, dark mode.

## Files

```
index.html      Home / landing (name, photo, nav buttons)
about.html      About me + portrait
cv.html         Full CV
projects.html   Engineering projects (with image lightbox)
blog.html       Blog index (auto-built from posts.json)
post.html       Renders a single Markdown post
style.css       Theme — colors & fonts at the top (:root)
main.js         Shared interactivity
posts.json      List of blog posts (one entry each)
posts/          Blog posts in Markdown
assets/         Images: project photos, your portrait, cv.pdf
```

## 1. Two photos to add

Save these into the `assets/` folder with these exact names:

- **`profile.jpg`** — your portrait (the suit / harbour-night photo). Shows on the
  Home and About pages. Until it's added, those spots show a small "add your photo"
  note instead of a broken image.
- **`trolley-built.jpg`** — the real photo of the assembled aluminium trolley. Shows
  as the third image on the Robocon Trolley project.

(If a file is a PNG, either save it as `.jpg` anyway-named won't work — instead keep
the real extension and update the matching `src="..."` in the HTML. Easiest is to
just export/rename them to the `.jpg` names above.)

The assembled-robot photo is already included (`assets/robocon-assembled.png`).

## 2. Add your links

In `index.html` the Home page has GitHub / LinkedIn / Google Scholar links set to
`#`. Replace them with your real URLs (same block also appears in the footer of
other pages if you want them there too). Drop your CV PDF in as `assets/cv.pdf`
to enable the "Download PDF" button on the CV page.

## 3. Add a blog post (2 steps)

**A.** Create `posts/2026-06-10-title.md` and write Markdown (start with `# Title`).
**B.** Add an entry at the top of `posts.json`:

```json
{ "title": "My update", "file": "2026-06-10-title.md",
  "date": "2026-06-10", "tags": ["research"], "excerpt": "One-line summary." }
```

Date format `YYYY-MM-DD`. The post then appears on the blog automatically.

## 4. Preview locally

The blog fetches files, so use a local server (not double-click):

```bash
cd this-folder
python3 -m http.server 8000   # then open http://localhost:8000
```

## 5. Put it online — simplest options for a public link

**Option A — Netlify Drop (fastest, no account needed to start):**
1. Go to https://app.netlify.com/drop
2. Drag this whole folder onto the page.
3. You instantly get a public link like `https://something-random.netlify.app`.
4. (Optional) Make a free account to keep it permanently and rename the URL.

**Option B — GitHub Pages (best for a clean, permanent URL):**
1. Create a free GitHub account and a **public** repo named `yourusername.github.io`.
2. Upload all these files (including `assets/` and `posts/`).
3. Repo **Settings → Pages** → Source: *Deploy from a branch*, branch **main**,
   folder **/ (root)**. Save.
4. ~1 minute later it's live at `https://yourusername.github.io`.

To update later (either option): re-drag the folder (Netlify) or upload/edit files
in the repo (GitHub).

## Changing the look

All colors and fonts are at the top of `style.css` under `:root`. Swap `--accent`
for a different blue, or `--bg` between `#f5f7fa` (light grey) and `#ffffff` (white).
