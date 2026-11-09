"use strict";

// Edit your portfolio details and project content in src/data/content.json.
const DATA_URL = "./src/data/content.json";
const CV_URL = "./public/Ronald-Senokoane-CV.pdf";
const root = document.querySelector("#root");
const icons = {
  "arrow-down": '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  "arrow-down-right": '<path d="M7 7l10 10"/><path d="M17 7v10H7"/>',
  "arrow-down-to-line":
    '<path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M5 21h14"/>',
  "arrow-left": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  "arrow-up-right": '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
  github:
    '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3"/><path d="M15 21v-3.9a3.4 3.4 0 0 0-.9-2.7c3-.3 6.1-1.5 6.1-6.7a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6S17.5.2 15 2.1a13.4 13.4 0 0 0-7 0C5.5.2 4.3 1.5 4.3 1.5a4.8 4.8 0 0 0-.1 3.6 5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.1 6.4 6.1 6.7A3.4 3.4 0 0 0 8 18.1V21"/>',
  home: '<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  map: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  moon: '<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>',
  phone:
    '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
  x: '<path d="m18 6-12 12M6 6l12 12"/>',
};

let portfolio;

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function icon(name, size = 16) {
  if (!icons[name]) throw new Error(`Unknown icon "${name}".`);
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[name]}</svg>`;
}

function heading(eyebrow, title, description = "") {
  return `<div class="section-heading">
    <span class="eyebrow">${escapeHTML(eyebrow)}</span>
    <h2>${escapeHTML(title)}</h2>
    ${description ? `<p>${escapeHTML(description)}</p>` : ""}
  </div>`;
}

function tags(items, label = "") {
  const accessibleLabel = label ? ` aria-label="${escapeHTML(label)}"` : "";
  return `<ul class="tag-list"${accessibleLabel}>${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;
}

function projectCard(project, index) {
  const technologyTags = project.technologies.slice(0, 4);
  if (project.technologies.length > 4) {
    technologyTags.push(`+${project.technologies.length - 4}`);
  }

  return `<article class="project-card project-card-${index % 3}">
    <div class="project-card-topline">
      <span class="project-kind">${escapeHTML(project.kind)}</span>
      <span class="status-dot status-${escapeHTML(project.statusTone)}">${escapeHTML(project.status)}</span>
    </div>
    <div class="project-art" aria-hidden="true">
      <span class="art-orbit art-orbit-one"></span>
      <span class="art-orbit art-orbit-two"></span>
      <span class="art-core"><span>${escapeHTML(project.shortTitle)}</span><small>${escapeHTML(project.technologies.slice(0, 2).join(" · "))}</small></span>
      <span class="art-index">0${index + 1}</span>
    </div>
    <div class="project-card-content">
      <h3>${escapeHTML(project.title)}</h3>
      <p>${escapeHTML(project.description)}</p>
      ${tags(technologyTags, "Technologies")}
      <div class="project-card-actions">
        <a class="text-link" href="#/projects/${encodeURIComponent(project.slug)}">Case study ${icon("arrow-down-right", 15)}</a>
        <a href="${escapeHTML(project.repository)}" target="_blank" rel="noopener noreferrer" aria-label="View ${escapeHTML(project.title)} on GitHub">${icon("github", 17)}${icon("arrow-up-right", 12)}</a>
      </div>
    </div>
  </article>`;
}

function renderHeader(path) {
  const links = [
    { href: "#/", label: "Overview", active: path === "/" },
    {
      href: "#/projects",
      label: "Projects",
      active: path === "/projects" || path.startsWith("/projects/"),
    },
    { href: "#/resume", label: "Resume", active: path === "/resume" },
    { href: "#/contact", label: "Contact", active: path === "/contact" },
  ];

  return `<a class="skip-link" href="#main-content">Skip to main content</a>
    <header class="site-header">
      <div class="header-inner">
        <a class="wordmark" href="#/" aria-label="Ronald Senokoane home">
          <span class="wordmark-mark" aria-hidden="true">R</span>
          <span>Ronald<span class="wordmark-dot">.</span></span>
        </a>
        <button class="icon-button menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="primary-navigation" data-action="toggle-menu">${icon("menu", 20)}</button>
        <nav id="primary-navigation" class="navigation" aria-label="Primary navigation">
          ${links.map((link) => `<a class="nav-link${link.active ? " nav-link-active" : ""}" href="${link.href}"${link.active ? ' aria-current="page"' : ""}>${link.label}</a>`).join("")}
          <a class="nav-cta" href="${CV_URL}" download>Download CV</a>
        </nav>
        <button type="button" class="icon-button theme-toggle" aria-label="Switch to light mode" title="Switch to light mode" data-action="toggle-theme">${icon("sun", 18)}</button>
      </div>
      <button class="menu-backdrop" type="button" aria-label="Close navigation menu" data-action="close-menu" hidden></button>
      <span class="sr-only" aria-live="polite">${escapeHTML(path)}</span>
    </header>`;
}

