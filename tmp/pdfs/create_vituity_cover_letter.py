from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable


OUTPUT = "output/pdf/Xu_Xiao_Cover_Letter_Vituity.pdf"


def main():
    document = SimpleDocTemplate(
        OUTPUT,
        pagesize=LETTER,
        leftMargin=0.82 * inch,
        rightMargin=0.82 * inch,
        topMargin=0.70 * inch,
        bottomMargin=0.68 * inch,
        title="Xu Xiao - Cover Letter - Vituity",
        author="Xu Xiao",
    )
    styles = getSampleStyleSheet()
    ink = HexColor("#172721")
    teal = HexColor("#008776")
    muted = HexColor("#52645d")

    name = ParagraphStyle(
        "Name", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=25,
        leading=29, textColor=ink, spaceAfter=2,
    )
    role = ParagraphStyle(
        "Role", parent=styles["Normal"], fontName="Helvetica", fontSize=11,
        leading=15, textColor=teal, spaceAfter=14,
    )
    body = ParagraphStyle(
        "Body", parent=styles["Normal"], fontName="Helvetica", fontSize=10.5,
        leading=15.2, textColor=ink, alignment=TA_LEFT, spaceAfter=10,
    )
    closing = ParagraphStyle(
        "Closing", parent=body, spaceAfter=0,
    )

    story = [
        Paragraph("Xu Xiao", name),
        Paragraph("Software Engineering Candidate", role),
        HRFlowable(width="100%", thickness=0.7, color=HexColor("#9fcbbf"), spaceAfter=18),
        Paragraph("Dear Hiring Team,", body),
        Paragraph(
            "I am excited to apply for the Software Engineer I position at Vituity. "
            "I earned a Master of Science in Software Development from Boston University in 2025 "
            "and am eager to contribute my full-stack development, database, and problem-solving skills "
            "to a mission-driven organization working to improve healthcare.", body),
        Paragraph(
            "Through my academic coursework and the development of LandingPoint, a full-stack city discovery "
            "and relocation platform, I have gained hands-on experience building maintainable web applications "
            "and working across the software development lifecycle. Using Next.js, React, TypeScript, Supabase, "
            "and PostgreSQL, I built a city-matching application that ranks destinations based on user budgets, "
            "goals, and lifestyle priorities. I also designed data-driven city profile pages and implemented "
            "authentication, persistent user preferences, public reviews, and Row Level Security policies to "
            "support secure database access.", body),
        Paragraph(
            "This project strengthened my experience with JavaScript, TypeScript, SQL, PostgreSQL, Git, "
            "frontend and server-side web development, data validation, and production checks. My graduate "
            "coursework in data structures and algorithms, software design patterns, frontend and server-side "
            "web development, and database design has further prepared me to break down complex problems and "
            "develop structured, reliable solutions.", body),
        Paragraph(
            "I am especially drawn to Vituity's purpose of using technology to improve lives and to the "
            "opportunity to contribute through coding, testing, collaboration, and continuous learning. I am "
            "excited to deepen my knowledge of cloud deployment, CI/CD, monitoring, and generative AI while "
            "bringing a careful, collaborative, and growth-oriented approach to the team.", body),
        Paragraph(
            "Thank you for your consideration. I would welcome the opportunity to discuss how my technical "
            "foundation and enthusiasm for building reliable software can contribute to Vituity.", body),
        Spacer(1, 5),
        Paragraph("Sincerely,<br/><br/>Xu Xiao", closing),
    ]
    document.build(story)


if __name__ == "__main__":
    main()
