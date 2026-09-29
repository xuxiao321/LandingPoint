from pathlib import Path
from html import escape
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'output/pdf/CWILL_HR_Screening_Xu_Xiao_Bilingual.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
pdfmetrics.registerFont(TTFont('CJK', 'C:/Windows/Fonts/msyh.ttc', subfontIndex=0))
pdfmetrics.registerFont(TTFont('CJKB', 'C:/Windows/Fonts/msyhbd.ttc', subfontIndex=0))
INK, GREEN, MUTED = '#172C32', '#087D74', '#596C72'
styles = {
 'title': ParagraphStyle('title', fontName='CJKB', fontSize=28, leading=37, textColor=HexColor(INK), spaceAfter=16),
 'section': ParagraphStyle('section', fontName='CJKB', fontSize=19, leading=27, textColor=HexColor(INK), spaceAfter=14),
 'q': ParagraphStyle('q', fontName='CJKB', fontSize=11.5, leading=17, textColor=HexColor(INK), spaceAfter=5),
 'en': ParagraphStyle('en', fontName='Helvetica', fontSize=10.6, leading=15.4, textColor=HexColor(INK), spaceAfter=6),
 'cn': ParagraphStyle('cn', fontName='CJK', fontSize=9.2, leading=14.5, textColor=HexColor(MUTED), spaceAfter=6, wordWrap='CJK'),
 'note': ParagraphStyle('note', fontName='CJK', fontSize=8.6, leading=13, textColor=HexColor(GREEN), spaceAfter=7, wordWrap='CJK'),
 'body': ParagraphStyle('body', fontName='CJK', fontSize=10.5, leading=18, textColor=HexColor(INK), spaceAfter=10, wordWrap='CJK'),
 'label': ParagraphStyle('label', fontName='Helvetica-Bold', fontSize=9, leading=14, textColor=HexColor(GREEN), spaceAfter=8),
}
story=[]
def p(text, style='body'):
    return Paragraph(escape(text).replace('\n','<br/>'), styles[style])
def add(text, style='body'):
    story.append(p(text, style))
def section(k, title):
    if story: story.append(PageBreak())
    add(k, 'label'); add(title, 'section')
def qa(n, title, en, cn, note=''):
    blocks=[p(f'{n:02d}  {title}', 'q'),p(en,'en'),p('中文思路：'+cn,'cn')]
    if note: blocks.append(p(note,'note'))
    blocks.append(Spacer(1,11))
    story.append(KeepTogether(blocks))

add('INTERVIEW PLAYBOOK / 24 SEP 2026', 'label')
add('CWILL\nHR Screening\n中英双语准备手册','title')
add('Xu Xiao  |  R&D Management Trainee','label')
add('简单英文 · 真实经历 · 30 分钟面试准备','section')
add('你的主线：经济学本科 → BU 软件开发硕士 → 因家庭需要在餐馆帮忙 → LandingPoint 实践 → 第一份全职工程岗位。')
add('核心定位：有 Web 开发和数据库基础，愿意处理客户问题、修复 bug，并在团队反馈中成长。中英文沟通和无需签证担保是额外匹配点。')
add('这份手册依据你提供的简历、职位描述、对话中确认的经历，以及 LandingPoint 的代码与修改记录整理。问题是有针对性的准备清单，不是 CWILL 已确认的面试题。')
add('怎么使用','q')
add('普通问题回答约 20–40 秒；自我介绍和项目介绍约 45–60 秒；真实案例约 60–90 秒。先讲结论，说完停下来，让 HR 追问。')
add('方括号 [ ] 是面试前必须补齐的信息。“按实际情况使用”表示建议表达，并非已核实的个人经历。不要把计划、假设或 AI 完成的步骤讲成自己亲自做过。','note')
add('内容导航','q')
add('第 2–3 页：个人经历与岗位动机\n第 4–5 页：项目、技能、AI 与产品组\n第 6 页：有代码依据的排名案例\n第 7–9 页：排障、沟通、缺点与行为题\n第 10–11 页：工作安排与简短技术追问\n第 12 页：反问、30 分钟安排、面试前清单','cn')