function renderFooter() {
  const profile = portfolio.profile;
  return `<footer class="site-footer">
    <div class="footer-inner">
      <span>© ${new Date().getFullYear()} ${escapeHTML(profile.name)}</span>
      <span class="footer-note">Built with care in South Africa.</span>
      <div class="footer-links">
        <a href="mailto:${escapeHTML(profile.email)}" aria-label="Email Ronald">${icon("mail", 16)}</a>
        <a href="${escapeHTML(profile.github)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">${icon("github", 16)}${icon("arrow-up-right", 11)}</a>
      </div>
    </div>
  </footer>`;
}

function renderHome() {
  const profile = portfolio.profile;
  const about = profile.about.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("");
  const projects = portfolio.projects.map(projectCard).join("");
  const skillGroups = portfolio.skills
    .map(
      (group, index) => `<article class="skill-group">
        <span class="skill-index">0${index + 1}</span>
        <h3>${escapeHTML(group.category)}</h3>
        ${tags(group.items)}
      </article>`,
    )
    .join("");

  return `<main class="page-shell">
    <section class="hero section-wrap">
      <div class="hero-copy">
        <div class="availability"><span></span> Junior software developer</div>
        <p class="hero-kicker">SOFTWARE DEVELOPER <span>·</span> SOUTH AFRICA</p>
        <h1>Building practical<br><span class="accent-text">things for people.</span></h1>
        <p class="hero-summary">${escapeHTML(profile.summary)}</p>
        <div class="hero-actions">
          <a class="button button-primary" href="#/projects">Explore projects ${icon("arrow-down-right", 17)}</a>
          <a class="button button-quiet" href="${CV_URL}" download>Download CV ${icon("arrow-down", 16)}</a>
        </div>
        <div class="hero-meta">
          <span>${icon("map", 14)} ${escapeHTML(profile.location)}</span>
          <a href="${escapeHTML(profile.github)}" target="_blank" rel="noopener noreferrer">${icon("github", 15)} GitHub ${icon("arrow-up-right", 11)}</a>
          <a href="mailto:${escapeHTML(profile.email)}">Email ${icon("arrow-up-right", 11)}</a>
        </div>
      </div>
      <div class="hero-visual" role="img" aria-label="Abstract portfolio artwork, not a photograph">
        <div class="visual-grid"></div>
        <div class="visual-ring visual-ring-outer"></div>
        <div class="visual-ring visual-ring-inner"></div>
        <div class="visual-crosshair crosshair-top"></div>
        <div class="visual-crosshair crosshair-bottom"></div>
        <div class="visual-orbit-label orbit-label-one"><span></span> Web applications</div>
        <div class="visual-orbit-label orbit-label-two"><span></span> Real-world systems</div>
        <div class="visual-monogram"><span>RS</span><small>Curious by design.</small></div>
        <div class="visual-caption"><span>01 / 03</span><span>South Africa</span></div>
      </div>
      <a class="scroll-cue" href="#about"><span class="scroll-line"></span> Scroll to explore</a>
    </section>

    <section id="about" class="section-wrap about-section">
      ${heading("01 / A little context", "A different route into tech.", "People-first work taught me to listen. Hands-on IT taught me to troubleshoot. Software development lets me bring those instincts together.")}
      <div class="about-layout">
        <div class="about-copy">${about}<a class="text-link" href="#/resume">Explore my experience ${icon("arrow-down-right", 15)}</a></div>
        <div class="about-aside"><span class="aside-index">01—04</span><p class="aside-label">A background shaped by</p><ul><li>Customer service</li><li>Workplace IT support</li><li>Financial services</li><li>Software development</li></ul></div>
      </div>
    </section>

    <section class="section-wrap featured-section">
      ${heading("02 / Selected work", "Built to solve something real.", "A workplace register, a full-stack publishing platform, and a collaborative learning portal.")}
      <div class="project-grid featured-grid">${projects}</div>
      <div class="section-action"><a class="button button-secondary" href="#/projects">All case studies ${icon("arrow-down-right", 16)}</a></div>
    </section>

    <section class="section-wrap skills-section">
      ${heading("03 / Working toolkit", "Tools I use to make things work.", "A practical toolkit built through projects and ongoing study—without inflated ratings.")}
      <div class="skills-grid">${skillGroups}</div>
    </section>

    <section class="section-wrap home-cta">
      <div><span class="eyebrow">04 / Next step</span><h2>Have a good problem<br>to solve together?</h2></div>
      <div class="home-cta-action"><p>I'm interested in junior software engineering opportunities and thoughtful conversations.</p><a class="button button-primary" href="#/contact">Get in touch ${icon("arrow-up-right", 16)}</a></div>
    </section>
  </main>`;
}

