import React from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { generatePDF } from "../utils/pdfGenerator";

interface Recommendation {
  id: string;
  diagnosisType: string;
  category: string;
  difficulty: string;
  recommendation: string;
  example: string;
  contribution: string;
  difficultyTags: string[];
}

interface PDFDownloadButtonProps {
  recommendations: Recommendation[];
  searchTerm?: string;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  recommendations,
  searchTerm = "",
}) => {
  const handleDownloadPDF = () => {
    const pdf = generatePDF(recommendations, searchTerm);
    const filename = searchTerm
      ? `nutritional-recommendations-${searchTerm.replace(/\s+/g, "-")}.pdf`
      : "nutritional-recommendations-guide.pdf";
    pdf.save(filename);
  };

  return (
    <Button onClick={handleDownloadPDF} variant="outline" size="sm">
      <DownloadIcon className="w-4 h-4 mr-2" />
      Download PDF
    </Button>
  );
};

export default PDFDownloadButton;
