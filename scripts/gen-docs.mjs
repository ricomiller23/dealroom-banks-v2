// Generates the sample diligence files at build time (no binary assets are checked in).
import fs from "node:fs"; import path from "node:path"; import crypto from "node:crypto"; import zlib from "node:zlib";
const OUT = path.join(process.cwd(), "public", "docs"); fs.mkdirSync(OUT, { recursive: true });
const BANK = "Larkspur Community Bank (In Organization)";
const SAMPLE = "SAMPLE / ILLUSTRATIVE DOCUMENT - fictional entity and figures. Not an offer to sell securities and not legal advice.";
const esc = s => s.replace(/[\\()]/g, m => "\\" + m).replace(/[^\x20-\x7e]/g, "-");
const xml = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function wrap(t, n = 88) { const out = []; let l = ""; for (const w of t.split(" ")) { if ((l + " " + w).trim().length > n) { out.push(l); l = w; } else l = (l + " " + w).trim(); } if (l) out.push(l); return out; }
function pdf(title, blocks) {
  const lines = [[title, 18], [BANK, 10], [SAMPLE, 8], ["", 10]];
  for (const b of blocks) { lines.push([b[0], 13]); for (const p of b[1]) { wrap(p).forEach(x => lines.push([x, 10])); lines.push(["", 6]); } }
  let y = 750; let content = "BT\n";
  for (const [t, sz] of lines) { content += `/F1 ${sz} Tf 1 0 0 1 54 ${y} Tm (${esc(t)}) Tj\n`; y -= sz + 5; }
  content += "ET";
  const objs = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"];
  let s = "%PDF-1.4\n"; const off = [];
  objs.forEach((o, i) => { off.push(s.length); s += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const x = s.length; s += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + off.map(o => String(o).padStart(10, "0") + " 00000 n \n").join("") + `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF\n`;
  return Buffer.from(s, "latin1");
}
function zip(files) {
  const parts = [], cd = []; let off = 0;
  for (const [name, data] of Object.entries(files)) {
    const nb = Buffer.from(name), d = Buffer.from(data), crc = zlib.crc32(d) >>> 0;
    const h = Buffer.alloc(30); h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt32LE(crc, 14); h.writeUInt32LE(d.length, 18); h.writeUInt32LE(d.length, 22); h.writeUInt16LE(nb.length, 26);
    parts.push(h, nb, d);
    const c = Buffer.alloc(46); c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt32LE(crc, 16); c.writeUInt32LE(d.length, 20); c.writeUInt32LE(d.length, 24); c.writeUInt16LE(nb.length, 28); c.writeUInt32LE(off, 42);
    cd.push(c, nb); off += 30 + nb.length + d.length;
  }
  const cdb = Buffer.concat(cd), e = Buffer.alloc(22); e.writeUInt32LE(0x06054b50, 0); e.writeUInt16LE(cd.length / 2, 8); e.writeUInt16LE(cd.length / 2, 10); e.writeUInt32LE(cdb.length, 12); e.writeUInt32LE(off, 16);
  return Buffer.concat([...parts, cdb, e]);
}
function docx(title, paras) {
  const p = t => `<w:p><w:r><w:t xml:space="preserve">${xml(t)}</w:t></w:r></w:p>`;
  return zip({
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
    "word/document.xml": `<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${[title, SAMPLE, ...paras].map(p).join("")}</w:body></w:document>`,
  });
}
function xlsx(sheet, rows) {
  const col = i => String.fromCharCode(65 + i);
  const cell = (v, r, c) => { const ref = col(c) + (r + 1); if (typeof v === "string" && v.startsWith("=")) return `<c r="${ref}"><f>${xml(v.slice(1))}</f></c>`; if (typeof v === "number") return `<c r="${ref}"><v>${v}</v></c>`; return `<c r="${ref}" t="inlineStr"><is><t>${xml(String(v))}</t></is></c>`; };
  const sd = rows.map((r, i) => `<row r="${i + 1}">${r.map((v, c) => cell(v, i, c)).join("")}</row>`).join("");
  return zip({
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${sheet}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`,
    "xl/worksheets/sheet1.xml": `<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sd}</sheetData></worksheet>`,
  });
}

const D = [
  ["D-01", "Offering Summary - Common Stock", "Offering", "Larkspur_Offering_Summary.pdf", pdf("Offering Summary - Common Stock", [
    ["The Offering", ["Larkspur Bancorp, Inc. (in organization) is offering up to 2,500,000 shares of common stock at $10.00 per share, for gross proceeds of up to $25,000,000, to capitalize Larkspur Community Bank, a proposed Arizona state-chartered commercial bank in Mesa, Arizona.", "Minimum to break escrow: $20,000,000. Minimum subscription: $25,000 (2,500 shares). Funds are held by an independent escrow agent until the minimum is reached and regulatory conditions are met."]],
    ["Use of Proceeds", ["About 85% is contributed to the Bank as Tier 1 capital, 10% funds holding-company liquidity, and 5% covers organizational and offering costs."]],
    ["Investor Eligibility", ["Illustrative: offered under Rule 506(c) of Regulation D to verified accredited investors only. An investor acquiring about 10% or more of voting shares may require a change-in-control review."]]])],
  ["D-02", "Business Plan - Executive Summary", "Strategy", "Larkspur_Business_Plan_Executive_Summary.pdf", pdf("Business Plan - Executive Summary", [
    ["Strategy", ["Relationship-driven business banking for owner-operated firms in the East Valley, with SBA 7(a) and owner-occupied commercial real estate as core lines, funded by operating-account deposits."],],
    ["Three-year targets (illustrative)", ["Total assets of $85M, $150M and $210M in years 1-3. Net income of -$2.4M, -$0.3M and $1.4M. Breakeven in month 22."]]])],
  ["D-03", "3-Year Pro Forma Financial Model", "Financials", "Larkspur_Pro_Forma_Financial_Model.xlsx", xlsx("Pro Forma", [
    ["Line ($000)", "Year 1", "Year 2", "Year 3"], ["Average earning assets", 60000, 125000, 185000], ["Net interest margin", 0.032, 0.034, 0.036],
    ["Net interest income", "=B2*B3", "=C2*C3", "=D2*D3"], ["Non-interest income", 400, 900, 1500], ["Non-interest expense", 4800, 6100, 7400], ["Provision", 600, 800, 900],
    ["Pre-tax income", "=B4+B5-B6-B7", "=C4+C5-C6-C7", "=D4+D5-D6-D7"], [SAMPLE]])],
  ["D-04", "Regulatory Approval Roadmap", "Regulatory", "Larkspur_Regulatory_Approval_Roadmap.pdf", pdf("Regulatory Approval Roadmap", [
    ["Milestones", ["Pre-filing meetings; charter and deposit-insurance applications; holding-company filing; conditional approval; capital raise and escrow break; final approvals; opening. Timing varies by agency and facts; see the live Charter Roadmap page."]]])],
  ["D-05", "Organizers & Proposed Board", "Governance", "Larkspur_Organizers_and_Board.pdf", pdf("Organizers & Proposed Board", [
    ["Organizing group (fictional)", ["Marisol Reyes (Chair and CEO designate), Daniel Okafor (CFO designate), Priya Natarajan (Chief Credit Officer designate), Tom Whitaker (counsel liaison)."]]])],
  ["D-06", "Service Area Market Study", "Market", "Larkspur_Market_Study.pdf", pdf("Service Area Market Study", [
    ["East Valley overview (illustrative)", ["1.1M residents, 62,000 small businesses and $31B in deposits across 24 institutions; the top five hold 71% share."]]])],
  ["D-07", "Subscription Agreement (Sample Form)", "Legal", "Larkspur_Subscription_Agreement_Sample_Form.docx", docx("Subscription Agreement - Sample Form", [
    "1. Subscription. The undersigned subscribes for ____ shares of common stock at $10.00 per share.", "2. Escrow. Funds are delivered to the escrow agent pending satisfaction of the escrow conditions.",
    "3. Accredited investor. The undersigned represents it is an accredited investor and will provide verification on request.", "4. Change in control. The undersigned will notify the Company if it would own 10% or more of voting shares.", "5. Governing law. Arizona."])],
  ["D-08", "Escrow Agreement Summary", "Legal", "Larkspur_Escrow_Agreement_Summary.pdf", pdf("Escrow Agreement Summary", [
    ["Key terms", ["An independent escrow agent holds subscription funds in a segregated account until (i) the $20M minimum is received and (ii) regulatory conditions are satisfied. If not satisfied by the outside date, funds are returned without deduction."]]])],
  ["D-09", "Cap Table & Dilution Model", "Capitalization", "Larkspur_Cap_Table_Dilution_Model.xlsx", xlsx("Cap Table", [
    ["Holder", "Shares", "Price", "Invested", "% of offering"], ["Organizers", 500000, 10, "=B2*C2", "=B2/B5"], ["Strategic investors", 900000, 10, "=B3*C3", "=B3/B5"], ["Community investors", 1100000, 10, "=B4*C4", "=B4/B5"],
    ["Total", "=SUM(B2:B4)", 10, "=SUM(D2:D4)", "=SUM(E2:E4)"], [SAMPLE]])],
  ["D-10", "Accreditation Questionnaire (Sample)", "Compliance", "Larkspur_Accreditation_Questionnaire_Sample.docx", docx("Investor Accreditation Questionnaire - Sample", [
    "[ ] Net worth over $1,000,000 excluding primary residence", "[ ] Income over $200,000 ($300,000 joint) in each of the last two years", "[ ] Holder of a Series 7, 65 or 82 license in good standing", "[ ] Entity with over $5,000,000 in assets", "[ ] Third-party verification letter attached"])],
  ["D-11", "Risk Factors Summary", "Compliance", "Larkspur_Risk_Factors_Summary.pdf", pdf("Risk Factors Summary", [
    ["Selected risks", ["The Bank has no operating history; regulatory approval is not assured; losses are expected in early years; the shares are illiquid; and ownership of 10% or more may require regulatory filings."]]])],
];
const man = D.map(([code, title, category, file, buf]) => { fs.writeFileSync(path.join(OUT, file), buf);
  return { code, title, category, file, format: file.split(".").pop().toUpperCase(), bytes: buf.length, sha256: crypto.createHash("sha256").update(buf).digest("hex") }; });
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(man, null, 1));
console.log("generated", man.length, "docs");
