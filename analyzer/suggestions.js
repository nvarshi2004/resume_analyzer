function getSuggestions(weaknesses) {
    const suggestions = new Set();

    for (const weakness of weaknesses) {
        if (weakness.type === "Missing Skills") {
            suggestions.add("Add relevant projects or skills");
        }
        if (weakness.type === "No Metrics") {
            suggestions.add("Add quantified achievements");
        }
        if (weakness.type === "Low Relevance") {
            suggestions.add("Customize resume for job description");
        }
    }

    return Array.from(suggestions);
}

module.exports = getSuggestions;