section('01 / BACKGROUND','把你的经历讲顺')
qa(1,'Tell me about yourself. / 自我介绍',
"Hi, I'm Xu Xiao. I graduated from Boston University in 2025 with a master's degree in Software Development. Before that, I studied Economics at City College of New York. Recently, I've been working on LandingPoint, a website that helps people compare cities based on their budget and lifestyle. I worked on city matching, accounts, and saved cities using TypeScript, React, Next.js, and PostgreSQL. I'm looking for my first full-time engineering role, where I can solve real problems and learn from experienced engineers.",
'BU 软件开发硕士、本科经济学；最近做 LandingPoint；希望进入工程团队解决真实问题。开场先讲能力，家庭经历留到被问时展开。')
qa(2,'Why did you switch to software? / 为什么转专业？',
"I liked the problem-solving part of economics, but I wanted to build tools that people could use. That led me to study software development at BU. Through my classes and projects, I found that I enjoy turning an idea into something that works, then testing and improving it.",
'经济学培养了分析问题的能力，后来希望动手做出工具，通过课程和项目确认了开发兴趣。',
'按真实动机使用；准备补充一门课程或一次实际经历，不需要编一个特别戏剧化的转折。')
qa(3,'What have you done since graduation? / 毕业后做了什么？',
"After graduating in 2025, I needed to help my family by working at a restaurant. More recently, I've been building LandingPoint and getting more practice with web development. I'm now looking to start my full-time career in software engineering.",
'毕业后因家庭需要在餐馆工作；最近开发 LandingPoint；现在寻找全职工程岗位。',
'补齐毕业月份、餐馆工作的起止时间、项目开始时间。只有餐馆是家里开的，才说 my family\'s restaurant。')

section('02 / MOTIVATION','证明你理解公司和岗位')
qa(4,'What do you know about CWILL? / 了解公司吗？',
"CWILL builds software for Shopify brands. Its tools help stores with order tracking, returns, loyalty, marketing, and customer support. For example, a clear tracking page lets customers check their delivery status without contacting support. My understanding is that CWILL helps stores reduce support work and bring customers back.",
'公司给 Shopify 商家提供软件，帮助减少客服工作、改善购物后的体验并促进复购。用订单追踪举一个具体例子即可。')
qa(5,'Why CWILL and this trainee role? / 为什么申请？',
"I like that your products solve clear problems for online stores. This role also includes investigating customer issues, which would help me understand how people actually use the product. My project gave me a foundation in web development and databases. I'd like to use those skills to help the team while learning from senior engineers.",
'业务问题具体；愿意接触客户问题；已有技能可以贡献，也需要团队指导。',
'别只说“你们能培训我”。Management Trainee 在这份 JD 中是工程师培养路线，不是立即带团队。')
qa(6,'Are you comfortable with support work? / 接受工单和维护吗？',
"Yes. I saw that customer issues and bug fixes are an important part of this role, and I'm comfortable with that. Fixing existing problems would help me learn the code and understand user needs. I'd also keep the support team updated and check that the issue is resolved before closing it.",
'明确接受工单、排障和维护；修复能帮助熟悉产品；重视更新进度和问题闭环。',
'这份 JD 将 Customer Issue Support 放在前面，值得重点练。若不确定开发与支持比例，反问确认。')

