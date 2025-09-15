/* eslint-disable @typescript-eslint/no-explicit-any */
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "./MyDocument";
import { Recommendation } from "@/types/recommendation";
import { useState, useRef, useMemo } from "react";
import { useSettings } from "@/components/SettingsContext";
import {
  Search,
  Download,
  Printer,
  X,
  Menu,
  Users,
  BookOpen,
  Activity,
} from "lucide-react";
import { translateDiagnosisType } from "@/utils/translateDiagnosisType";

type Lang = "he" | "en";

/** לוקח ערך שיכול להיות: string | {he:string|array, en:string|array} | null
 *  ומחזיר טקסט בשפה המבוקשת עם fallback לשפה השנייה.
 */
function getLangText(val: unknown, lang: Lang): string {
  const toStr = (v: unknown): string => {
    if (v == null) return "";
    if (Array.isArray(v))
      return v
        .map((x) => (typeof x === "string" ? x : ""))
        .join(", ")
        .trim();
    return typeof v === "string" ? v.trim() : "";
  };

  if (val == null) return "";
  if (typeof val === "string") return val.trim();

  if (typeof val === "object") {
    const obj = val as Record<string, unknown>;
    const primary = toStr(obj[lang]);
    if (primary) return primary;
    // fallback
    const otherKey = lang === "he" ? "en" : "he";
    return toStr(obj[otherKey]);
  }

  return "";
}
const normalizeField = (val: unknown): { he: string; en: string } => {
  const toStr = (v: unknown): string =>
    Array.isArray(v)
      ? v
          .map((x) => (typeof x === "string" ? x : ""))
          .join(", ")
          .trim()
      : typeof v === "string"
      ? v.trim()
      : "";

  if (val == null) return { he: "", en: "" };
  if (typeof val === "string" || Array.isArray(val)) {
    const s = toStr(val);
    return { he: s, en: s };
  }
  if (typeof val === "object") {
    // משלים חוסרים מתוך השפה השנייה
    return {
      he: getLangText(val, "he"),
      en: getLangText(val, "en"),
    };
  }
  return { he: "", en: "" };
};

const translateField = (val: unknown, targetLang: Lang): string => {
  const text = getLangText(val, targetLang);

  if (text) {
    const translated = translateDiagnosisType(text, targetLang);
    return translated;
  }

  return text;
};

interface Props {
  recommendations: Recommendation[];
  //language: "he" | "en";
  isLoading?: boolean; // הוספה חדשה
}

