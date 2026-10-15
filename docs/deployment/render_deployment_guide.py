"""Render the adjacent maintained Markdown manual using local ReportLab only.

Run with a Python environment containing reportlab. Does not execute any manual
commands or access network, application configuration, credentials or databases.
"""
from pathlib import Path
import argparse
import html
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, PageBreak,
    LongTable, TableStyle, XPreformatted, Flowable,
)
from reportlab.platypus.tableofcontents import TableOfContents

HERE = Path(__file__).resolve().parent
NAME = 'TIME_STONE_Ubuntu_VPS_Deployment_Guide'
NAVY = colors.HexColor('#142E3C')
GOLD = colors.HexColor('#A77B36')
INK = colors.HexColor('#25323D')
MUTED = colors.HexColor('#536471')
PALE = colors.HexColor('#F2F5F6')
STONE = colors.HexColor('#F7F1E6')
WIDTH, HEIGHT = A4
BODY_WIDTH = WIDTH - 40 * mm


def register_fonts(font_dir):
    files = ('segoeui.ttf', 'segoeuib.ttf', 'consola.ttf', 'consolab.ttf')
    names = ('Body', 'BodyBold', 'Mono', 'MonoBold')
    for name, file in zip(names, files):
        target = font_dir / file
        if not target.is_file():
            raise FileNotFoundError(f'Provide the required local font: {target}')
        pdfmetrics.registerFont(TTFont(name, str(target)))
    pdfmetrics.registerFontFamily('Body', normal='Body', bold='BodyBold',
                                 italic='Body', boldItalic='BodyBold')
    pdfmetrics.registerFontFamily('Mono', normal='Mono', bold='MonoBold',
                                 italic='Mono', boldItalic='MonoBold')


def inline(text):
    text = html.escape(text, quote=False)
    text = re.sub(r'\[([^\]]+)\]\((https?://[^\s)]+)\)',
                  r'<link href="\2" color="#315D72">\1</link>', text)
    text = re.sub(r'`([^`]+)`', r'<font name="Mono" size="8.4">\1</font>', text)
    return re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)


def styles():
    body = ParagraphStyle('body', fontName='Body', fontSize=9.6, leading=13.2,
                          textColor=INK, spaceAfter=7, splitLongWords=True)
    return {
        'body': body,
        'chapter': ParagraphStyle('chapter', parent=body, fontName='BodyBold',
                                  fontSize=21, leading=26, textColor=NAVY,
                                  spaceBefore=7, spaceAfter=18, keepWithNext=True),
        'sub': ParagraphStyle('sub', parent=body, fontName='BodyBold',
                              fontSize=12, leading=17, textColor=NAVY,
                              spaceBefore=12, spaceAfter=8, keepWithNext=True),
        'warning': ParagraphStyle('warning', parent=body, backColor=STONE,
                                  borderColor=GOLD, borderWidth=0.7,
                                  borderPadding=10, spaceBefore=9, spaceAfter=14),
        'code': ParagraphStyle('code', fontName='Mono', fontSize=8,
                               leading=10.5, textColor=INK, backColor=PALE,
                               borderPadding=(3, 9, 3, 9), spaceBefore=2, spaceAfter=12),
        'label': ParagraphStyle('label', parent=body, fontName='BodyBold',
                                fontSize=7.6, leading=10, textColor=MUTED,
                                spaceBefore=6, spaceAfter=4, keepWithNext=True),
        'cell': ParagraphStyle('cell', parent=body, fontSize=8.4, leading=11.3,
                               spaceAfter=0, wordWrap='LTR', splitLongWords=True),
        'headcell': ParagraphStyle('headcell', parent=body, fontName='BodyBold',
                                   fontSize=8.4, leading=11.6,
                                   textColor=colors.white, spaceAfter=0),
        'bullet': ParagraphStyle('bullet', parent=body, leftIndent=17,
                                 firstLineIndent=0, bulletIndent=0,
                                 spaceAfter=5),
        'check': ParagraphStyle('check', parent=body, fontSize=9, leading=12.5,
                                leftIndent=17, firstLineIndent=0,
                                bulletIndent=0, spaceAfter=4),
    }


