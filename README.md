\# 🚀 Resume Gap Analyzer (ATS-Based)



\## 📌 Overview

Resume Gap Analyzer is a web application that evaluates a resume against a job description and provides:



\- Match Score  

\- ATS Score  

\- Missing Skills  

\- Weaknesses  

\- Actionable Suggestions  



It simulates how Applicant Tracking Systems (ATS) screen resumes using rule-based logic without external APIs.



\---



\## 🎯 Features



\- Upload Resume (PDF, DOCX) or paste text  

\- Paste Job Description  

\- Match Score calculation  

\- ATS Score (0–100)  

\- Keyword-based gap analysis  

\- Missing skills detection  

\- Weakness detection (metrics, relevance)  

\- Smart suggestions for improvement  

\- Copy results to clipboard  



\---



\## 🧠 ATS Score Calculation



The ATS score is calculated using:



\- Keyword Match → 50%  

\- Skill Coverage → 20%  

\- Metrics Presence → 15%  

\- Content Quality → 15%  



\---



\## 🏗️ Tech Stack



Frontend:

\- HTML  

\- CSS  

\- JavaScript  



Backend:

\- Node.js  

\- Express  



File Processing:

\- multer  

\- pdf-parse  

\- mammoth  



\---



\## 📁 Project Structure



resume-analyzer/

│── server.js

│── analyzer/

│   ├── extractKeywords.js

│   ├── matchScore.js

│   ├── weaknesses.js

│   ├── suggestions.js

│   └── atsScore.js

│

│── public/

│   ├── index.html

│   ├── style.css

│   └── script.js



\---



\## ⚙️ Installation \& Setup



1\. Clone the repository:

git clone https://github.com/your-username/resume-gap-analyzer.git

cd resume-gap-analyzer



2\. Install dependencies:

npm install express cors multer pdf-parse mammoth



3\. Run the server:

node server.js



4\. Open the app:

Open public/index.html in your browser



\---



\## 🔄 How It Works



1\. Upload resume (PDF/DOCX) or paste text  

2\. Enter job description  

3\. Click Analyze  

4\. Get results:

&#x20;  - Match Score  

&#x20;  - ATS Score  

&#x20;  - Weaknesses  

&#x20;  - Suggestions  



\---



\## 📊 Example Output



Match Score: 65% (Moderate Fit)  

ATS Score: 72/100  



Missing Skills:

\- SQL

\- Power BI



Weaknesses:

\- No quantified achievements



Suggestions:

\- Add SQL-based project  

\- Include measurable impact (e.g., improved efficiency by 25%)  



\---



\## 🚫 Limitations



\- DOC format has limited support  

\- Rule-based logic (not AI-powered)  

\- No database (stateless app)  



\---



\## 🔮 Future Improvements



\- Visual charts for score breakdown  

\- AI-based suggestions  

\- Resume section detection  

\- Deploy as SaaS  



\---



\## 🧠 Key Learning



\- Built ATS-like system using keyword matching  

\- Implemented PDF/DOCX parsing in Node.js  

\- Designed modular backend architecture  

\- Focused on explainable results  



\---



\## 🏆 Resume Description



Built an ATS-based Resume Gap Analyzer that evaluates resumes against job descriptions using keyword matching and rule-based scoring, including PDF/DOCX parsing and a weighted ATS scoring system.



\---



\## 📜 License

MIT License



\---



\## ⭐ Feedback

Feel free to contribute or raise issues!

