# GitHub Deployment Instructions

## Deploying Gypsy's Training Journey to GitHub Pages

---

## Prerequisites

✅ Git installed on your machine
✅ GitHub account: `paulmmoore3416`
✅ Personal Access Token (PAT): `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`
✅ Repository initialized locally with commits

---

## Step 1: Create GitHub Repository

### Option A: Via GitHub Website (Recommended)

1. Go to [https://github.com](https://github.com) and sign in
2. Click the **+** icon in the top right, select **"New repository"**
3. Repository name: **`gypsytraining`**
4. Description: *Service animal training documentation for Gypsy*
5. **Public** or **Private**: Choose **Private** (recommended for personal use)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

### Option B: Via GitHub CLI (if installed)

```bash
gh repo create gypsytraining --private --source=. --remote=origin --push
```

---

## Step 2: Link Local Repository to GitHub

```bash
# Add remote origin
git remote add origin https://github.com/paulmmoore3416/gypsytraining.git

# Verify remote was added
git remote -v
```

You should see:
```
origin  https://github.com/paulmmoore3416/gypsytraining.git (fetch)
origin  https://github.com/paulmmoore3416/gypsytraining.git (push)
```

---

## Step 3: Push to GitHub

### Using Personal Access Token (PAT)

When Git prompts for credentials:

**Username:** `paulmmoore3416`
**Password:** `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` (your PAT)

```bash
# Push to GitHub
git push -u origin main
```

### Alternative: Configure Git Credential Helper (saves PAT)

```bash
# Cache credentials for 1 hour
git config --global credential.helper 'cache --timeout=3600'

# Or store permanently (less secure)
git config --global credential.helper store
```

Then push:
```bash
git push -u origin main
```

---

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub:
   [https://github.com/paulmmoore3416/gypsytraining](https://github.com/paulmmoore3416/gypsytraining)

2. Click **Settings** (top navigation)

3. In the left sidebar, click **Pages**

4. Under "Build and deployment":
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
   - Click **Save**

5. Wait 1-2 minutes for deployment

6. Refresh the page to see your site URL:
   **https://paulmmoore3416.github.io/gypsytraining/**

---

## Step 5: Verify Deployment

1. Visit: [https://paulmmoore3416.github.io/gypsytraining/](https://paulmmoore3416.github.io/gypsytraining/)

2. Check that all sections load:
   - ✅ Hero section displays
   - ✅ Navigation works
   - ✅ Training suite loads
   - ✅ Journal interface opens
   - ✅ Photo album section shows
   - ✅ Commands reference displays
   - ✅ Resources load properly

3. Test interactive features:
   - Click checkboxes in training suite
   - Create a journal entry
   - Create a photo album
   - Check that data persists in LocalStorage

---

## Making Updates to the Site

After making changes to any files:

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Description of what you changed"

# Push to GitHub
git push

# Changes will deploy to GitHub Pages in 1-2 minutes
```

### Example Update Workflow

```bash
# Made changes to index.html
git add index.html
git commit -m "Update breed information section with new medical data"
git push

# Made changes to styles
git add css/styles.css
git commit -m "Adjust Pacific Northwest color palette"
git push
```

---

## Common Issues & Solutions

### Issue: "Support for password authentication was removed"

**Solution:** Use your Personal Access Token (PAT) as the password, not your GitHub account password.

**PAT:** `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`

---

### Issue: Images or CSS not loading on GitHub Pages

**Solution:** Check file paths. GitHub Pages is case-sensitive.

Ensure paths in HTML use relative paths:
```html
✅ Correct:   <link rel="stylesheet" href="css/styles.css">
❌ Incorrect: <link rel="stylesheet" href="/css/styles.css">
❌ Incorrect: <link rel="stylesheet" href="CSS/styles.css">
```

---

### Issue: LocalStorage data not persisting

**Solution:** This is expected behavior. LocalStorage is browser-specific and local to each machine/browser. Data won't sync between devices. Export JSON backups regularly.

---

### Issue: 404 error on GitHub Pages

**Solutions:**
1. Verify `index.html` exists in root directory
2. Wait 2-5 minutes after enabling GitHub Pages
3. Check GitHub Actions tab for deployment status
4. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

---

## Backup & Export

### Export All App Data

In browser console:
```javascript
GypsyApp.exportAllData()
```

This downloads a complete JSON backup of:
- Training progress
- Journal entries
- Photo albums (as base64)
- Nutrition logs

### Manual Backup via Git

```bash
# Create a backup branch
git branch backup-$(date +%Y-%m-%d)

# Or create a Git tag
git tag -a v1.0 -m "Version 1.0 - Initial complete system"
git push --tags
```

---

## Privacy & Security Notes

### Private Repository
If you set the repo to **Private**, only you can see the code on GitHub. However, GitHub Pages sites from private repos are still **publicly accessible** unless you have GitHub Pro.

**Options:**
1. Keep repo private, accept that the site is public
2. Add password protection via JavaScript (basic, not secure)
3. Use GitHub Pro for private Pages sites
4. Host locally and don't use GitHub Pages

### Local-Only Use
To use without GitHub Pages:
```bash
# Simply open index.html in browser
open index.html

# Or use a local server
python -m http.server 8000
# Then visit: http://localhost:8000
```

---

## Updating Your PAT

If your PAT expires or you need to regenerate it:

1. Go to [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Give it a descriptive name: "Gypsy Training App"
4. Select scopes:
   - ✅ `repo` (full control of private repositories)
   - ✅ `workflow` (if using GitHub Actions)
5. Click **"Generate token"**
6. **Copy the token immediately** (you won't see it again)
7. Update your local Git credentials

---

## Summary

✅ **Repository URL:** [https://github.com/paulmmoore3416/gypsytraining](https://github.com/paulmmoore3416/gypsytraining)

✅ **Live Site URL:** [https://paulmmoore3416.github.io/gypsytraining/](https://paulmmoore3416.github.io/gypsytraining/)

✅ **Update Workflow:** Edit files → `git add` → `git commit` → `git push`

✅ **Backup:** Export JSON regularly via browser console

✅ **Privacy:** LocalStorage keeps data local; export sensitive journal entries regularly

---

## Need Help?

- **GitHub Docs:** [https://docs.github.com/pages](https://docs.github.com/pages)
- **Git Basics:** [https://git-scm.com/doc](https://git-scm.com/doc)
- **GitHub Issues:** Create an issue in your repo if you encounter problems

---

**Your training documentation is ready. Now go train Gypsy and document the journey. Semper Fi.** 🇺🇸