class Architecture(Flowable):
    """Vector topology; same connections as the Markdown diagram block."""
    def __init__(self):
        super().__init__()
        self.width = BODY_WIDTH
        self.height = 255

    def draw(self):
        c = self.canv

        def box(x, y, w, h, title, detail, dark=False):
            c.setFillColor(NAVY if dark else PALE)
            c.setStrokeColor(GOLD if dark else colors.HexColor('#CFD9DD'))
            c.roundRect(x, y, w, h, 5, fill=1, stroke=1)
            c.setFillColor(colors.white if dark else NAVY)
            c.setFont('BodyBold', 9)
            c.drawCentredString(x + w / 2, y + h - 16, title)
            c.setFont('Body', 7.4)
            c.drawCentredString(x + w / 2, y + 10, detail)

        def arrow(x1, y1, x2, y2, label='', lx=None, ly=None):
            c.setStrokeColor(GOLD)
            c.setLineWidth(1)
            c.line(x1, y1, x2, y2)
            import math
            angle = math.atan2(y2-y1, x2-x1)
            for delta in (-0.45, 0.45):
                c.line(x2, y2, x2-5*math.cos(angle+delta),
                       y2-5*math.sin(angle+delta))
            if label:
                c.setFont('Body', 7.3)
                c.setFillColor(MUTED)
                c.drawString(lx if lx is not None else x1+5,
                             ly if ly is not None else y1+5, label)

        box(0, 193, 110, 44, 'Browser', 'FR / EN / AR + RTL', True)
        box(145, 193, 155, 44, 'Nginx: frontend', 'gos-cert.org', True)
        box(335, 193, 145, 44, 'Next.js', 'loopback 127.0.0.1:3000')
        box(145, 100, 155, 44, 'Nginx: API/Admin', 'api.gos-cert.org', True)
        box(335, 100, 145, 44, 'PHP-FPM / Laravel', 'Unix socket; no port 8000')
        box(145, 5, 155, 44, 'Private filesystem', 'images / derivatives / GLB')
        box(335, 5, 145, 44, 'MySQL', 'local DB, scoped account')
        arrow(110, 215, 145, 215, 'TLS', 116, 225)
        arrow(300, 215, 335, 215, 'HTTP', 304, 225)
        arrow(55, 193, 145, 122, 'Public HTTPS', 4, 154)
        arrow(300, 122, 335, 122, 'FPM', 305, 132)
        arrow(350, 193, 285, 144, 'API HTTPS / 8081', 320, 164)
        arrow(407, 100, 407, 49, 'local TCP', 414, 71)
        arrow(335, 100, 260, 49, 'private I/O', 269, 70)
        c.setFont('Body', 7.3)
        c.setFillColor(MUTED)
        c.drawString(0, -5, '3D runs in the browser on activation; server supplies authorized assets.')


class Manual(BaseDocTemplate):
    def afterFlowable(self, flowable):
        if isinstance(flowable, Paragraph) and flowable.style.name == 'chapter':
            text = flowable.getPlainText()
            match = re.match(r'(\d+)\.', text)
            if match:
                key = 'chapter-' + match.group(1)
                self.canv.bookmarkPage(key)
                self.canv.addOutlineEntry(text, key, level=0)
                self.notify('TOCEntry', (0, text, self.page, key))


def header_footer(canvas, doc):
    canvas.saveState()
    if doc.page == 1:
        canvas.setFillColor(NAVY)
        canvas.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
        canvas.setFillColor(GOLD)
        canvas.rect(20*mm, HEIGHT-30*mm, 32*mm, 2, fill=1, stroke=0)
        canvas.setFillColor(colors.HexColor('#CDD9DF'))
        canvas.setFont('Body', 8)
        canvas.drawString(20*mm, 18*mm, 'LOCAL PREPARATION  /  OPERATOR AUTHORIZATION REQUIRED')
    else:
        canvas.setStrokeColor(colors.HexColor('#DCE3E6'))
        canvas.line(20*mm, HEIGHT-16*mm, WIDTH-20*mm, HEIGHT-16*mm)
        canvas.setFillColor(MUTED)
        canvas.setFont('BodyBold', 7.5)
        canvas.drawString(20*mm, HEIGHT-12*mm, 'TIME STONE  /  UBUNTU VPS DEPLOYMENT')
        canvas.setFont('Body', 7.5)
        canvas.drawRightString(WIDTH-20*mm, HEIGHT-12*mm, 'v1.0  |  15 October 2026')
        canvas.line(20*mm, 17*mm, WIDTH-20*mm, 17*mm)
        canvas.drawString(20*mm, 12*mm, 'Prepared locally - no VPS operations executed')
        canvas.drawRightString(WIDTH-20*mm, 12*mm, f'{doc.page}')
    canvas.restoreState()


def table(lines, st):
    rows = [[c.strip() for c in line.strip().strip('|').split('|')]
            for line in lines]
    rows = [r for r in rows if not all(re.fullmatch(r':?-+:?', c) for c in r)]
    columns = len(rows[0])
    if any(len(r) != columns for r in rows):
        raise ValueError('Malformed Markdown table')
    ratios = [0.28, 0.72] if columns == 2 else [0.23, 0.40, 0.37]
    if columns not in (2, 3):
        ratios = [1/columns]*columns
    data = [[Paragraph(inline(c), st['headcell' if n == 0 else 'cell'])
             for c in row] for n, row in enumerate(rows)]
    t = LongTable(data, colWidths=[BODY_WIDTH*r for r in ratios],
                  repeatRows=1, hAlign=TA_LEFT, splitByRow=1, splitInRow=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, PALE]),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 4.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
        ('LINEBELOW', (0, 0), (-1, 0), 0.8, GOLD),
        ('LINEBELOW', (0, 1), (-1, -1), 0.35, colors.HexColor('#DDE4E7')),
    ]))
    return [t, Spacer(1, 12)]


