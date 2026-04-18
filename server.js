const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const extractKeywords = require('./analyzer/extractKeywords');
const matchScore = require('./analyzer/matchScore');
const checkWeaknesses = require('./analyzer/weaknesses');
const getSuggestions = require('./analyzer/suggestions');
const calculateATSScore = require('./analyzer/atsScore');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure Multer
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const filePath = req.file.path;
        const mimeType = req.file.mimetype;
        const originalName = req.file.originalname.toLowerCase();
        
        let extractedText = '';

        if (mimeType === 'application/pdf' || originalName.endsWith('.pdf')) {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            extractedText = data.text;
        } else if (originalName.endsWith('.docx')) {
            const result = await mammoth.extractRawText({ path: filePath });
            extractedText = result.value;
        } else if (originalName.endsWith('.doc')) {
            // DOC not fully supported
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: 'DOC format not fully supported. Please upload DOCX or PDF.' });
        } else {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: 'Unsupported file format.' });
        }

        // Cleanup
        fs.unlinkSync(filePath);

        res.json({ extractedText });

    } catch (err) {
        console.error(err);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'An error occurred during file extraction.' });
    }
});

app.post('/analyze', (req, res) => {
    try {
        const { resume, jobDescription } = req.body;

        if (!resume || !jobDescription) {
            return res.status(400).json({ error: 'Resume and Job Description are required.' });
        }

        // 1. Keyword Extraction
        const resumeKeywords = extractKeywords(resume);
        const jdKeywords = extractKeywords(jobDescription);

        // 2. Match Score
        const score = matchScore(resumeKeywords, jdKeywords);
        
        // ATS Score
        const atsData = calculateATSScore(resume, jdKeywords, resumeKeywords);

        // 5. Fit Label (derived from score)
        let fit = "Weak Fit";
        if (score >= 80) fit = "Strong Fit";
        else if (score >= 60) fit = "Moderate Fit";

        // 3. Weaknesses
        const weaknesses = checkWeaknesses(resume, jdKeywords, resumeKeywords);

        // 4. Suggestions
        const suggestions = getSuggestions(weaknesses);

        res.json({
            matchScore: score,
            atsScore: atsData.score,
            atsBreakdown: atsData.breakdown,
            fit,
            weaknesses,
            suggestions
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred during analysis.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
