import argparse
import base64
import difflib
import io
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request
import zipfile
import xml.etree.ElementTree as ET

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

def find_browser_executable():
    paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ]
    for p in paths:
        if os.path.exists(p):
            return p
    return None

def normalize_url(url_or_slug: str) -> str:
    url_or_slug = url_or_slug.strip()
    if url_or_slug.startswith("http://") or url_or_slug.startswith("https://"):
        return url_or_slug
    clean_slug = url_or_slug.strip("/")
    return f"https://standardebooks.org/ebooks/{clean_slug}"

def clean_title_for_search(title: str) -> str:
    t = re.split(r'[:\-\(]', title)[0].strip()
    t = re.sub(r'[^\w\s]', ' ', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def search_standard_ebooks(title: str, author: str = ""):
    clean_t = clean_title_for_search(title)
    if not clean_t:
        return None
    encoded = urllib.parse.quote_plus(clean_t)
    search_url = f"https://standardebooks.org/ebooks?query={encoded}"
    req = urllib.request.Request(search_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    
    try:
        html = urllib.request.urlopen(req, timeout=12).read().decode("utf-8")
        matches = re.findall(r'<a href="(/ebooks/[^"/]+/[^"/]+)"[^>]*>(.*?)</a>', html)
        if not matches:
            return None

        candidates = []
        seen = set()
        for href, text in matches:
            if href not in seen and not href.endswith("/downloads") and "/feeds" not in href:
                seen.add(href)
                parts = href.strip("/").split("/")
                if len(parts) == 3:
                    candidates.append({
                        "url": f"https://standardebooks.org{href}",
                        "author_slug": parts[1].replace("-", " "),
                        "book_slug": parts[2].replace("-", " "),
                    })

        if not candidates:
            return None

        best_candidate = candidates[0]
        best_score = 0
        clean_title_lower = clean_t.lower()
        clean_author_lower = author.lower() if author else ""

        for c in candidates:
            title_score = difflib.SequenceMatcher(None, clean_title_lower, c["book_slug"].lower()).ratio()
            author_score = 0
            if clean_author_lower:
                author_score = difflib.SequenceMatcher(None, clean_author_lower, c["author_slug"].lower()).ratio()
            total_score = title_score * 0.7 + author_score * 0.3 if clean_author_lower else title_score
            if total_score > best_score:
                best_score = total_score
                best_candidate = c

        if best_score < 0.45:
            return None

        meta = fetch_metadata(best_candidate["url"])
        meta["matchScore"] = round(best_score, 2)
        meta["source"] = "Standard Ebooks"
        return meta
    except Exception as e:
        sys.stderr.write(f"Search error: {e}\n")
        return None

def fetch_metadata(page_url: str):
    req = urllib.request.Request(page_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    html = urllib.request.urlopen(req, timeout=15).read().decode("utf-8")

    # Title
    title_m = re.search(r'<h1[^>]*property="schema:name"[^>]*>(.*?)</h1>', html, re.DOTALL)
    title = title_m.group(1).strip() if title_m else ""
    title = re.sub(r'<[^>]+>', '', title).strip()

    # Author
    author = ""
    author_m = re.search(r'href="https://standardebooks\.org/ebooks/([^/"]+)">([^<]+)</a>', html)
    if author_m:
        author = author_m.group(2).strip()
    else:
        author_m2 = re.search(r'property="schema:author"[^>]*>(.*?)</a>', html)
        if author_m2:
            author = re.sub(r'<[^>]+>', '', author_m2.group(1)).strip()

    # Cover
    cover = ""
    cover_m = re.search(r'property="schema:image"[^>]*href="([^"]+)"', html)
    if cover_m:
        cover = cover_m.group(1).strip()
    else:
        cover_m2 = re.search(r'src="(/images/covers/[^"]+/cover\.jpg)"', html)
        if cover_m2:
            cover = cover_m2.group(1).strip()
    if cover and cover.startswith("/"):
        cover = "https://standardebooks.org" + cover

    # Description
    desc = ""
    desc_m = re.search(r'<div[^>]*property="schema:description"[^>]*>(.*?)</div>', html, re.DOTALL)
    if desc_m:
        desc = re.sub(r'<[^>]+>', ' ', desc_m.group(1)).strip()
        desc = re.sub(r'\s+', ' ', desc)

    # Word count / estimated pages
    words_m = re.search(r'([0-9,]+)\s+words', html)
    words = int(words_m.group(1).replace(',', '')) if words_m else 50000
    pages = max(15, round(words / 275))

    # EPUB URL
    epub_m = re.search(r'href="([^"]*downloads/[^"]+\.epub)"', html)
    if not epub_m:
        raise Exception("Không tìm thấy liên kết tải sách EPUB trên trang Standard Ebooks")
    epub_url = "https://standardebooks.org" + epub_m.group(1) + "?source=download"

    # Subjects / Tags
    subjects = re.findall(r'href="https://standardebooks\.org/subjects/([^/"]+)"', html)
    clean_subjects = [s.replace('-', ' ').title() for s in set(subjects)][:4]

    return {
        "title": title,
        "author": author,
        "cover": cover,
        "description": desc,
        "pages": pages,
        "epubUrl": epub_url,
        "pageUrl": page_url,
        "subjects": clean_subjects,
        "wordCount": words,
    }

def extract_web_reader_package(epub_source, output_json_path=None):
    if isinstance(epub_source, str) and epub_source.startswith("http"):
        req = urllib.request.Request(epub_source, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        epub_bytes = urllib.request.urlopen(req, timeout=45).read()
        z = zipfile.ZipFile(io.BytesIO(epub_bytes))
    elif isinstance(epub_source, str) and os.path.isfile(epub_source):
        z = zipfile.ZipFile(epub_source)
    else:
        z = zipfile.ZipFile(io.BytesIO(epub_source))

    opf_name = None
    for name in z.namelist():
        if name.endswith(".opf"):
            opf_name = name
            break
    
    if not opf_name:
        raise Exception("Không tìm thấy tệp OPF trong EPUB")

    opf_dir = os.path.dirname(opf_name)
    opf_data = z.read(opf_name).decode("utf-8", errors="ignore")
    tree = ET.fromstring(opf_data)

    ns = {
        "opf": "http://www.idpf.org/2007/opf",
        "dc": "http://purl.org/dc/elements/1.1/"
    }

    title_el = tree.find(".//dc:title", ns)
    title = title_el.text if title_el is not None and title_el.text else "Tác phẩm"

    creator_el = tree.find(".//dc:creator", ns)
    author = creator_el.text if creator_el is not None and creator_el.text else "Tác giả cổ điển"

    desc_el = tree.find(".//dc:description", ns)
    description = desc_el.text if desc_el is not None and desc_el.text else ""

    manifest = {}
    for item in tree.findall(".//opf:item", ns):
        item_id = item.attrib.get("id")
        href = item.attrib.get("href")
        manifest[item_id] = href

    spine = []
    for itemref in tree.findall(".//opf:itemref", ns):
        idref = itemref.attrib.get("idref")
        if idref in manifest:
            spine.append((idref, manifest[idref]))

    def resolve_zip_path(base_dir, rel_path):
        combined = os.path.normpath(os.path.join(base_dir, rel_path)).replace("\\", "/")
        return combined

    image_cache = {}
    for name in z.namelist():
        lower_name = name.lower()
        if lower_name.endswith((".jpg", ".jpeg", ".png", ".svg", ".webp", ".gif")):
            mime = "image/jpeg"
            if lower_name.endswith(".png"):
                mime = "image/png"
            elif lower_name.endswith(".svg"):
                mime = "image/svg+xml"
            elif lower_name.endswith(".webp"):
                mime = "image/webp"
            img_data = z.read(name)
            b64 = base64.b64encode(img_data).decode("ascii")
            data_uri = f"data:{mime};base64,{b64}"
            image_cache[name] = data_uri
            image_cache[os.path.basename(name)] = data_uri

    toc_titles = {}
    for item_id, href in spine:
        if "toc" in href.lower():
            try:
                toc_zip_path = resolve_zip_path(opf_dir, href)
                toc_xml = z.read(toc_zip_path).decode("utf-8", errors="ignore")
                links = re.findall(r'<a\s+[^>]*href="([^"]+)"[^>]*>(.*?)</a>', toc_xml, re.DOTALL)
                for l_href, l_text in links:
                    clean_text = re.sub(r'<[^>]+>', '', l_text).strip()
                    clean_href = l_href.split("#")[0]
                    clean_href = os.path.basename(clean_href)
                    if clean_href and clean_text and clean_href not in toc_titles:
                        toc_titles[clean_href] = clean_text
            except Exception:
                pass

    chapters = []
    toc = []
    total_words = 0

    for idx, (item_id, rel_href) in enumerate(spine):
        if "toc.xhtml" in rel_href.lower() or "toc.ncx" in rel_href.lower():
            continue

        zip_entry_path = resolve_zip_path(opf_dir, rel_href)
        if zip_entry_path not in z.namelist():
            continue

        xhtml_raw = z.read(zip_entry_path).decode("utf-8", errors="ignore")

        base_filename = os.path.basename(rel_href)
        ch_title = toc_titles.get(base_filename)
        if not ch_title:
            h_match = re.search(r'<h[1-3][^>]*>(.*?)</h[1-3]>', xhtml_raw, re.DOTALL)
            if h_match:
                ch_title = re.sub(r'<[^>]+>', '', h_match.group(1)).strip()
        if not ch_title:
            t_match = re.search(r'<title[^>]*>(.*?)</title>', xhtml_raw, re.DOTALL)
            if t_match:
                ch_title = re.sub(r'<[^>]+>', '', t_match.group(1)).strip()
        if not ch_title or ch_title == title:
            ch_title = base_filename.replace(".xhtml", "").replace("-", " ").title()

        body_match = re.search(r'<body[^>]*>(.*?)</body>', xhtml_raw, re.DOTALL)
        content_html = body_match.group(1) if body_match else xhtml_raw

        def replace_img(match):
            orig_src = match.group(1)
            img_filename = os.path.basename(orig_src.split("?")[0])
            if img_filename in image_cache:
                return f'src="{image_cache[img_filename]}"'
            return match.group(0)

        content_html = re.sub(r'src="([^"]+)"', replace_img, content_html)

        text_only = re.sub(r'<[^>]+>', ' ', content_html)
        words = len(text_only.split())
        total_words += words

        chapter_obj = {
            "id": f"ch-{idx+1}",
            "file": base_filename,
            "title": ch_title,
            "html": content_html.strip(),
            "wordCount": words
        }
        chapters.append(chapter_obj)

        toc.append({
            "id": f"ch-{idx+1}",
            "title": ch_title,
            "file": base_filename,
            "index": len(chapters) - 1
        })

    package = {
        "version": 1,
        "format": "WEB_READER",
        "title": title,
        "author": author,
        "description": description,
        "totalChapters": len(chapters),
        "totalWords": total_words,
        "estimatedReadingMinutes": max(1, round(total_words / 200)),
        "toc": toc,
        "chapters": chapters
    }

    if output_json_path:
        os.makedirs(os.path.dirname(os.path.abspath(output_json_path)), exist_ok=True)
        with open(output_json_path, "w", encoding="utf-8") as f:
            json.dump(package, f, ensure_ascii=False)

    return package

def convert_epub_to_pdf(epub_url: str, output_pdf_path: str):
    browser_exe = find_browser_executable()
    if not browser_exe:
        raise Exception("Không tìm thấy trình duyệt Edge hoặc Chrome để xuất PDF")

    req = urllib.request.Request(epub_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    epub_bytes = urllib.request.urlopen(req, timeout=40).read()

    temp_dir = tempfile.mkdtemp(prefix="se_epub_")
    try:
        with zipfile.ZipFile(io.BytesIO(epub_bytes)) as z:
            z.extractall(temp_dir)

        opf_file = None
        for root, dirs, files in os.walk(temp_dir):
            for f in files:
                if f.endswith(".opf"):
                    opf_file = os.path.join(root, f)
                    break

        if not opf_file:
            raise Exception("Tệp EPUB không hợp lệ (không tìm thấy OPF package)")

        opf_dir = os.path.dirname(opf_file)
        tree = ET.parse(opf_file)
        root = tree.getroot()

        manifest = {}
        for item in root.findall(".//{http://www.idpf.org/2007/opf}item"):
            manifest[item.attrib.get("id")] = item.attrib.get("href")

        spine = []
        for itemref in root.findall(".//{http://www.idpf.org/2007/opf}itemref"):
            idref = itemref.attrib.get("idref")
            if idref in manifest:
                spine.append(manifest[idref])

        combined_html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@page {
    size: A5;
    margin: 18mm 14mm 18mm 14mm;
    @bottom-center {
        content: counter(page);
    }
}
body {
    font-family: "Georgia", "Baskerville", "Times New Roman", serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #111827;
    background-color: #ffffff;
}
h1, h2, h3 {
    text-align: center;
    page-break-before: always;
    margin-top: 36px;
    margin-bottom: 20px;
    font-weight: 600;
}
p {
    text-indent: 1.5em;
    margin-top: 0;
    margin-bottom: 0.25em;
    text-align: justify;
}
img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 20px auto;
}
.chapter-break {
    page-break-after: always;
}
header, footer, nav {
    display: none;
}
</style>
</head>
<body>
"""

        for rel_path in spine:
            full_path = os.path.join(opf_dir, rel_path)
            if os.path.exists(full_path) and (full_path.endswith(".xhtml") or full_path.endswith(".html")):
                with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    body_m = re.search(r"<body[^>]*>(.*?)</body>", content, re.DOTALL)
                    if body_m:
                        body_content = body_m.group(1)
                        combined_html += f'<div class="chapter-break">{body_content}</div>\n'

        combined_html += "</body></html>"

        combined_html_path = os.path.join(temp_dir, "combined_book.html")
        with open(combined_html_path, "w", encoding="utf-8") as f:
            f.write(combined_html)

        abs_output_pdf = os.path.abspath(output_pdf_path)
        os.makedirs(os.path.dirname(abs_output_pdf), exist_ok=True)
        cmd = [
            browser_exe,
            "--headless",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={abs_output_pdf}",
            f"file:///{combined_html_path.replace(os.sep, '/')}"
        ]

        res = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        if res.returncode != 0 or not os.path.exists(abs_output_pdf):
            raise Exception(f"Lỗi khi xuất PDF từ trình duyệt: {res.stderr}")

        return abs_output_pdf
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", help="Standard Ebooks page URL or slug")
    parser.add_argument("--search", help="Search Standard Ebooks by book title")
    parser.add_argument("--author", default="", help="Author name to assist search")
    parser.add_argument("--out-pdf", help="Output PDF file path (optional)")
    parser.add_argument("--out-json", help="Output Web Reader JSON file path (optional)")
    parser.add_argument("--preview-only", action="store_true", help="Only fetch metadata, do not convert to PDF or JSON")

    args = parser.parse_args()

    try:
        if args.search:
            result = search_standard_ebooks(args.search, args.author)
            if result:
                print(json.dumps({"success": True, "found": True, "data": result}, ensure_ascii=False))
            else:
                print(json.dumps({"success": True, "found": False, "data": None}, ensure_ascii=False))
            return

        if not args.url:
            raise Exception("Cần cung cấp --url hoặc --search")

        norm_url = normalize_url(args.url)
        metadata = fetch_metadata(norm_url)

        if args.preview_only:
            print(json.dumps({"success": True, "data": metadata}, ensure_ascii=False))
            return

        if not args.out_pdf and not args.out_json:
            raise Exception("Cần chỉ định --out-json hoặc --out-pdf khi chuyển đổi sách")

        if args.out_json:
            pkg = extract_web_reader_package(metadata["epubUrl"], args.out_json)
            metadata["jsonPath"] = os.path.abspath(args.out_json)
            metadata["jsonSizeBytes"] = os.path.getsize(args.out_json)
            metadata["totalPages"] = pkg["totalChapters"]
            metadata["totalChapters"] = pkg["totalChapters"]
            metadata["totalWords"] = pkg["totalWords"]
            metadata["format"] = "WEB_READER"

        if args.out_pdf:
            pdf_path = convert_epub_to_pdf(metadata["epubUrl"], args.out_pdf)
            pdf_size = os.path.getsize(pdf_path)

            pages_count = metadata["pages"]
            try:
                with open(pdf_path, "rb") as f:
                    pdf_data = f.read()
                    matches = re.findall(rb'/Type\s*/Page[^s]', pdf_data)
                    if matches:
                        pages_count = len(matches)
            except Exception:
                pass

            metadata["pdfPath"] = pdf_path
            metadata["pdfSizeBytes"] = pdf_size
            if not args.out_json:
                metadata["totalPages"] = pages_count
                metadata["format"] = "PDF"

        print(json.dumps({"success": True, "data": metadata}, ensure_ascii=False))

    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    main()