def code(lines, language, st):
    for line in lines:
        if pdfmetrics.stringWidth(line.expandtabs(4), 'Mono', 8) > BODY_WIDTH-18:
            raise ValueError(f'Code line too wide; fix Markdown explicitly: {line}')
    rendered = []
    for line in lines:
        escaped = html.escape(line, quote=False)
        if line.lstrip().startswith(('#', ';')):
            escaped = f'<font color="#637F74">{escaped}</font>'
        rendered.append(escaped)
    return [Paragraph(language.upper() or 'COMMAND / CONFIGURATION', st['label']),
            XPreformatted('\n'.join(rendered), st['code'])]


def story(source, st):
    # The cover repeats the Markdown metadata; the operational body is parsed once.
    white = ParagraphStyle('coverwhite', fontName='Body', fontSize=11,
                           leading=17, textColor=colors.white, spaceAfter=10)
    title = ParagraphStyle('covertitle', parent=white, fontName='BodyBold',
                           fontSize=30, leading=36, spaceAfter=16)
    small = ParagraphStyle('coversmall', parent=white, fontSize=8.5, leading=13)
    contents = [Spacer(1, 50), Paragraph('TIME STONE', title),
                Paragraph('MARBRE &amp; PIERRE', white), Spacer(1, 20),
                Paragraph('Ubuntu 24.04 VPS<br/>Deployment Guide', title),
                Paragraph('Version 1.0 &nbsp; | &nbsp; 15 October 2026', white),
                Spacer(1, 18)]
    front = source.split('[TOC]', 1)[0]
    for line in front.splitlines():
        if line.startswith(('Frontend:', 'Application root:', 'Application baseline:',
                            'Fresh finalization verification:')):
            contents.append(Paragraph(inline(line), small))
        if line.startswith('> '):
            contents.extend([Spacer(1, 16), Paragraph(inline(line[2:]), st['warning'])])
    contents.extend([PageBreak(), Paragraph('Contents', st['chapter'])])
    toc = TableOfContents()
    toc.levelStyles = [ParagraphStyle('toc', fontName='Body', fontSize=10.5,
                                      leading=14, textColor=NAVY,
                                      spaceBefore=0, leftIndent=0,
                                      firstLineIndent=0, rightIndent=25)]
    contents.extend([toc, PageBreak()])
    lines = source.split('[TOC]', 1)[1].splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        if line.startswith('# '):
            if not isinstance(contents[-1], PageBreak):
                contents.append(PageBreak())
            contents.append(Paragraph(inline(line[2:]), st['chapter']))
        elif line.startswith('### '):
            if line[4:] == 'Source register and final handoff':
                contents.append(PageBreak())
            contents.append(Paragraph(inline(line[4:]), st['sub']))
        elif line.startswith('```'):
            language, block = line[3:].strip(), []
            i += 1
            while i < len(lines) and not lines[i].startswith('```'):
                block.append(lines[i]); i += 1
            if i == len(lines):
                raise ValueError('Unclosed code fence')
            contents.extend([Architecture(), Spacer(1, 14)] if language == 'diagram'
                            else code(block, language, st))
        elif line.startswith('|'):
            block = []
            while i < len(lines) and lines[i].startswith('|'):
                block.append(lines[i]); i += 1
            contents.extend(table(block, st)); continue
        elif line.startswith('> '):
            contents.append(Paragraph(inline(line[2:]), st['warning']))
        elif line.startswith('- '):
            text = line[2:]
            checkbox = text.startswith('[ ] ')
            contents.append(Paragraph(inline(text[4:] if checkbox else text),
                                      st['check' if checkbox else 'bullet'],
                                      bulletText='[ ]' if checkbox else '-'))
        else:
            block = [line]
            while (i+1 < len(lines) and lines[i+1].strip()
                   and not lines[i+1].startswith(('#', '|', '```', '- ', '> '))):
                i += 1; block.append(lines[i])
            contents.append(Paragraph(inline(' '.join(block)), st['body']))
        i += 1
    return contents


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--font-dir', type=Path, default=Path('C:/Windows/Fonts'))
    args = parser.parse_args()
    register_fonts(args.font_dir)
    source = (HERE / (NAME+'.md')).read_text(encoding='utf-8')
    chapters = re.findall(r'^# (\d+)\. ', source, re.M)
    if chapters != [str(n) for n in range(1, 21)]:
        raise ValueError('Expected all twenty ordered chapters')
    doc = Manual(str(HERE/(NAME+'.pdf')), pagesize=A4,
                 leftMargin=20*mm, rightMargin=20*mm,
                 topMargin=23*mm, bottomMargin=23*mm,
                 title='TIME STONE - Ubuntu VPS Deployment Guide',
                 author='TIME STONE', subject='Prepared local deployment and recovery procedure')
    doc.addPageTemplates(PageTemplate(id='manual', frames=Frame(
        doc.leftMargin, doc.bottomMargin, doc.width, doc.height,
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0),
        onPage=header_footer))
    doc.multiBuild(story(source, styles()))
    print(HERE/(NAME+'.pdf'))


if __name__ == '__main__':
    main()