function matchingProjects(category, query) {
  const search = query.trim().toLowerCase();
  return portfolio.projects.filter((project) => {
    const matchesCategory = category === "All" || project.kind === category;
    const searchable = [project.title, project.description, project.kind, ...project.technologies]
      .join(" ")
      .toLowerCase();
    return matchesCategory && (!search || searchable.includes(search));
  });
}

function renderProjectResults(category = "All", query = "") {
  const projects = matchingProjects(category, query);
  if (projects.length === 0) {
    return `<div class="empty-state" role="status">
      <span class="eyebrow">No matches</span>
      <h2>Nothing here by that name.</h2>
      <p>Try another project title, technology, or project type.</p>
      <button class="button button-secondary" type="button" data-action="clear-filters">Clear filters</button>
    </div><p class="results-count" aria-live="polite">Showing 0 of ${portfolio.projects.length} projects</p>`;
  }

  return `<div class="project-grid">${projects
    .map((project) => projectCard(project, portfolio.projects.indexOf(project)))
    .join("")}</div><p class="results-count" aria-live="polite">Showing ${projects.length} of ${portfolio.projects.length} projects</p>`;
}

function renderProjects() {
  const categories = ["All", ...new Set(portfolio.projects.map((project) => project.kind))];
  const filters = categories
    .map(
      (category, index) => `<button class="filter-pill${index === 0 ? " filter-pill-active" : ""}"
        type="button" data-filter="${escapeHTML(category)}" aria-pressed="${index === 0}">${escapeHTML(category)}</button>`,
    )
    .join("");

  return `<main class="page-shell">
    <section class="page-intro section-wrap">
      <span class="eyebrow">Selected work / 03 projects</span>
      <h1>Projects with a<br><span class="accent-text">purpose behind them.</span></h1>
      <p>Each case study distinguishes what is known, what is reported, and what still needs verification.</p>
    </section>
    <section class="section-wrap directory-section">
      <div class="project-controls">
        <div class="filter-pills" aria-label="Filter projects by type">${filters}</div>
        <label class="search-field">${icon("search", 17)}<span class="sr-only">Search projects</span>
          <input type="search" aria-label="Search projects" placeholder="Search projects or technology">
          <button type="button" aria-label="Clear project search" data-action="clear-search" hidden>${icon("x", 15)}</button>
        </label>
      </div>
      <div id="project-results">${renderProjectResults()}</div>
    </section>
  </main>`;
}