section('03 / LANDINGPOINT','项目回答：用途、贡献、边界')
qa(7,'Tell me about LandingPoint. / 项目介绍',
"LandingPoint helps people compare cities before moving. Users enter their budget, goals, and lifestyle choices, such as lower costs or public transportation. The app ranks cities based on those choices. Users can also compare cities, save favorites, and write reviews. I used React and Next.js for the web app, TypeScript for the logic, and Supabase with PostgreSQL for accounts and user data. I wanted users to understand why a city was recommended, instead of only seeing a score.",
'先说用户需求，再说三四个核心功能，最后简要说明技术与设计目标。不必一开始就解释全部数据库和评分细节。')
qa(8,'What did you personally do? / 你负责什么？',
"I worked on the city search and ranking logic, the city pages, and account features such as saved cities and preferences. I also worked on database access rules and checks for the data and application behavior. I used AI tools during development, and I can walk you through the parts I worked on.",
'把个人贡献限定在实际参与、能够解释的模块；准备解释一个功能的输入、处理、输出和数据存储。',
'不要把“仓库里有这个功能”自动等同于“我亲自设计并完成了所有代码”。')
qa(9,'Why build it? Is it live? Who uses it? / 动机、上线和用户',
"The problem I wanted to explore was how to compare cities when the information is spread across different places. LandingPoint brings the main information into one site. It's deployed on Vercel, and I can share the demo and GitHub repository. For usage, [give your actual user or feedback information].",
'问题是信息分散，产品集中展示并帮助比较。简历列有 Vercel 演示和 GitHub；用户数和反馈必须如实补充。',
'没有跟踪用户量可说：I haven\'t tracked user numbers yet. 不要把个人项目说成已有付费客户的成熟 SaaS。')

section('04 / SKILLS & FIT','技术基础、AI 和产品兴趣')
qa(10,'Which language are you strongest in? / 最熟悉哪门语言？',
"JavaScript and TypeScript are the languages I've used most recently in LandingPoint. I've used them for the web application and its logic. I also studied Java and SQL. For a coding exercise, I'd prefer JavaScript if the team allows it.",
'最近实际用得最多的语言比“精通全部技术”更可信。简历有 Java 和 SQL，也要能回答基础问题。',
'按你的真实熟练度调整；JD 接受 JS/TS，不代表公司一定允许所有面试题使用它。')
qa(11,'Do you have Shopify or AI experience? / Shopify 与 AI 经验',
"I haven't built a Shopify app yet. My experience is mainly from coursework and LandingPoint. I use AI tools to help understand code, explore solutions, and work on debugging and tests. My AI experience is mainly with development tools; LandingPoint uses weighted scores, not an LLM. I'd be interested in learning how your team builds Shopify and AI features.",
'坦诚没有 Shopify 经验；区分 AI 辅助开发与开发 LLM 产品；强调可以迁移的 Web 和数据库基础。',
'若问如何检查 AI 输出：I review the changes, try the feature, and use tests to check the behavior. 只讲实际做过的检查。')
qa(12,'Which team interests you? / 对哪个产品组感兴趣？',
"Order Tracking interests me because it involves giving users clear and accurate information. In LandingPoint, I also worked on displaying data and handling missing information. I'd be happy to learn about the other teams and join where my skills would be most useful.",
'如果没有特别偏好，可选与数据展示和准确性相关的 Order Tracking；保持开放，但给出具体理由。',
'这是建议选项，不是你的既定偏好。也可选 Loyalty，解释对账户、积分规则和用户数据的兴趣。')

