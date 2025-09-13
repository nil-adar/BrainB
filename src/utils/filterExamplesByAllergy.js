"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterExamplesByAllergy = filterExamplesByAllergy;
function filterExamplesByAllergy(example, allergyList) {
    if (!example)
        return { filtered: [], matches: [] };
    const allergyTerms = allergyList.map((a) => a.toLowerCase().trim());
    // אם זה כבר מערך → סנן כל רכיב
    if (Array.isArray(example)) {
        const filtered = [];
        const matches = [];
        for (const item of example) {
            const normalized = item.toLowerCase();
            const isMatch = allergyTerms.some((term) => normalized.includes(term));
            if (isMatch) {
                matches.push(item);
            }
            else {
                filtered.push(item);
            }
        }
        return { filtered, matches };
    }
    // אחרת → זו מחרוזת אחת ארוכה, אז נחלק לפי פסיקים
    const parts = example.split(/[,;]/).map((p) => p.trim());
    const filtered = [];
    const matches = [];
    for (const part of parts) {
        const normalized = part.toLowerCase();
        const isMatch = allergyTerms.some((term) => normalized.includes(term));
        if (isMatch) {
            matches.push(part);
        }
        else {
            filtered.push(part);
        }
    }
    return { filtered, matches };
}
