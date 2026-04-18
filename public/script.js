const analyzeBtn = document.getElementById('analyze-btn');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader');
const resultsSection = document.getElementById('results-section');
const copyBtn = document.getElementById('copy-btn');
const resumeFileInput = document.getElementById('resume-file');
const uploadFeedback = document.getElementById('upload-feedback');
const resumeTextarea = document.getElementById('resume');

// Handle File Upload
resumeFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // reset feedback
    uploadFeedback.classList.remove('hidden');
    uploadFeedback.className = "feedback-text info";
    uploadFeedback.textContent = "Uploading & Extracting...";
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            resumeTextarea.value = data.extractedText;
            uploadFeedback.textContent = "Extracted successfully!";
            uploadFeedback.className = "feedback-text success";
        } else {
            uploadFeedback.textContent = data.error || "Upload failed.";
            uploadFeedback.className = "feedback-text error";
        }
    } catch (err) {
        console.error(err);
        uploadFeedback.textContent = "Server error during upload.";
        uploadFeedback.className = "feedback-text error";
    } finally {
        setTimeout(() => {
            if(uploadFeedback.classList.contains('success')) {
                uploadFeedback.classList.add('hidden');
            }
        }, 5000); // hide success after 5s
    }
});

analyzeBtn.addEventListener('click', async () => {
    const resumeText = document.getElementById('resume').value.trim();
    const jdText = document.getElementById('job-description').value.trim();

    if (!resumeText || !jdText) {
        alert("Please paste both your resume and the job description.");
        return;
    }

    // Show loading
    btnText.textContent = "Analyzing...";
    loader.classList.remove('hidden');
    analyzeBtn.disabled = true;
    resultsSection.classList.add('hidden');

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                resume: resumeText,
                jobDescription: jdText
            })
        });

        const data = await response.json();

        if (response.ok) {
            displayResults(data);
        } else {
            alert(data.error || "An error occurred during analysis.");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to connect to the server. Is it running?");
    } finally {
        // Hide loading
        btnText.textContent = "Analyze Resume";
        loader.classList.add('hidden');
        analyzeBtn.disabled = false;
    }
});

function displayResults(data) {
    const { matchScore, atsScore, atsBreakdown, fit, weaknesses, suggestions } = data;
    
    // Update ATS Score Card
    const atsScoreText = document.getElementById('ats-score-text');
    const atsIndicator = document.getElementById('ats-indicator');
    
    atsScoreText.textContent = atsScore;
    
    if (atsScore >= 80) {
        atsScoreText.className = "big-score fit-strong";
        atsIndicator.textContent = "🟢 Strong";
        atsIndicator.className = "pill bg-strong";
    } else if (atsScore >= 60) {
        atsScoreText.className = "big-score fit-moderate";
        atsIndicator.textContent = "🟡 Moderate";
        atsIndicator.className = "pill bg-moderate";
    } else {
        atsScoreText.className = "big-score fit-weak";
        atsIndicator.textContent = "🔴 Needs Improvement";
        atsIndicator.className = "pill bg-weak";
    }
    
    // Update ATS Breakdown
    document.getElementById('bd-keywords').textContent = `${atsBreakdown.keywordScore}`;
    document.getElementById('bd-skills').textContent = `${atsBreakdown.skillScore}`;
    document.getElementById('bd-metrics').textContent = `${atsBreakdown.metricsScore}`;
    document.getElementById('bd-content').textContent = `${atsBreakdown.contentScore}`;


    // Update Match Score Circle
    const circle = document.getElementById('score-circle');
    const scoreText = document.getElementById('score-text');
    const fitLabel = document.getElementById('fit-label');

    scoreText.textContent = `${matchScore}%`;
    circle.setAttribute('stroke-dasharray', `${matchScore}, 100`);
    
    fitLabel.textContent = fit;

    // Reset styles
    circle.className.baseVal = "circle";
    fitLabel.className = "fit-label";

    if (matchScore >= 80) {
        circle.classList.add('fit-strong');
        fitLabel.classList.add('fit-strong');
    } else if (matchScore >= 60) {
        circle.classList.add('fit-moderate');
        fitLabel.classList.add('fit-moderate');
    } else {
        circle.classList.add('fit-weak');
        fitLabel.classList.add('fit-weak');
    }

    // Populate Weaknesses
    const weaknessesList = document.getElementById('weaknesses-list');
    weaknessesList.innerHTML = '';
    
    if (weaknesses.length === 0) {
        weaknessesList.innerHTML = '<li>No major weaknesses found!</li>';
    } else {
        weaknesses.forEach(w => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${w.type}</strong><span>${w.details.join(', ')}</span>`;
            weaknessesList.appendChild(li);
        });
    }

    // Populate Suggestions
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = '';

    if (suggestions.length === 0) {
        suggestionsList.innerHTML = '<li>Your resume looks great! Keep applying.</li>';
    } else {
        suggestions.forEach(s => {
            const li = document.createElement('li');
            li.textContent = s;
            suggestionsList.appendChild(li);
        });
    }

    // Show Results
    resultsSection.classList.remove('hidden');
    
    // Store data for copy button
    copyBtn.dataset.results = JSON.stringify(data, null, 2);
}

copyBtn.addEventListener('click', () => {
    const dataJSON = copyBtn.dataset.results;
    if (dataJSON) {
        const data = JSON.parse(dataJSON);
        let textToCopy = `ATS Score: ${data.atsScore}/100\nMatch Score: ${data.matchScore}%\nFit: ${data.fit}\n\nWeaknesses:\n`;
        
        data.weaknesses.forEach(w => {
            textToCopy += `- ${w.type}: ${w.details.join(', ')}\n`;
        });

        textToCopy += `\nSuggestions:\n`;
        data.suggestions.forEach(s => {
            textToCopy += `- ${s}\n`;
        });

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied!";
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert("Failed to copy results.");
        });
    }
});