const RecommendationPdfView = ({
  recommendations,
  isLoading = false,
}: Props) => {
  const { language } = useSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isToolbarOpen, setIsToolbarOpen] = useState(true);
  const [filteredData, setFilteredData] = useState<Recommendation[]>([]);
  const pdfViewerRef = useRef<HTMLDivElement>(null);

  console.log("📄 RecommendationPdfView loaded");
  console.log("🔍 Raw recs for PDF:", recommendations);
  console.log("🔍 Total recommendations received:", recommendations.length);

  const createTranslatedField = (
    value: string
  ): { he: string; en: string } => ({
    he: value,
    en: value,
  });

  const cleanedRecommendations = useMemo(() => {
    return recommendations.filter(Boolean).map((r) => ({
      ...r,
      recommendation: normalizeField(r.recommendation),
      example: normalizeField(r.example),
      diagnosis_type: normalizeField(r.diagnosis_type),
      contribution: normalizeField(r.contribution),
      difficulty_description: normalizeField(r.difficulty_description),
    }));
  }, [recommendations]);

  console.log(
    "🧹 After cleaning:",
    cleanedRecommendations.length,
    "recommendations"
  );

  const baseFilteredRecommendations = useMemo(() => {
    return cleanedRecommendations.filter((r) => {
      const recText = getLangText(r?.recommendation, language as Lang);
      return Boolean(r && recText);
    });
  }, [cleanedRecommendations, language]);

  // וברינדור:
  const safeCategory = (r: any) =>
    (typeof r?.category === "string" && r.category.trim()) || "Uncategorized";

  // החלת חיפוש על הנתונים
  const finalRecommendations =
    filteredData.length > 0 ? filteredData : baseFilteredRecommendations;

  const keySig = useMemo(() => {
    const ids = (finalRecommendations || [])
      .map((r: any) => r?._id ?? r?.id ?? "")
      .join("|");
    return `${language}-${finalRecommendations.length}-${ids}`;
  }, [language, finalRecommendations]);

  console.log(
    "🧾 PDF recs count after filtering:",
    finalRecommendations.length
  );
  console.log("📋 First filtered rec:", finalRecommendations[0]);

  // פונקציות לכפתורים
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredData([]);
      return;
    }

    setIsSearching(true);

    const searchResults = baseFilteredRecommendations.filter((rec) => {
      const has = (val: any) =>
        getLangText(val, language as Lang)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return (
        has(rec.recommendation) ||
        has(rec.example) ||
        has(rec.contribution) ||
        has(rec.difficulty_description) ||
        has(rec.diagnosis_type)
      );
    });

    setFilteredData(searchResults);
    setIsSearching(false);

    if (searchResults.length === 0) {
      alert(
        language === "he"
          ? `לא נמצאו תוצאות עבור: "${searchTerm}"`
          : `No results found for: "${searchTerm}"`
      );
    } else {
      alert(
        language === "he"
          ? `נמצאו ${searchResults.length} תוצאות עבור: "${searchTerm}"`
          : `Found ${searchResults.length} results for: "${searchTerm}"`
      );
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredData([]);
  };

  const handlePrint = () => {
    if (pdfViewerRef.current) {
      const iframe = pdfViewerRef.current.querySelector("iframe");
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.print();
      } else {
        window.print();
      }
    }
  };

  // קבלת שם קובץ לפי שפה
  const getFileName = () => {
    const date = new Date().toISOString().split("T")[0];
    const suffix =
      filteredData.length > 0 ? `-search-${searchTerm.slice(0, 10)}` : "";
    return language === "he"
      ? `המלצות-תזונתיות-${date}${suffix}.pdf`
      : `nutritional-recommendations-${date}${suffix}.pdf`;
  };

  // אם אנחנו עדיין בטעינה, הצג loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === "he"
              ? "טוען המלצות..."
              : "Loading recommendations..."}
          </p>
        </div>
      </div>
    );
  }

  // אם אין המלצות כלל (אחרי שסיימנו לטעון), הצג הודעה ידידותית
  if (!finalRecommendations.length && !searchTerm) {
    return (
      <div className="p-5 border border-red-500 rounded-lg bg-red-50">
        <div className="text-lg font-bold text-red-700 mb-3">
          ⚠️ No valid recommendations to display.
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <div>
            <strong>Debug info:</strong>
          </div>
          <div>• Raw recommendations received: {recommendations.length}</div>
          <div>• After cleaning: {cleanedRecommendations.length}</div>
          <div>• After filtering: {baseFilteredRecommendations.length}</div>
          <div>• Language: {language}</div>
          <div>Check browser console for detailed analysis.</div>
        </div>

        {/* הצג דוגמה של המלצה ראשונה לדיבאג */}
        {recommendations.length > 0 && (
          <details className="mt-3 text-xs">
            <summary className="cursor-pointer">
              Show first recommendation structure
            </summary>
            <pre className="bg-gray-100 p-3 mt-2 overflow-auto rounded">
              {JSON.stringify(recommendations[0], null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col w-full"
      style={{ minHeight: "90vh", height: "calc(100vh - 100px)" }}
    >
      {/* Mobile Toolbar Toggle */}
      <div className="lg:hidden flex items-center justify-between p-2 bg-gray-100 border-b">
        <button
          onClick={() => setIsToolbarOpen(!isToolbarOpen)}
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          {isToolbarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
        <span className="text-sm font-medium">
          {language === "he" ? "כלי עבודה" : "Tools"}
        </span>
      </div>

      {/* Toolbar */}
      <div
        className={`${
          isToolbarOpen ? "block" : "hidden lg:block"
        } w-full bg-gray-50 border-b border-gray-200`}
      >
        <div className="p-2 lg:p-4">
          {/* Search Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={
                    language === "he" ? "חיפוש בטקסט..." : "Search in text..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  dir={language === "he" ? "rtl" : "ltr"}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title={language === "he" ? "נקה חיפוש" : "Clear search"}
                    aria-label={
                      language === "he" ? "נקה חיפוש" : "Clear search"
                    }
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  disabled={!searchTerm.trim() || isSearching}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm whitespace-nowrap"
                >
                  <Search className="h-4 w-4" />
                  {isSearching
                    ? language === "he"
                      ? "מחפש..."
                      : "Searching..."
                    : language === "he"
                    ? "חיפוש"
                    : "Search"}
                </button>

                {filteredData.length > 0 && (
                  <button
                    onClick={clearSearch}
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 text-sm whitespace-nowrap"
                  >
                    <X className="h-4 w-4" />
                    {language === "he" ? "נקה" : "Clear"}
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <PDFDownloadLink
                document={
                  <MyDocument
                    key={keySig}
                    recommendations={finalRecommendations}
                    lang={language}
                  />
                }
                fileName={getFileName()}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 no-underline text-sm whitespace-nowrap"
              >
                {({ loading }) => (
                  <>
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {loading
                        ? language === "he"
                          ? "מכין..."
                          : "Preparing..."
                        : language === "he"
                        ? "הורד"
                        : "Download"}
                    </span>
                    <span className="sm:hidden">
                      {loading ? "..." : language === "he" ? "הורד" : "PDF"}
                    </span>
                  </>
                )}
              </PDFDownloadLink>

              <button
                onClick={handlePrint}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 text-sm whitespace-nowrap"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {language === "he" ? "הדפס" : "Print"}
                </span>
              </button>
            </div>
          </div>

          {/* Search Results Info */}
          {filteredData.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              {language === "he"
                ? `מציג ${filteredData.length} תוצאות מתוך ${baseFilteredRecommendations.length} המלצות`
                : `Showing ${filteredData.length} results out of ${baseFilteredRecommendations.length} recommendations`}
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer Container */}
      <div
        className="flex-1 w-full"
        style={{ minHeight: "80vh", height: "calc(100vh - 200px)" }}
      >
        <div ref={pdfViewerRef} className="w-full h-full">
          <PDFViewer
            width="100%"
            height="100%"
            style={{
              border: "none",
              minHeight: "80vh",
            }}
            showToolbar={true}
          >
            <MyDocument
              key={keySig}
              recommendations={finalRecommendations}
              lang={language}
            />
          </PDFViewer>
        </div>
      </div>

      {/* Target Audience Footer */}
      <div className="bg-white rounded-lg p-4 shadow-sm border mt-4">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div
            className="flex items-center"
            dir={language === "he" ? "rtl" : "ltr"}
          >
            <Users className="h-4 w-4 ml-2" />
            <span>{language === "he" ? "להורים" : "For Parents"}</span>
          </div>
          <div
            className="flex items-center"
            dir={language === "he" ? "rtl" : "ltr"}
          >
            <BookOpen className="h-4 w-4 ml-2" />
            <span>{language === "he" ? "למורים" : "For Teachers"}</span>
          </div>
          <div
            className="flex items-center"
            dir={language === "he" ? "rtl" : "ltr"}
          >
            <Activity className="h-4 w-4 ml-2" />
            <span>{language === "he" ? "לילדים" : "For Children"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPdfView;
