import markdown2
from xhtml2pdf import pisa

with open('README.md', 'r', encoding='utf-8') as f:
    md_content = f.read()

# Convert markdown to html
html_content = markdown2.markdown(md_content, extras=["tables"])

# Add some basic CSS for formatting
html_template = f"""
<html>
<head>
<style>
    @page {{
        size: A4;
        margin: 1.5cm;
        @frame footer {{
            -pdf-frame-content: footerContent;
            bottom: 1cm;
            margin-left: 1.5cm;
            margin-right: 1.5cm;
            height: 1cm;
        }}
    }}
    body {{ font-family: Helvetica, Arial, sans-serif; font-size: 11pt; line-height: 1.4; }}
    h1 {{ color: #2c3e50; text-align: center; margin-bottom: 20px; }}
    h2 {{ color: #2980b9; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; margin-top: 25px; }}
    h3 {{ color: #34495e; }}
    code {{ font-family: Courier, monospace; background-color: #f4f6f7; padding: 2px 4px; }}
    pre {{ background-color: #f4f6f7; padding: 10px; font-family: Courier, monospace; white-space: pre-wrap; }}
    p {{ text-align: justify; }}
    table {{ width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px; }}
    th, td {{ border: 1px solid #bdc3c7; padding: 8px; text-align: left; }}
    th {{ background-color: #ecf0f1; }}
</style>
</head>
<body>
    {html_content}
    <div id="footerContent" style="text-align: right; font-size: 9pt;">
        Page <pdf:pagenumber>
    </div>
</body>
</html>
"""

with open('README_Project_Report.pdf', "w+b") as out_pdf:
    pisa_status = pisa.CreatePDF(html_template, dest=out_pdf)

if pisa_status.err:
    print("Error generating PDF")
else:
    print("PDF generated successfully: README_Project_Report.pdf")