section('05 / A GROUNDED EXAMPLE','排名案例：理解后再讲')
add('13  Tell me about a problem you solved. / 讲一次解决问题的经历','q')
add('代码已证实：提交 2729720 将排序从“匹配度 × 数据覆盖率”改成按 migrationFit 排序，并用城市名处理相同分数。数据覆盖信息仍然保留。旧规则可能让较高显示分数的城市排在较低分城市后面。','body')
add('下面是有条件的口语稿。代码记录不能证明你本人如何发现、排查和测试。只有参与过这些步骤，才保留 I noticed / I checked / I tested；否则说这是一次你能解释的项目修改，并明确实际参与部分。','note')
add("In LandingPoint, I noticed that the city order didn't always match the scores shown on the page. A city with a higher score could appear below one with a lower score. I checked the scoring and sorting code and found that the sorting also used data coverage, but the displayed score did not. I changed the sorting to match the score shown to users and kept data coverage separate. Then I tested [the cases you actually checked]. It taught me to check that what users see matches how the system works.",'en')
add('中文：城市顺序与显示分数不一致；检查评分和排序发现采用了不同依据；统一排序与显示依据，同时保留覆盖信息；用真实验证用例检查结果。','cn')
qa(14,'Was the old calculation wrong? / 原来的计算错了吗？',
"Not necessarily. Considering data coverage can be a valid choice. The problem was that users saw one score while the order used another rule. The change made the ranking easier to understand, while still showing how much data was available.",
'不是说考虑数据完整度一定错，而是原来的排序规则没有清楚反映在用户看到的分数里。')
add('你可以实际验证的三种情况','q')
add('1. 用固定偏好确认城市显示分数按从高到低排列。\n2. 改变预算或偏好权重，再确认顺序与分数一致。\n3. 两城分数相同时检查稳定排序，并确认覆盖信息仍显示。','cn')
add('示意数字：85 分、覆盖率 50% → 旧排序值 42.5；80 分、覆盖率 100% → 旧排序值 80。这只解释机制，不是已观察到的用户数据。','note')

section('06 / CUSTOMER ISSUES','排障、优先级和沟通')
qa(15,'How would you handle a customer issue? / 客户反馈问题怎么办？',
"I'd first ask what happened, when it happened, and what steps led to it. I'd also check how many users were affected. Then I'd try to reproduce the problem and check the request, logs, and relevant data. If it was urgent or I needed help, I'd raise it early. After a fix, I'd test it and update the support team.",
'收集信息与影响范围 → 复现 → 检查请求、日志、数据 → 及时求助和同步 → 修复后验证。')
qa(16,'How do you prioritize several issues? / 多个问题怎么排序？',
"I'd look at the impact and urgency: how many users are affected, whether a key feature is blocked, and whether there is a risk to customer data. I'd usually handle a major service problem before a small display issue. If I'm unsure, I'd confirm the priority with the team.",
'按业务影响与紧急程度判断；多人关键功能不可用、数据风险通常高于小的展示问题；不确定就确认。')
qa(17,'What if you get stuck or miss a deadline? / 卡住或可能延期怎么办？',
"I'd explain what is blocked, what I've tried, and what help I need. If the deadline may be affected, I'd say so early and agree on the next step with the team. When the cause is still unclear, I'd give a time for my next update rather than promise a fix time I can't support.",
'带着已尝试的方法求助；尽早报告风险；原因不明时承诺下一次更新时间，不乱承诺修复时间。')

section('07 / SELF-AWARENESS','优势、缺点和成长目标')
qa(18,'What is your weakness? / 你的缺点是什么？',
"Sometimes I spend too much time on small details, even when the main feature already works. That can slow me down. I'm working on setting clearer priorities and time limits. I try to finish the important parts first, then improve smaller details if there's time.",
'有时在细节上花过多时间，影响效率；用明确优先级和时间限制改善。',
'不要说 I have OCD。尚未实行改善时，将 I\'m working on 改为 My next step is to work on。例子可用反复调页面布局，但必须确实发生过。')
qa(19,'What are your strengths? Why hire you? / 优势和录用理由',
"I have a foundation in web development and databases, and I've put it into practice through LandingPoint. I also care about making features clear for users. I'm early in my career, so I don't expect to know everything. I'm willing to start with smaller tasks, ask questions, and improve through feedback. I can also communicate in Mandarin and English.",
'基础与项目实践 + 用户视角 + 愿意接受指导 + 双语。用具体项目支持，不要堆“努力、负责、完美”等形容词。')
qa(20,'Where do you want to grow? / 职业目标是什么？',
"In the next few years, I want to become an engineer who can take a feature or problem from start to finish. First, I want to get better at debugging, testing, and working in a team. Over time, I'd like to own a small part of a product and make good technical decisions.",
'先提高排障、测试和协作能力，再独立负责一个模块。与 JD 的成长路线一致，不急着强调管理头衔。')

