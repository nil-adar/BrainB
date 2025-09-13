"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateDiagnosisType = void 0;
const translateDiagnosisType = (type, lang) => {
    const map = {
        Combined: { he: "משולב", en: "Combined" },
        Hyperactivity: { he: "היפראקטיביות", en: "Hyperactivity" },
        Inattentive: { he: "קשב", en: "Inattentive" },
        Impulsivity: { he: "אימפולסיביות", en: "Impulsivity" },
    };
    return map[type]?.[lang] ?? type;
};
exports.translateDiagnosisType = translateDiagnosisType;
