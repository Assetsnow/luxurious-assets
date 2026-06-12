# Luxurious Assets Consulting LLC
## Deployment Guide

---

### What You Have

A complete, deployable website. All pages are built. All forms are wired.
The site is ready to go live in under an hour.

---

### Step 1 — Create a Netlify Account

Go to netlify.com and sign up. Free tier is sufficient for this site.

---

### Step 2 — Deploy the Site

**Option A — Drag and Drop (fastest)**
1. Log into Netlify
2. Go to the Sites section
3. Drag the entire `luxurious-assets` folder into the deploy area
4. Netlify assigns a temporary URL immediately (e.g. random-name.netlify.app)
5. Site is live

**Option B — Connect to GitHub (recommended for ongoing updates)**
1. Upload the `luxurious-assets` folder to a private GitHub repository
2. In Netlify, click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Build settings: leave blank (no build command, publish directory is `.`)
5. Click Deploy

---

### Step 3 — Connect Your Domain

1. In Netlify, go to Site Settings → Domain Management
2. Click "Add custom domain"
3. Enter: luxuriousassetsconsulting.com
4. Netlify will show you DNS records to add
5. Log into your domain registrar (wherever you bought the domain)
6. Add the DNS records Netlify provides
7. DNS propagation takes 15 minutes to a few hours
8. Netlify provisions an SSL certificate automatically (free)

---

### Step 4 — Activate Form Submissions

Netlify Forms are already configured in the code. After deploying:

1. In Netlify, go to Site Settings → Forms
2. You will see three forms listed:
   - private-inquiry
   - sell-your-watch
   - contact
3. Click each form → Notifications → Add notification → Email
4. Enter: inquiries@luxuriousassetsconsulting.com
5. Save

All form submissions will now arrive at your email address.

---

### Step 5 — Test Before Going Live

Run through the pre-launch checklist:

- [ ] Open the site on desktop and mobile
- [ ] Click every navigation link
- [ ] Submit a test inquiry on /watch-sourcing
- [ ] Submit a test message on /contact
- [ ] Submit a test watch on /sell-your-watch
- [ ] Confirm confirmation emails arrive at inquiries@luxuriousassetsconsulting.com
- [ ] Verify footer year displays correctly
- [ ] Verify Available Timepieces shows Empty State
- [ ] Verify Testimonials section is hidden on homepage

---

### When You Have Inventory

To display watches publicly:

1. The current Available Timepieces page launches in Empty State
2. When you are ready to display listings, the watch card HTML structure
   is commented in `pages/available-timepieces.html` with clear instructions
3. For ongoing inventory management without code changes, consider upgrading
   to a headless CMS (Contentful, Sanity, or similar) — this is a future step,
   not required at launch

---

### When You Have Testimonials

The testimonials section is hidden on the homepage via `style="display:none;"`.
To activate it when you have real client testimonials:
1. Open `index.html`
2. Find the section with `id="testimonials"`
3. Remove the `style="display:none;"` attribute
4. Add your testimonial cards following the card structure in the HTML comments

---

### File Structure

```
luxurious-assets/
├── index.html                    ← Homepage
├── netlify.toml                  ← Netlify configuration
├── css/
│   ├── design-system.css         ← All tokens, base styles, buttons, forms
│   ├── navigation.css            ← Header and mobile drawer
│   ├── footer.css                ← Footer
│   ├── homepage.css              ← Homepage section styles
│   ├── overlay.css               ← Watch detail overlay
│   └── pages.css                 ← All interior page styles
├── js/
│   ├── main.js                   ← Navigation, scroll reveals, overlay
│   └── forms.js                  ← Form validation, conditional fields, submission
└── pages/
    ├── available-timepieces.html
    ├── watch-sourcing.html
    ├── sell-your-watch.html
    ├── about.html
    ├── contact.html
    ├── privacy-policy.html
    └── terms-of-use.html
```

---

### Support

For any changes, additions, or the Advisory Services page (post-launch),
return to this conversation with specific requests.