section('08 / BEHAVIORAL FOLLOW-UPS','需要真实例子的追问')
qa(21,'How do you handle feedback or disagreement? / 反馈和分歧',
"I try to understand the reason behind the feedback before responding. If I disagree, I'd explain my concern with a concrete example and ask what matters most for the task. Once we agree on a decision, I'd follow through. For a real example, [briefly describe a class, project, or restaurant situation].",
'先理解依据，再用具体例子讨论；确定方案后落实。真实团队经历可以来自课程或餐馆，不必编公司经验。',
'填空：双方想法是什么？你怎么听取意见？最终怎么决定？结果如何？不要把假设处理方式当成过去经历。')
qa(22,'Tell me about a mistake you made. / 讲一次失误',
"In [a real situation], I [what you did wrong]. It caused [the actual effect]. I took responsibility and [what you did to fix it]. After that, I [a change you actually made] to reduce the chance of it happening again.",
'选一个真实、范围清楚的小失误。承认自己的行为，说明补救和后续改变，不甩锅。',
'没有足够事实生成完整故事。可从误解需求、遗漏检查、安排时间不足中找真实经历；不要虚构数据丢失或生产事故。')
qa(23,'What did restaurant work teach you? / 餐馆经历与沟通',
"It taught me to listen carefully and stay calm when things get busy. When a customer has a problem, I need to understand what happened, explain what I can do, and follow up. I think that would help me work with a support team. One example was [a real customer situation and your response].",
'把餐馆里的倾听、解释和跟进，联系到支持团队协作；不要把餐馆经历说成软件技术支持。',
'仅当你实际接触过顾客才使用这个版本；若主要做后厨，可改为分工、优先级与忙碌时沟通。')

section('09 / PRACTICAL DETAILS','身份、语言、薪资与工作安排')
qa(24,'Do you need sponsorship? Can you work bilingually? / 身份和语言',
"I'm a U.S. permanent resident, so I don't need visa sponsorship now or in the future. I can communicate in both Mandarin and English.",
'绿卡身份已在简历中确认。双语说清楚即可，无需夸大为 native-level。',
'如果没听清：Could you please repeat the last part? 如果需要思考：Let me think for a moment. 比急着猜题更好。')
qa(25,'What are your salary expectations? / 薪资期望',
"The posted range of $60,000 to $80,000 is within my expectations. I'm open to discussing the exact amount based on the responsibilities and benefits. If you need a target, I'm looking for around [your target] in base salary.",
'此前提供的 JD 写了 60–80k；只有你接受才使用此回答。面试前确定目标和个人底线，不需要主动报底线。',
'如果新招聘信息范围不同，使用最新确认的区间；base salary 指基本工资。')
qa(26,'When can you start? Where can you work? / 入职、地点与家庭安排',
"I'm currently based in [city, state]. I can start [date or notice period]. For the work location, I can [your actual commute or relocation plan]. I've made arrangements so I can commit to the full-time schedule.",
'准确填写当前位置、入职日期、通勤或搬迁条件；最后一句仅在家庭安排已经落实时使用。',
'可反问：Could you clarify the office schedule and any regular cross-time-zone meetings? 对加班、值班和搬家不要一概答 yes。')

section('10 / SHORT FOLLOW-UPS','其他流程问题与简短技术问答')
qa(27,'Are you interviewing elsewhere? / 其他面试与时间线',
"I'm [currently speaking with other companies / mainly at the application stage]. I'm looking for entry-level engineering roles where I can build useful skills and contribute to a product. [I have a decision deadline on DATE / I don't have an offer deadline right now].",
'按真实求职进度选择，不需要透露公司名称或虚构 offer。若有截止日期，明确告诉 HR。')
qa(28,'How do you learn a new tool? / 怎样学习陌生技术？',
"I start with the official documentation and a small example. Then I try one feature, check what works, and build from there. If I get stuck, I narrow down the problem and ask a specific question. In LandingPoint, I can explain this using [a tool you actually learned and the steps you took].",
'先文档和小例子，再扩展；准备一个真实工具学习过程，如 Supabase Auth 或 Next.js API，不编学习时长。')
qa(29,'Can you explain your web and database basics? / 基础能力快速确认',
"The frontend sends a request to the server. The server checks the input and permissions, reads or updates data, and returns a response. In LandingPoint, city facts are stored in project data files, while account data uses PostgreSQL through Supabase. Database access rules help keep one user's private data separate from another user's data.",
'能讲清前端请求、服务端验证、数据读写和响应。城市资料并非全部放在 PostgreSQL 中，避免讲错自己的架构。',
'可补充：GET reads data; POST submits data or creates a resource. SQL 准备 SELECT、WHERE、JOIN。HR 如追问，不会的直接说明。')

