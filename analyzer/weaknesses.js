function checkWeaknesses(resumeText, jdKeywords, resumeKeywords) {
    const weaknesses = [];
    const resumeSet = new Set(resumeKeywords);
    
    // Check Missing Skills
    const missingSkills = jdKeywords.filter(keyword => !resumeSet.has(keyword));
    
    if (missingSkills.length > 0) {
        weaknesses.push({
            type: "Missing Skills",
            details: missingSkills
        });
    }

    // Check Low Relevance
    if (jdKeywords.length > 0) {
        const missingRatio = missingSkills.length / jdKeywords.length;
        if (missingRatio > 0.5) {
            weaknesses.push({
                type: "Low Relevance",
                details: ["Resume misses more than 50% of the job description keywords."]
            });
        }
    }

    // Check No Metrics
    // Detect if resume has NO numbers (% or digits)
    const hasNumbers = /\d/.test(resumeText);
    const hasPercentages = /%/.test(resumeText);
    
    if (!hasNumbers && !hasPercentages) {
        weaknesses.push({
            type: "No Metrics",
            details: ["No quantifiable achievements found (e.g. percentages or digits)."]
        });
    }

    return weaknesses;
}

module.exports = checkWeaknesses;
