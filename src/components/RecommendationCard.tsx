import { Card, CardContent } from "@/components/ui/card";
import { Recommendation } from "@/types/recommendation";

interface RecommendationCardProps {
  number: number;
  rec: Recommendation;
  lang: "he" | "en";
}


const RecommendationCard = ({ number, rec, lang }: RecommendationCardProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 p-6">
        <h2 className="text-xl font-semibold">
          {lang === "he" ? `המלצה מס' ${number}` : `Recommendation #${number}`}
        </h2>

        <div>
          <h3 className="font-medium text-muted-foreground">
            {lang === "he" ? "תיאור קושי:" : "Difficulty:"}
          </h3>
          <p className="bg-red-100 p-2 rounded">
            {rec.difficulty_description[lang]}
          </p>
        </div>

        <div>
          <h3 className="font-medium text-muted-foreground">
            {lang === "he" ? "המלצה:" : "Recommendation:"}
          </h3>
          <p className="bg-green-100 p-2 rounded">{rec.recommendation[lang]}</p>
        </div>

        <div>
          <h3 className="font-medium text-muted-foreground">
            {lang === "he" ? "דוגמה ליישום:" : "Example:"}
          </h3>
          <p className="bg-blue-50 p-2 rounded">{rec.example[lang]}</p>
        </div>

        <div>
          <h3 className="font-medium text-muted-foreground">
            {lang === "he" ? "תרומה אפשרית:" : "Contribution:"}
          </h3>
          <p className="bg-gray-100 p-2 rounded">{rec.contribution[lang]}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {rec.difficulty_tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 text-sm px-2 py-1 rounded-full text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
