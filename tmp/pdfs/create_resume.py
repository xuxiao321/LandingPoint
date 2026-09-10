from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer


OUTPUT = "output/pdf/Xu_Xiao_Resume.pdf"
INK = colors.HexColor("#14211D")
ACCENT = colors.HexColor("#087C68")
MUTED = colors.HexColor("#4E6259")


def bullet(text):
    return Paragraph(f'<font color="#087C68">•</font>&nbsp;&nbsp;{text}', styles["body"])


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="name", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=24,
    leading=28, textColor=INK, spaceAfter=4,
))
styles.add(ParagraphStyle(
    name="headline", parent=styles["Normal"], fontName="Helvetica", fontSize=10,
    leading=14, textColor=ACCENT, spaceAfter=2,
))
styles.add(ParagraphStyle(
    name="contact", parent=styles["Normal"], fontName="Helvetica", fontSize=9.5,
    leading=14, textColor=MUTED, spaceAfter=12,
))
styles.add(ParagraphStyle(
    name="section", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=10,
    leading=14, textColor=ACCENT, spaceBefore=12, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="role", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=11,
    leading=15, textColor=INK, spaceAfter=1,
))
styles.add(ParagraphStyle(
    name="meta", parent=styles["Normal"], fontName="Helvetica", fontSize=9.5,
    leading=14, textColor=MUTED, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="coursework", parent=styles["Normal"], fontName="Helvetica", fontSize=9.2,
    leading=13, textColor=INK, spaceAfter=6,
))
styles.add(ParagraphStyle(
    name="body", parent=styles["Normal"], fontName="Helvetica", fontSize=9.5,
    leading=14, textColor=INK, spaceAfter=3,
))


doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=letter,
    leftMargin=0.72 * inch,
    rightMargin=0.72 * inch,
    topMargin=0.62 * inch,
    bottomMargin=0.62 * inch,
    title="Xu Xiao - Resume",
    author="Xu Xiao",
)

story = []
story += [
    Paragraph("Xu Xiao", styles["name"]),
    Paragraph("Full-Stack Software Engineer", styles["headline"]),
    Paragraph("(646) 858-8165  |  xiaoxu0630@gmail.com<br/>U.S. Permanent Resident | No visa sponsorship required", styles["contact"]),
    HRFlowable(width="100%", thickness=1, color=colors.HexColor("#BBD8CD"), spaceAfter=8),
    Paragraph("EDUCATION", styles["section"]),
    Paragraph("Boston University", styles["role"]),
    Paragraph("Master of Science in Software Development, 2025", styles["meta"]),
    Paragraph("<b>Relevant Coursework:</b> Data Structures &amp; Algorithms; Advanced Programming Techniques; Software Design &amp; Patterns; Frontend &amp; Server-Side Web Development; Database Design &amp; Implementation; Information Systems Analysis &amp; Design", styles["coursework"]),
    Paragraph("The City College of New York (CCNY)", styles["role"]),
    Paragraph("Bachelor of Arts in Economics, 2023", styles["meta"]),
    Paragraph("PROJECTS", styles["section"]),
    Paragraph("LandingPoint | Full-stack city discovery and relocation platform", styles["role"]),
    Paragraph("Next.js, React, TypeScript, Tailwind CSS, Supabase, PostgreSQL, Row Level Security", styles["meta"]),
    Paragraph('<b>Live Demo:</b> <link href="https://landing-point.vercel.app/" color="#087C68">landing-point.vercel.app</link> &nbsp;|&nbsp; <b>GitHub:</b> <link href="https://github.com/xuxiao321/LandingPoint" color="#087C68">github.com/xuxiao321/LandingPoint</link>', styles["meta"]),
    bullet("Built and deployed a city-matching web application that ranks destinations from user budget, goals, and weighted lifestyle priorities across a growing city catalog."),
    bullet("Designed source-backed city profiles with population, monthly living-cost estimates, connectivity, events, and resident reviews."),
    bullet("Implemented Supabase authentication, persistent saved cities and preferences, public reviews, and database access policies using Row Level Security."),
    bullet("Created data validation and production checks for city data, ranking behavior, account flows, and deployable Next.js builds."),
    Paragraph("TECHNICAL SKILLS", styles["section"]),
    Paragraph("<b>Languages:</b> TypeScript, JavaScript, Java, SQL", styles["body"]),
    Paragraph("<b>Frameworks and tools:</b> Next.js, React, Tailwind CSS, Supabase, PostgreSQL, Git, Vercel", styles["body"]),
    Paragraph("<b>Developer productivity:</b> OpenAI Codex; AI-assisted debugging, testing, and documentation", styles["body"]),
    Paragraph("<b>Focus:</b> Full-stack web development, data-informed product design, authentication and database security", styles["body"]),
]

doc.build(story)
