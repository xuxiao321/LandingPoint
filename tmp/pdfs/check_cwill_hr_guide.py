from pathlib import Path
import pypdfium2 as pdfium
from pypdf import PdfReader
from PIL import Image, ImageOps, ImageDraw

root=Path(__file__).resolve().parents[2]
source=root/'output/pdf/CWILL_HR_Screening_Xu_Xiao_Bilingual.pdf'
dest=root/'tmp/pdfs/cwill-hr-qa'
dest.mkdir(exist_ok=True)
reader=PdfReader(source)
print('Pages:',len(reader.pages))
for i,page in enumerate(reader.pages):
    text=page.extract_text()
    print(i+1, len(text), text[:85].replace('\n',' '))
doc=pdfium.PdfDocument(str(source))
thumbs=[]
for i in range(len(doc)):
    img=doc[i].render(scale=1.5).to_pil().convert('RGB')
    img.save(dest/f'page-{i+1:02}.png')
    img.thumbnail((446,632))
    tile=Image.new('RGB',(466,662),'#e5e9e9')
    tile.paste(img,((466-img.width)//2,10))
    ImageDraw.Draw(tile).text((15,642),f'Page {i+1}',fill='black')
    thumbs.append(tile)
for start in range(0,len(thumbs),6):
    sheet=Image.new('RGB',(1398,1324),'white')
    for j,tile in enumerate(thumbs[start:start+6]): sheet.paste(tile,((j%3)*466,(j//3)*662))
    sheet.save(dest/f'contact-{start//6+1}.png')
