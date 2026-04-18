function matchScore(resumeKeywords, jdKeywords) {
    if (!jdKeywords || jdKeywords.length === 0) return 0;
    
    // Find how many JD keywords are in the resume keywords
    const resumeSet = new Set(resumeKeywords);
    
    let matched = 0;
    for (const keyword of jdKeywords) {
        if (resumeSet.has(keyword)) {
            matched++;
        }
    }
    
    const score = (matched / jdKeywords.length) * 100;
    return Math.round(score);
}

module.exports = matchScore;
