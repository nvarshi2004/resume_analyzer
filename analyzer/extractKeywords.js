function extractKeywords(text) {
    if (!text) return [];

    // Stopwords list
    const stopwords = new Set(['the', 'and', 'is', 'in', 'to', 'of', 'a', 'for', 'on', 'with', 'as', 'by', 'an', 'at', 'or', 'this', 'that', 'from', 'be', 'it', 'are', 'your', 'you', 'we', 'our', 'will', 'can']);

    // Convert text to lowercase
    let lowerText = text.toLowerCase();

    // Remove special characters, keep only alphanumeric and spaces
    lowerText = lowerText.replace(/[^a-z0-9\s]/g, ' ');

    // Split into words
    const words = lowerText.split(/\s+/).filter(word => word.trim() !== '');

    // Filter out stopwords
    const filteredWords = words.filter(word => !stopwords.has(word));

    // Return unique keywords
    return [...new Set(filteredWords)];
}

module.exports = extractKeywords;
