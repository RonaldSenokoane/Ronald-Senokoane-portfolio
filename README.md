# Ronald Senokoane — Portfolio

A responsive portfolio built with plain HTML, CSS, and JavaScript. It includes project case studies, experience and education, theme and mobile-navigation controls, a downloadable CV, and Firebase Hosting configuration. It does not use React or TypeScript.

## Open the portfolio with Live Server

1. Open the `Ronald-Senokoane-portfolio` folder in Visual Studio Code.
2. If you do not already have it, install the **Live Server** extension by Ritwick Dey from the Extensions panel.
3. In the Explorer, right-click the top-level `index.html` and choose **Open with Live Server**.
4. The site opens in your browser. Use its navigation links to explore the portfolio.

Live Server is needed because the page loads portfolio content from `src/data/content.json`. Opening `index.html` directly as a `file://` address prevents the browser from loading that data.

The easy-to-find website files are at the top level of the folder:

- `index.html` — page structure and links to the stylesheet and JavaScript.
- `style.css` — all portfolio styling.
- `script.js` — page rendering, navigation, search, theme, and menu behavior.

The project and profile details are in `src/data/content.json`, and the downloadable CV and site graphics are in `public/`.

## Optional developer tools

You do not need Node.js or npm to open the site with Live Server. For developers who want to run automated checks, use Node.js 20.19+ or 22.12+:

```bash
npm install
npm run lint
npm test
```

The Playwright browser tests start a local server automatically. If Chromium is not installed, run:

```bash
npx playwright install chromium
```

To run the site through Vite instead of the Live Server extension:

```bash
npm run dev
```

## Portfolio content and CV

Project information, status, technologies, links, feature descriptions, evidence, and editorial follow-ups are maintained in [`src/data/content.json`](./src/data/content.json). Public case studies do not display internal editorial notes.

The PDF CV is generated from the verified profile, skills, experience, education, and project data in that same file:

```bash
npm install
npm run generate:cv
```

The generated document is `public/Ronald-Senokoane-CV.pdf`. No portrait was available in the portfolio workspace. A nearby screenshot containing student records was deliberately excluded; the hero uses abstract artwork rather than a fictional or private image.

## Firebase Hosting deployment

Firebase Hosting serves the same top-level files used by Live Server; the site does not require a build step.

1. Create or select a dedicated Firebase project for this portfolio. Do not reuse an unrelated application.
2. Install and authenticate the Firebase CLI:

   ```bash
   npm install --global firebase-tools
   firebase login
   ```

3. From this directory, associate the selected project:

   ```bash
   firebase use --add
   ```

   Select the dedicated portfolio project. The resulting `.firebaserc` is intentionally ignored by Git; configure the project again on another machine.

4. Replace `YOUR_FIREBASE_PROJECT_ID` in `public/robots.txt` and `public/sitemap.xml` with the selected Firebase project ID, then deploy:

   ```bash
   firebase deploy --only hosting
   ```

Deployment is not performed as part of local development. Review Firebase's selected project before running the deploy command.

## Accuracy and privacy notes

- Professional history and education follow the details supplied for this portfolio. The current Occupational Certificate is marked as in progress.
- The LearnerHub repository is shared and owned by `blessingmanhique12`; the case study identifies Ronald as a contributor, not sole author.
- DevBlog's known production Cloudinary credential issue is not presented as resolved.
- No usage statistics, testimonials, salary, street address, or performance claims are published.
- Add a real, authorized profile portrait to `public/assets/` only after one is supplied. Never add screenshots containing identifiable learner records.
- Add a verified LinkedIn URL to `src/data/content.json` only if one is provided.

## Project structure

```text
index.html
style.css
script.js
vite.config.js
src/
  data/
    content.json
public/
  assets/
  Ronald-Senokoane-CV.pdf
scripts/
  generate-cv.mjs
e2e/
  portfolio.spec.js
```
