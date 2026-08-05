import fitz

d = fitz.open('iemh101.pdf')
with open('ncert_chapter_text.txt', 'w', encoding='utf-8') as f:
    for i in range(d.page_count):
        f.write(f'==== PAGE {i+1} ====\n')
        f.write(d[i].get_text())
        f.write('\n')
print('wrote', d.page_count, 'pages')
