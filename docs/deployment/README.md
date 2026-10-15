# Deployment manual maintenance

`TIME_STONE_Ubuntu_VPS_Deployment_Guide.md` is the maintained source. The adjacent PDF is generated from it; do not independently edit PDF command examples. Operational procedures remain prepared, not executed or approved by this manual.

The scoped `.gitattributes` marks the PDF binary so Git cannot change its line endings or corrupt PDF offsets. Staged PDF bytes were verified identical to the validated local file.

Local rendering requires Python with ReportLab and four locally available fonts: `segoeui.ttf`, `segoeuib.ttf`, `consola.ttf`, `consolab.ttf`. No font files, paid API or application dependencies are added to the repository. This is a document-authoring dependency, not a VPS runtime requirement.

From the repository root on the verified Windows authoring environment:

```powershell
python docs/deployment/render_deployment_guide.py --font-dir C:/Windows/Fonts
```

Use the approved Python runtime containing ReportLab. Another authoring machine must provide the expected licensed fonts or explicitly adapt/review the renderer; do not install Windows fonts on the production server for this guide.

After any update, regenerate the PDF, extract text using pypdf/pdfplumber, check all chapters/TOC destinations and code-line parity, render pages with Poppler and review layout. Recreate `validation.json` for the exact final PDF/source hashes; do not retain a stale PASS record. The current validation covers 37 pages, 20 chapter bookmarks, 48 code blocks and 499 nonblank code lines, with no missing code, blank/sparse pages, replacement glyphs or out-of-page/body-margin text.

All pages were rendered locally. Representative cover/contents, architecture, Nginx/Systemd, troubleshooting, backup and printable-checklist pages were visually reviewed. Poppler emitted nonfatal fallback-font configuration warnings about unused system font names; embedded body/monospace fonts rendered legibly and extracted correctly. These warnings were not treated as an application or deployment test result.

M8 application fix remains in `08f1a35812d05347d67437603a423326649b764b`; fresh focused verification is in `728e7568dcee67eb8de81f994dca9781349865ad`. This guide does not certify the unmet mobile LCP, physical-device/3D endurance, Linux delivery, backup/restore or infrastructure gates. Both service examples and all future commands require actual-host verification and separate operational authorization.
