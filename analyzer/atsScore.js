function calculateKeywordScore(resumeKeywords, jdKeywords) {
    if (!jdKeywords || jdKeywords.length === 0) return 0;
    const resumeSet = new Set(resumeKeywords);
    let matched = 0;
    for (const keyword of jdKeywords) {
        if (resumeSet.has(keyword)) matched++;
    }
    return (matched / jdKeywords.length) * 100;
}

function calculateSkillScore(resumeText, jdKeywords) {
    // predefined skills
    const predefinedSkills = ['python', 'sql', 'excel', 'tableau', 'power bi', 'react', 'node', 'javascript', 'java', 'c++', 'aws', 'azure', 'agile', 'scrum', 'html', 'css', 'marketing', 'sales'];
    const textLower = resumeText.toLowerCase();
    
    // Find required skills from JD that are in predefined list
    const requiredSkills = jdKeywords.filter(kw => predefinedSkills.includes(kw));
    
    // If no specific predefined skills were found in JD, we check the resume against all JD keywords that are long enough
    const skillsToCheck = requiredSkills.length > 0 ? requiredSkills : jdKeywords.filter(kw => kw.length > 3);
    
    if (skillsToCheck.length === 0) return 0;

    let matchedSkills = 0;
    for (const skill of skillsToCheck) {
        // Regex to match whole word
        const regex = new RegExp(`\\b${skill}\\b`, 'i');
        if (regex.test(textLower)) {
            matchedSkills++;
        }
    }
    return (matchedSkills / skillsToCheck.length) * 100;
}

function calculateMetricsScore(resumeText) {
    // If resume contains numbers (% or digits), give higher score
    const matches = resumeText.match(/\d+%?/g) || [];
    // At least 5 numbers/metrics for a perfect 100 score on this section
    const score = Math.min((matches.length / 5) * 100, 100);
    return score;
}

function calculateContentScore(resumeText) {
    let score = 0;
    
    const words = resumeText.split(/\s+/).filter(w => w.trim() !== '');
    // length score component (up to 50 pts)
    if (words.length >= 200) score += 50;
    else score += (words.length / 200) * 50;
    
    // presence of action words (up to 50 pts)
    const actionWords = ['developed', 'built', 'analyzed', 'led', 'managed', 'created', 'designed', 'implemented', 'improved', 'increased', 'delivered', 'optimized', 'spearheaded', 'orchestrated'];
    
    let matchedActionWords = 0;
    const textLower = resumeText.toLowerCase();
    for (const word of actionWords) {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(textLower)) {
            matchedActionWords++;
        }
    }
    
    // Max out around 5 action words
    score += Math.min((matchedActionWords / 5) * 50, 50);
    
    return score;
}

function calculateATSScore(resumeText, jdKeywords, resumeKeywords) {
    if (!jdKeywords || jdKeywords.length === 0) return {score: 0, breakdown: {keywordScore:0, skillScore:0, metricsScore:0, contentScore:0}};
    
    const keywordScore = calculateKeywordScore(resumeKeywords, jdKeywords);
    const skillScore = calculateSkillScore(resumeText, jdKeywords);
    const metricsScore = calculateMetricsScore(resumeText);
    const contentScore = calculateContentScore(resumeText);
    
    // Formula: (0.5 * kw) + (0.2 * skill) + (0.15 * metrics) + (0.15 * content)
    const finalScore = (0.5 * keywordScore) + (0.2 * skillScore) + (0.15 * metricsScore) + (0.15 * contentScore);
    
    return {
        score: Math.round(finalScore),
        breakdown: {
            keywordScore: Math.round(keywordScore),
            skillScore: Math.round(skillScore),
            metricsScore: Math.round(metricsScore),
            contentScore: Math.round(contentScore)
        }
    };
}

module.exports = calculateATSScore;
