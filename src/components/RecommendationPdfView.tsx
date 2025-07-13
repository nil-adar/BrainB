import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "./MyDocument";
import { Recommendation } from "@/types/recommendation";
import { useState, useRef } from "react";
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

  // דיבאג מפורט לכל המלצה
  recommendations.forEach((r, index) => {
    console.log(`🔍 Rec ${index}:`, {
      hasR: !!r,
      hasCategory: !!r?.category,
      hasRecommendation: !!r?.recommendation,
      recType: typeof r?.recommendation,
      recKeys: r?.recommendation ? Object.keys(r.recommendation) : [],
      hasLangText: !!r?.recommendation?.[language],
      languageValue: r?.recommendation?.[language],
      fullRec: r,
    });
  });

  // פונקציה עזר ליצירת TranslatedField
  const createTranslatedField = (
    value: string
  ): { he: string; en: string } => ({
    he: language === "he" ? value : "",
    en: language === "en" ? value : "",
  });

  // נסה לתקן נתונים שבורים
  const cleanedRecommendations = recommendations
    .filter(Boolean) // הסר null/undefined
    .map((r, index) => {
      console.log(`🔧 Cleaning rec ${index}:`, r);

      // צור עותק של ההמלצה עם טיפוס מפורש
      const cleaned: Recommendation = { ...r };

      // תקן מבנה recommendation אם הוא לא אובייקט
      if (typeof r.recommendation === "string") {
        console.log(
          `🔧 Converting recommendation string to object for rec ${index}`
        );
        cleaned.recommendation = createTranslatedField(r.recommendation);
      }

      // תקן מבנה example אם הוא לא אובייקט
      if (typeof r.example === "string") {
        console.log(`🔧 Converting example string to object for rec ${index}`);
        cleaned.example = createTranslatedField(r.example);
      } else if (Array.isArray(r.example)) {
        // אם זה מערך, המר למחרוזת ואז לאובייקט
        console.log(`🔧 Converting example array to object for rec ${index}`);
        cleaned.example = createTranslatedField(r.example.join(", "));
      }

      // תקן מבנה diagnosis_type אם הוא לא אובייקט
      if (typeof r.diagnosis_type === "string") {
        console.log(
          `🔧 Converting diagnosis_type string to object for rec ${index}`
        );
        cleaned.diagnosis_type = createTranslatedField(r.diagnosis_type);
      }

      // תקן מבנה contribution אם הוא לא אובייקט
      if (typeof r.contribution === "string") {
        console.log(
          `🔧 Converting contribution string to object for rec ${index}`
        );
        cleaned.contribution = createTranslatedField(r.contribution);
      }

      // תקן מבנה difficulty_description אם הוא לא אובייקט
      if (typeof r.difficulty_description === "string") {
        console.log(
          `🔧 Converting difficulty_description string to object for rec ${index}`
        );
        cleaned.difficulty_description = createTranslatedField(
          r.difficulty_description
        );
      }

      console.log(`✅ Cleaned rec ${index}:`, cleaned);
      return cleaned;
    });

  console.log(
    "🧹 After cleaning:",
    cleanedRecommendations.length,
    "recommendations"
  );

  // סינון המלצות תקינות לפי שפה
  const baseFilteredRecommendations = cleanedRecommendations.filter(
    (r, index) => {
      // בדוק אם יש category או catagory (שגיאת כתיב בנתונים)
      const hasCategory = !!(
        r.category || (r as Recommendation & { catagory?: any }).catagory
      );
      const isValid =
        r &&
        hasCategory &&
        r.recommendation &&
        typeof r.recommendation === "object" &&
        r.recommendation[language]?.trim();

      console.log(`✅ Rec ${index} is valid:`, isValid, {
        hasCategory,
        categoryValue: r.category || (r as any).catagory,
        hasRecommendation: !!r.recommendation,
        isObject: typeof r.recommendation === "object",
        hasLangText: !!r.recommendation?.[language]?.trim(),
      });

      return isValid;
    }
  );

  // החלת חיפוש על הנתונים
  const finalRecommendations =
    filteredData.length > 0 ? filteredData : baseFilteredRecommendations;

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

    // חיפוש אמיתי בתוך הנתונים
    const searchResults = baseFilteredRecommendations.filter((rec) => {
      const searchInText = (text: any): boolean => {
        if (!text) return false;
        if (typeof text === "string") {
          return text.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (typeof text === "object" && text[language]) {
          const value = text[language];
          if (Array.isArray(value)) {
            return value.some((item) =>
              item.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchTerm.toLowerCase());
          }
        }
        return false;
      };

      return (
        searchInText(rec.recommendation) ||
        searchInText(rec.example) ||
        searchInText(rec.contribution) ||
        searchInText(rec.difficulty_description) ||
        searchInText(rec.diagnosis_type)
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
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
