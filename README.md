# Jazz-Themed Portfolio Website

A Reid Miles Blue Note-inspired portfolio website with smooth scroll effects and syncopated animations.

## 🎷 Features

- **Reid Miles Aesthetic**: Bold typography, halftone effects, red/black color scheme
- **Smooth Transitions**: Background colors melt from section to section
- **Syncopated Animations**: Jazz-inspired staggered reveals as you scroll
- **Responsive Design**: Works beautifully on all devices
- **Single Page Layout**: All sections on one scrollable page with smooth navigation

## 🎹 Customization Guide

### 1. Personal Information

**In `index.html`:**
- Line 20: Replace `YOUR NAME` in the logo
- Lines 38-40: Replace hero title text
- Line 43: Update subtitle "THE TECH ENSEMBLE"
- Line 48: Update "EST. 2024" to your start year
- Lines 67-69: Update your about text
- Lines 73-81: Update stats (years, projects, etc.)

### 2. Skills Section

**In `index.html` (lines 95-130):**
Update each skill card with your technologies:
```html
<div class="skill-card">
    <div class="skill-icon">🎹</div>
    <h3 class="skill-name">PIANO</h3>
    <p class="skill-description">Your, Tech, Stack</p>
</div>
```

### 3. Projects (Discography)

**In `index.html` (lines 145-210):**
For each project, update:
- `album-number`: BN 4001, BN 4002, etc.
- `album-title-cover`: Short project name
- `album-name`: Full project name
- `album-description`: Project description
- Tags: Technologies used
- Links: Live demo and source code URLs

Add more projects by copying the `.album-card` structure.

### 4. Experience (Tour Dates)

**In `index.html` (lines 230-285):**
Update each tour date with your work history:
- Years and duration
- Company name
- Role title
- Description
- Technologies/skills used

### 5. Contact Information

**In `index.html` (lines 305-325):**
Update all contact links:
- Email
- GitHub username
- LinkedIn profile
- Twitter/X handle

### 6. Colors (Optional)

**In `styles.css` (lines 10-15):**
```css
:root {
    --red: #e63946;           /* Main accent color */
    --black: #0d0d0d;         /* Primary dark */
    --dark-blue: #1d3557;     /* Secondary background */
    --cream: #f1faee;         /* Light text */
}
```

### 7. Fonts (Optional)

Current fonts are inspired by Blue Note:
- **Bebas Neue**: Headers and titles
- **Oswald**: Subtitles
- **Roboto Condensed**: Body text

To change fonts, update the Google Fonts link in `index.html` (line 9) and CSS font-family properties.

## 🎺 Adding the Vinyl Player (Future Feature)

When you're ready to add the vinyl player with your jazz track:

1. **Add your MP3 file** to the project folder (e.g., `jazz-track.mp3`)

2. **Uncomment the vinyl player code** in `script.js` (bottom of file)

3. **Update the audio source**:
```javascript
this.audio.src = 'jazz-track.mp3'; // Your file name
```

4. **Add vinyl player styles** to `styles.css`:
```css
.vinyl-player {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 80px;
    height: 80px;
    z-index: 1000;
}

.vinyl-disc {
    width: 100%;
    height: 100%;
    background: #000;
    border-radius: 50%;
    border: 3px solid var(--red);
    animation: spin 3s linear infinite;
    animation-play-state: paused;
}

.vinyl-disc.playing {
    animation-play-state: running;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.vinyl-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--red);
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 12px;
}
```

## 🚀 Deployment to GitHub Pages

### Method 1: Simple Upload

1. Create a new repository on GitHub
2. Name it `yourusername.github.io` (for main site) or any name (for project site)
3. Upload `index.html`, `styles.css`, and `script.js`
4. Go to Settings → Pages → Source: Select `main` branch
5. Your site will be live at `https://yourusername.github.io`

### Method 2: Git Command Line

```bash
# Initialize git in your project folder
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Jazz portfolio site"

# Add your GitHub repository
git remote add origin https://github.com/yourusername/yourusername.github.io.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Then enable GitHub Pages in repository Settings → Pages.

## 📁 File Structure

```
your-portfolio/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # Scroll effects and interactions
├── README.md           # This file
└── jazz-track.mp3      # (Optional) Your jazz audio file
```

## 🎨 Design Notes

- **Halftone effects**: Applied to hero and project cards for authentic Blue Note feel
- **Typography hierarchy**: Bebas Neue for impact, Oswald for structure, Roboto Condensed for readability
- **Color transitions**: Background smoothly transitions between sections (red ↔ dark blue)
- **Staggered animations**: Elements appear in syncopated rhythm as you scroll
- **Responsive breakpoints**: 968px (tablets) and 640px (mobile)

## 🔧 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

Free to use and modify for your personal portfolio!

---

**Need help?** Check the comments in each file for additional guidance.

🎷 **Happy jazzing!** 🎺
