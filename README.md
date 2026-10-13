# DealRoom OS — Bank Edition (Version 2)
### Living Diligence & Capital Raise Engine for De Novo & Growth-Stage Financial Institutions

**DealRoom OS (Bank Edition Version 2)** is an institutional-grade living diligence environment, cap table dilution engine, and investor relations portal tailored specifically for de novo bank organizers, community banks, and financial institutions executing Reg D Rule 506(c) capital raises.

---

## Core Pillars & Architectural Capabilities

1. **Single Source of Truth & Fact Engine**:
   - Every corporate term, authorized price, minimum escrow break, and legal provision is governed centrally.
   - Updates propagate across the interactive pro forma, stock dilution calculator, and public views with zero discrepancy.

2. **Rule 506(c) Compliance Gate**:
   - Enforces automated accreditation gating on sensitive offering artifacts (`D-07 Subscription Agreement`, `D-08 Escrow Agreement Summary`, `D-10 Accreditation Questionnaire`).
   - Dynamic viewer watermarking with viewer email, access timestamp, and confidentiality stamps.

3. **32-Character Cryptographic Diligence Dispatch**:
   - Generates unique, tamper-evident tracked package links per investor contact.
   - Comprehensive access telemetry: link opens, individual document views, and gate exceptions logged to CRM audit trail.

4. **10% Change-in-Control (CIC) Regulatory Warning Engine**:
   - Automatically monitors aggregate commitments, check sizes, and fully subscribed allocations.
   - Immediately flags any investor nearing 9.9%+ voting share ownership for FDIC/Federal Reserve change-in-control review.

5. **Verifiable Hash-Signed Diligence Vault**:
   - Serves 11 authentic binary artifacts (executive summary, pro forma financial models in `.xlsx`, subscription agreements in `.docx`, and presentation PDFs).
   - In-browser SHA-256 cryptographic verification recomputing file digests against the immutable manifest.

6. **Executive Personalization & Dynamic Bank Loading**:
   - URL parameter ingestion (`?ref=...&fn=First&bk=BankName`) greets bank leadership dynamically.
   - "Your Bank" sandbox allows one-click population of bespoke bank profiles and custom capital targets.

---

## Local Development & Build

```bash
# Install dependencies
pnpm install

# Run development server (automatically generates document vault manifest)
pnpm run dev

# Run production build
pnpm run build
```

---

## License & Compliance Disclaimer
**Demonstration Only.** Larkspur Bancorp, Inc. is a fictional entity. All investors, figures, and documents are illustrative sample data. Nothing herein constitutes an offer to sell or solicitation of an offer to buy securities.
