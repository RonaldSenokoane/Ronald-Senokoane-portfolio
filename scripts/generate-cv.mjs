import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(
  await readFile(path.join(root, "src", "data", "content.json"), "utf8"),
);
const { profile, experience, education, skills } = content;
const pdf = await PDFDocument.create();
const font = await pdf.embedFont(StandardFonts.Helvetica);
const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
const ink = rgb(0.09, 0.13, 0.2);
const accent = rgb(0.08, 0.48, 0.68);
const muted = rgb(0.34, 0.4, 0.48);
const pageSize = [595.28, 841.89];
const margin = 48;
const lineHeight = 14;
let page;
let y;

function newPage() {
  page = pdf.addPage(pageSize);
  y = page.getHeight() - margin;
}

function drawText(text, { font: selectedFont = font, size = 9.5, color = ink, x = margin } = {}) {
  const maxWidth = page.getWidth() - margin - x;
  const words = String(text).split(/\s+/);
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (selectedFont.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      page.drawText(line, { x, y, size, font: selectedFont, color });
      y -= lineHeight;
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) {
    page.drawText(line, { x, y, size, font: selectedFont, color });
    y -= lineHeight;
  }
}

function heading(label) {
  ensureRoom(42);
  y -= 9;
  drawText(label.toUpperCase(), { font: bold, size: 10, color: accent });
  page.drawLine({
    start: { x: margin, y: y + 5 },
    end: { x: page.getWidth() - margin, y: y + 5 },
    thickness: 0.5,
    color: rgb(0.82, 0.86, 0.9),
  });
  y -= 4;
}

function ensureRoom(height = 50) {
  if (y < margin + height) newPage();
}

newPage();
drawText(profile.name, { font: bold, size: 24, color: ink });
drawText(profile.headline, { font: bold, size: 12, color: accent });
drawText(`${profile.location}  |  ${profile.email}  |  ${profile.phone}`, {
  size: 9,
  color: muted,
});
drawText(profile.github, { size: 9, color: muted });
y -= 8;

heading("Professional summary");
for (const line of profile.about) {
  ensureRoom();
  drawText(line, { size: 9 });
  y -= 3;
}

heading("Technical skills");
for (const group of skills) {
  ensureRoom(30);
  drawText(`${group.category}: ${group.items.join(", ")}`, { size: 9 });
}

heading("Professional experience");
for (const role of experience) {
  ensureRoom(58);
  drawText(`${role.title} | ${role.company}`, { font: bold, size: 10 });
  drawText(role.dates, { size: 8.5, color: muted });
  for (const detail of role.details) {
    ensureRoom(22);
    drawText(`• ${detail}`, { size: 8.5, x: margin + 10 });
  }
  y -= 4;
}

ensureRoom(content.education.length * (lineHeight * 2 + 4) + 45);
heading("Education & credentials");
for (const item of education) {
  ensureRoom(45);
  drawText(`${item.qualification} | ${item.provider}`, { font: bold, size: 9.5 });
  const detail = [item.dates, item.detail].filter(Boolean).join(" · ");
  drawText(detail, { size: 8.5, color: muted });
}

heading("Selected projects");
for (const project of content.projects) {
  ensureRoom(50);
  drawText(project.title, { font: bold, size: 9.5 });
  drawText(project.description, { size: 8.5 });
  drawText(project.technologies.join(" · "), { size: 8, color: muted });
}

const bytes = await pdf.save();
const publicDir = path.join(root, "public");
await mkdir(publicDir, { recursive: true });
await writeFile(path.join(publicDir, "Ronald-Senokoane-CV.pdf"), bytes);
console.log("Generated public/Ronald-Senokoane-CV.pdf from src/data/content.json");
