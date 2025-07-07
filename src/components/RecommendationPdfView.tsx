import { PDFViewer } from "@react-pdf/renderer";
import MyDocument from "./MyDocument"; // משתמשים בזה בלבד
import { Recommendation } from "@/types/recommendation";

/*interface Props {
  recommendations: Recommendation[];
  lang: "he" | "en";
}*/

const RecommendationPdfView = ({ recommendations, lang }: Props) => {
  return (
    <div style={{ height: "700px" }}>
      <PDFViewer width="100%" height="100%">
        <MyDocument
          recommendations={recommendations.filter(
            (r) => r && r.category && r.recommendation
          )}
          lang={lang}
        />
      </PDFViewer>
    </div>
  );
};

export default RecommendationPdfView;