section('11 / FINAL PREPARATION','反问、节奏与面试前检查')
add('30  Do you have any questions for me? / 反问：选两到三个','q')
for en,cn in [
('What would I mainly work on during the first three months?','前三个月主要工作是什么？'),
('How is the work split between customer issues and new feature development?','客户问题与新功能开发怎么分配？'),
('How do trainees get help and feedback from senior engineers?','新人如何得到指导和反馈？'),
('What does the next interview involve? Will there be live coding or SQL questions?','下一轮是否包含现场编程或 SQL？')]:
    add(en,'en'); add(cn,'cn')
add('结束语','q')
add("Thank you for explaining the role. It was helpful to learn more about the team, and I'm interested in the next steps.",'en')
add('30 分钟参考安排（不是公司确认的流程）','q')
add('0–4 分钟：打招呼、HR 介绍岗位\n4–10 分钟：自我介绍、转专业、毕业后经历\n10–19 分钟：LandingPoint、贡献、岗位兴趣和追问\n19–24 分钟：身份、薪资、地点和入职时间\n24–30 分钟：你的反问、后续流程与时间缓冲','cn')
add('面试前必做','q')
add('① 补齐所有 [ ]，删掉不符合实际的句子。\n② 练熟问题 1、3、5、6、7、18、24–26。\n③ 准备一段真实排障故事、一段沟通或反馈故事。\n④ 打开简历、GitHub 和演示；检查演示能正常使用。\n⑤ 演示控制在两分钟：输入偏好 → 推荐 → 城市详情 → 一个已验证功能。\n⑥ 不虚构用户数、企业生产经验、Shopify/LLM 经历或个人排查步骤。','cn')
add('资料依据与范围','q')
add('用户提供：Xu_Xiao_Resume.pdf、CWILL JD、餐馆和家庭经历。\n代码依据：src/lib/recommendations.ts；FULLSTACK_SETUP.md；提交 2729720。\n简历链接：https://landing-point.vercel.app/ · https://github.com/xuxiao321/LandingPoint\n未声称：公司实际题库、淘汰率、面试算法难度、用户本人完成了全部验证。','note')

class NumberedCanvas(canvas.Canvas):
    def __init__(self,*a,**kw):
        super().__init__(*a,**kw); self.states=[]
    def showPage(self):
        self.states.append(dict(self.__dict__)); self._startPage()
    def save(self):
        total=len(self.states)
        for state in self.states:
            self.__dict__.update(state)
            self.setStrokeColor(HexColor('#D6E2E2')); self.setLineWidth(.6)
            self.line(44, forty:=40, 551, forty)
            self.setFont('Helvetica',8); self.setFillColor(HexColor(MUTED))
            self.drawString(44,26,'XU XIAO  /  CWILL HR SCREENING  /  24 SEP 2026')
            self.drawRightString(551,26,f'{self._pageNumber} / {total}')
            super().showPage()
        super().save()

doc=SimpleDocTemplate(str(OUT),pagesize=(595.28,841.89),leftMargin=44,rightMargin=44,topMargin=40,bottomMargin=57,
    title='CWILL HR Screening - Xu Xiao - Bilingual Interview Guide',author='Xu Xiao')
doc.build(story,canvasmaker=NumberedCanvas)
print(OUT)
