# Quick Start Guide - Gypsy's Training Journey

## Get Started in 5 Minutes

---

## Option 1: Push to GitHub & Deploy (Recommended)

### Step 1: Create GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: **gypsytraining**
3. Make it **Private** (for personal use)
4. **Don't** add README, .gitignore, or license
5. Click **Create repository**

### Step 2: Push Your Code

```bash
# Navigate to project directory (if not already there)
cd /home/paul/Documents/gypsytraining/gypsytraining

# Push to GitHub (use PAT when prompted for password)
git push -u origin main
```

**When prompted:**
- Username: `paulmmoore3416`
- Password: `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`

### Step 3: Enable GitHub Pages

1. Go to: https://github.com/paulmmoore3416/gypsytraining/settings/pages
2. Source: **Deploy from a branch**
3. Branch: **main**
4. Folder: **/ (root)**
5. Click **Save**

### Step 4: Access Your Site

Wait 1-2 minutes, then visit:
**https://paulmmoore3416.github.io/gypsytraining/**

---

## Option 2: Use Locally (No GitHub)

### Just Open in Browser

```bash
# Navigate to project
cd /home/paul/Documents/gypsytraining/gypsytraining

# Open in default browser
xdg-open index.html

# Or drag index.html into your browser
```

### Use Local Web Server (Better)

```bash
# Using Python 3
python3 -m http.server 8000

# Then visit: http://localhost:8000
```

---

## First-Time Setup After Opening

### 1. Explore the App
- Click through all navigation sections
- Familiarize yourself with the layout
- Review the breed information
- Read through the commands reference

### 2. Start Training Documentation
- Go to **Training Suite**
- Check off the first skill you're working on (e.g., "Attention & Focus")
- Click **Log Session** to record your first training session

### 3. Create Your First Journal Entry
- Go to **Journal** section
- Click **New Entry**
- Write about your goals for training Gypsy
- Click **Save**

### 4. Create First Photo Album
- Go to **Photos** section
- Click **Create New 4-Week Album**
- Name it "Weeks 1-4" or "Training Start"
- Upload current photos of Gypsy

---

## Daily Workflow

### Morning Training Session
1. Review commands you're working on
2. Train for 10-15 minutes
3. Log the session in Training Suite
4. Note performance and challenges

### Throughout the Day
- Take photos of Gypsy during training
- Journal about emotional experiences
- Track nutrition if needed

### Evening Review
- Review progress in Training Suite
- Update journal with reflections
- Check off any mastered skills

---

## Key Features Overview

| Feature | What It Does | How to Use |
|---------|-------------|------------|
| **Training Suite** | Track 30+ skills across 4 phases | Check boxes, log sessions, view progress |
| **Journal** | Private thoughts & reflections | New Entry → Write → Save |
| **Photo Albums** | Visual progress every 4 weeks | Create Album → Upload Photos |
| **Commands** | Reference guide for training | Read, print, or view on phone |
| **Nutrition** | Track diet and body condition | Add weekly entries |
| **Resources** | Veteran & service animal programs | Browse and contact as needed |

---

## Data Management

### Your Data is Stored Locally
- Everything saves to your browser's LocalStorage
- No cloud, no servers, completely private
- Data is specific to this browser on this computer

### Backup Regularly

**Export All Data:**
1. Open browser console (F12)
2. Type: `GypsyApp.exportAllData()`
3. Press Enter
4. JSON file downloads automatically

**When to Backup:**
- Weekly
- Before browser updates
- Before clearing browser data
- After major training milestones

---

## Troubleshooting

### Data Not Saving?
- Check that you clicked "Save" (journal, nutrition)
- Verify LocalStorage is enabled (not in private/incognito mode)
- Try a different browser

### Page Not Loading?
- Hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Clear browser cache
- Check browser console (F12) for errors

### Images Not Uploading?
- Ensure file is an image (JPG, PNG, GIF)
- Check file size (very large files may be slow)
- Try uploading one at a time

---

## Customization Ideas

### Modify Colors
Edit `css/styles.css` - all colors are defined in CSS variables at the top

### Add New Commands
Edit `index.html` - find the Commands section and add new command cards

### Change Training Phases
Edit `index.html` - modify the training modules to match your specific needs

### Add New Resources
Edit `index.html` - add additional veteran resources or local contacts

---

## Important Reminders

✅ **Export journal entries regularly** - browser data can be lost

✅ **This is YOUR tool** - customize it to fit your needs

✅ **Training takes time** - don't rush, document the journey

✅ **You're not alone** - use the resources section when you need support

✅ **Celebrate small wins** - every skill mastered is progress

---

## Next Steps

1. ✅ **Open the app** (locally or via GitHub Pages)
2. ✅ **Create your first journal entry** about your goals
3. ✅ **Log your first training session** with Gypsy
4. ✅ **Upload a photo** of Gypsy to start the album
5. ✅ **Print the commands cheat sheet** (docs/COMMANDS.md)
6. ✅ **Read the training guide** (docs/TRAINING_GUIDE.md)
7. ✅ **Export a backup** of your data

---

## Resources at a Glance

- **Full Documentation:** [README.md](README.md)
- **Training Guide:** [docs/TRAINING_GUIDE.md](docs/TRAINING_GUIDE.md)
- **Commands Reference:** [docs/COMMANDS.md](docs/COMMANDS.md)
- **Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)

---

## Emergency Contacts (Save These)

**Veterans Crisis Line:** 988, press 1
**Crisis Text:** Text 838255
**VA Mental Health:** [mentalhealth.va.gov](https://www.mentalhealth.va.gov)

---

**You've got everything you need to start. Now go train Gypsy and build the partnership that will change both your lives.**

**Semper Fidelis.** 🇺🇸

---

*"The journey of a thousand miles begins with one step." - Lao Tzu*

*Your first step is opening this app and documenting Day 1 with Gypsy. Let's go.*