function bulletList(items) {
  return `<ul class="detail-list">${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;
}

function caseSection(label, title, body) {
  return `<section class="case-section"><span class="eyebrow">${escapeHTML(label)}</span><h2>${escapeHTML(title)}</h2>${body}</section>`;
}

function renderProjectDetail(project) {
  const index = portfolio.projects.indexOf(project) + 1;
  const external = 'target="_blank" rel="noopener noreferrer"';
  const demo = project.demo
    ? `<a class="button button-secondary" href="${escapeHTML(project.demo)}" ${external}>Live frontend ${icon("arrow-up-right", 14)}</a>`
    : "";
  const api = project.api
    ? `<a class="text-link" href="${escapeHTML(project.api)}" ${external}>API endpoint ${icon("arrow-up-right", 13)}</a>`
    : "";

  return `<main class="page-shell">
    <article class="case-study section-wrap">
      <a class="back-link" href="#/projects">${icon("arrow-left", 15)} All projects</a>
      <div class="case-hero">
        <div>
          <div class="project-card-topline"><span class="project-kind">${escapeHTML(project.kind)}</span><span class="status-dot status-${escapeHTML(project.statusTone)}">${escapeHTML(project.status)}</span></div>
          <span class="eyebrow">Case study / ${escapeHTML(project.slug)}</span>
          <h1>${escapeHTML(project.title)}</h1><p class="case-summary">${escapeHTML(project.description)}</p>
          <div class="case-links"><a class="button button-primary" href="${escapeHTML(project.repository)}" ${external}>${icon("github", 16)} View repository ${icon("arrow-up-right", 14)}</a>${demo}${api}</div>
        </div>
        <div class="case-art" aria-hidden="true"><div class="case-art-grid"></div><div class="case-art-center"><span class="case-art-count">0${index}</span><strong>${escapeHTML(project.shortTitle)}</strong><small>${escapeHTML(project.technologies.slice(0, 3).join(" / "))}</small></div></div>
      </div>
      <div class="case-facts">
        <div><span>Role & attribution</span><p>${escapeHTML(project.role)}</p></div>
        <div><span>Delivery</span><p>${escapeHTML(project.deployment)}</p></div>
        <div><span>Current status</span><p>${escapeHTML(project.status)}</p></div>
      </div>
      <div class="case-content">
        <div class="case-main-column">
          ${caseSection("01 / The context", "Problem & setting", `<p>${escapeHTML(project.context)}</p>`)}
          ${caseSection("02 / The approach", "Solution & architecture", `<p>${escapeHTML(project.solution)}</p><div class="architecture-card"><span>System overview</span><p>${escapeHTML(project.architecture)}</p></div>`)}
          ${caseSection("03 / What it includes", "Features", bulletList(project.features))}
          ${caseSection("04 / Engineering notes", "Security & testing", `<div class="note-card"><strong>Security</strong><p>${escapeHTML(project.security)}</p></div><div class="note-card"><strong>Testing</strong><p>${escapeHTML(project.testing)}</p></div>`)}
          ${caseSection("05 / Looking ahead", "Challenges & next steps", `<h3>Considerations</h3>${bulletList(project.challenges)}<h3>Potential improvements</h3>${bulletList(project.future)}`)}
        </div>
        <aside class="case-sidebar">
          <div class="sidebar-card"><span class="eyebrow">Technology</span>${tags(project.technologies)}</div>
          <div class="sidebar-card"><span class="eyebrow">Outcome</span><p>${escapeHTML(project.outcome)}</p></div>
          <div class="sidebar-card evidence-card"><span class="eyebrow">Evidence & scope</span><ul>${project.evidence.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></div>
        </aside>
      </div>
      <div class="case-next"><span class="eyebrow">Keep exploring</span><a class="text-link" href="#/projects">Back to all projects ${icon("arrow-left", 15)}</a></div>
    </article>
  </main>`;
}

function renderResume() {
  const experience = portfolio.experience
    .map(
      (role) => `<article class="timeline-item">
        <div class="timeline-date">${escapeHTML(role.dates)}</div>
        <div class="timeline-content"><span class="timeline-marker"></span>
          <h3>${escapeHTML(role.title)}</h3><p class="timeline-company">${escapeHTML(role.company)}</p>
          ${bulletList(role.details)}
        </div>
      </article>`,
    )
    .join("");
  const education = portfolio.education
    .map((item) => {
      const certificateLink = item.certificateUrl
        ? `<a class="text-link" href="${escapeHTML(item.certificateUrl)}" target="_blank" rel="noopener noreferrer" download>View certificate ${icon("arrow-up-right", 13)}</a>`
        : "";

      return `<article class="education-card">
        ${item.status ? `<span class="education-status">${escapeHTML(item.status)}</span>` : ""}
        <h3>${escapeHTML(item.qualification)}</h3><p>${escapeHTML(item.provider)}</p>
        <span class="education-dates">${escapeHTML(item.dates)}${item.detail ? ` · ${escapeHTML(item.detail)}` : ""}</span>
        ${certificateLink}
      </article>`;
    })
    .join("");
  const skills = portfolio.skills
    .map((group) => `<article class="skill-group"><h3>${escapeHTML(group.category)}</h3>${tags(group.items)}</article>`)
    .join("");

  return `<main class="page-shell">
    <section class="page-intro section-wrap resume-intro">
      <span class="eyebrow">Background / Resume</span>
      <h1>Experience built<br><span class="accent-text">across disciplines.</span></h1>
      <p>A career shaped by financial services, workplace IT support, and current software-development study.</p>
      <a class="button button-primary" href="${CV_URL}" download>${icon("arrow-down-to-line", 16)} Download PDF CV</a>
    </section>
    <section class="section-wrap resume-section">
      ${heading("01 / Work history", "Professional experience")}
      <div class="timeline">${experience}</div>
    </section>
    <section class="section-wrap resume-section education-section">
      ${heading("02 / Studies & credentials", "Education")}
      <div class="education-grid">${education}</div>
    </section>
    <section class="section-wrap resume-section">
      ${heading("03 / Technical toolkit", "Skills & tools", "Technology and engineering practices represented in the project and study information supplied.")}
      <div class="skills-grid">${skills}</div>
      <div class="resume-links"><a class="text-link" href="#/projects">See selected project case studies ${icon("arrow-up-right", 14)}</a></div>
    </section>
  </main>`;
}

function renderContact() {
  const profile = portfolio.profile;
  return `<main class="page-shell">
    <section class="contact-page section-wrap">
      <div class="contact-intro">
        <span class="eyebrow">Start a conversation</span>
        <h1>Good work starts<br>with <span class="accent-text">a hello.</span></h1>
        <p>I'm interested in junior software engineering opportunities, learning-focused teams, and thoughtful conversations about building useful software.</p>
        <span class="contact-location">${icon("map", 16)} ${escapeHTML(profile.location)}</span>
      </div>
      <div class="contact-panel">
        <a class="contact-row" href="mailto:${escapeHTML(profile.email)}"><span class="contact-icon">${icon("mail", 18)}</span><span><small>Email</small><strong>${escapeHTML(profile.email)}</strong></span>${icon("arrow-up-right", 17)}</a>
        <a class="contact-row" href="tel:${escapeHTML(profile.phone.replaceAll(" ", ""))}"><span class="contact-icon">${icon("phone", 18)}</span><span><small>Phone</small><strong>${escapeHTML(profile.phone)}</strong></span>${icon("arrow-up-right", 17)}</a>
        <a class="contact-row" href="${escapeHTML(profile.github)}" target="_blank" rel="noopener noreferrer"><span class="contact-icon">${icon("github", 18)}</span><span><small>GitHub</small><strong>github.com/RonaldSenokoane</strong></span>${icon("arrow-up-right", 17)}</a>
        <p class="contact-note">The email link opens your mail application. No contact-form submission is claimed.</p>
      </div>
    </section>
  </main>`;
}

function renderNotFound() {
  return `<main class="page-shell"><section class="not-found section-wrap">
    <span class="not-found-code">404</span>
    <span class="eyebrow">Lost in the route map</span>
    <h1>This page isn't<br><span class="accent-text">where we left it.</span></h1>
    <p>The link may be outdated, or the address may have been typed incorrectly.</p>
    <div class="hero-actions"><a class="button button-primary" href="#/">${icon("home", 16)} Back home</a><button class="button button-secondary" type="button" data-action="go-back">${icon("arrow-left", 16)} Go back</button></div>
  </section></main>`;
}

function getRoute() {
  const path = window.location.hash.startsWith("#/")
    ? window.location.hash.slice(1).replace(/\/+$/, "") || "/"
    : "/";
  const pages = {
    "/": ["Junior Full-Stack Software Engineer", portfolio.profile.summary, renderHome],
    "/projects": ["Projects & case studies", "Explore Ronald Senokoane's workplace software, full-stack publishing platform, and collaborative learning-portal projects.", renderProjects],
    "/resume": ["Resume & experience", "View Ronald Senokoane's professional experience, education, and technical toolkit.", renderResume],
    "/contact": ["Contact", "Contact Ronald Senokoane about junior software engineering opportunities and collaboration.", renderContact],
  };

  if (pages[path]) {
    const [title, description, render] = pages[path];
    return { path, title, description, render };
  }

  const match = path.match(/^\/projects\/([^/]+)$/);
  if (match) {
    try {
      const slug = decodeURIComponent(match[1]);
      const project = portfolio.projects.find((item) => item.slug === slug);
      if (project) {
        return {
          path,
          title: project.title,
          description: project.description,
          render: () => renderProjectDetail(project),
        };
      }
    } catch (error) {
      console.error("Could not open the requested project.", error);
    }
  }

  return {
    path,
    title: "Page not found",
    description: "The page you requested could not be found.",
    render: renderNotFound,
  };
}

function updatePageMetadata(route) {
  document.title = `${route.title} | ${portfolio.profile.name}`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = route.description;
}

function getSavedTheme() {
  try {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch (error) {
    console.error("Could not read the saved appearance preference.", error);
  }
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const button = document.querySelector('[data-action="toggle-theme"]');
  if (!button) return;

  const nextTheme = theme === "dark" ? "light" : "dark";
  button.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
  button.title = `Switch to ${nextTheme} mode`;
  button.innerHTML = icon(theme === "dark" ? "sun" : "moon", 18);
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch (error) {
    console.error("Could not save the appearance preference.", error);
  }
}

function closeMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");
  const backdrop = document.querySelector(".menu-backdrop");
  toggle?.classList.remove("menu-toggle-open");
  toggle?.setAttribute("aria-expanded", "false");
  toggle?.setAttribute("aria-label", "Open navigation menu");
  if (toggle) toggle.innerHTML = icon("menu", 20);
  navigation?.classList.remove("navigation-open");
  if (backdrop) backdrop.hidden = true;
}

function render() {
  const route = getRoute();
  updatePageMetadata(route);
  root.innerHTML = `${renderHeader(route.path)}<div id="main-content">${route.render()}</div>${renderFooter()}`;
  setTheme(getSavedTheme());

  const search = root.querySelector('[aria-label="Search projects"]');
  search?.addEventListener("input", () => {
    const clearButton = root.querySelector('[data-action="clear-search"]');
    if (clearButton) clearButton.hidden = !search.value;
    renderProjectSearch();
  });
}

function renderProjectSearch() {
  const results = document.querySelector("#project-results");
  if (!results) return;
  const category = document.querySelector("[data-filter].filter-pill-active");
  const search = document.querySelector('[aria-label="Search projects"]');
  results.innerHTML = renderProjectResults(category?.dataset.filter ?? "All", search?.value ?? "");
}

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#/"]');
  if (link) {
    closeMenu();
    return;
  }

  const target = event.target.closest("[data-action], [data-filter]");
  if (!target) return;

  if (target.dataset.filter) {
    document.querySelectorAll("[data-filter]").forEach((filter) => {
      const active = filter === target;
      filter.classList.toggle("filter-pill-active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    renderProjectSearch();
    return;
  }

  switch (target.dataset.action) {
    case "toggle-theme":
      setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
      break;
    case "toggle-menu": {
      const open = target.getAttribute("aria-expanded") !== "true";
      target.setAttribute("aria-expanded", String(open));
      target.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      target.classList.toggle("menu-toggle-open", open);
      target.innerHTML = icon(open ? "x" : "menu", 20);
      document.querySelector("#primary-navigation")?.classList.toggle("navigation-open", open);
      const backdrop = document.querySelector(".menu-backdrop");
      if (backdrop) backdrop.hidden = !open;
      break;
    }
    case "close-menu":
      closeMenu();
      break;
    case "clear-search": {
      const search = document.querySelector('[aria-label="Search projects"]');
      if (search) {
        search.value = "";
        search.focus();
      }
      target.hidden = true;
      renderProjectSearch();
      break;
    }
    case "clear-filters": {
      const all = document.querySelector('[data-filter="All"]');
      document.querySelectorAll("[data-filter]").forEach((filter) => {
        const active = filter === all;
        filter.classList.toggle("filter-pill-active", active);
        filter.setAttribute("aria-pressed", String(active));
      });
      const search = document.querySelector('[aria-label="Search projects"]');
      if (search) search.value = "";
      const clear = document.querySelector('[data-action="clear-search"]');
      if (clear) clear.hidden = true;
      renderProjectSearch();
      break;
    }
    case "go-back":
      if (window.history.length > 1) window.history.back();
      else window.location.hash = "#/";
      break;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("hashchange", () => {
  if (!portfolio) return;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

async function startPortfolio() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Portfolio content request failed with status ${response.status}.`);
    portfolio = await response.json();
    render();
  } catch (error) {
    console.error("Could not load the portfolio content. Open the project using Live Server.", error);
    root.innerHTML = `<main class="page-shell section-wrap"><section class="empty-state"><span class="eyebrow">Start Live Server</span><h1>Portfolio content could not be loaded.</h1><p>In VS Code, open the <strong>Ronald-Senokoane-portfolio</strong> folder, right-click <strong>index.html</strong>, and select <strong>Open with Live Server</strong>. The portfolio reads its editable details from <code>src/data/content.json</code>.</p></section></main>`;
  }
}

startPortfolio();
