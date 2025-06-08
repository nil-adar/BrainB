import pandas as pd
import os
from pymongo import MongoClient

# התחברות למונגו
MONGO_URI = "mongodb+srv://sandrakniznik:Mongodb31618@schoolsdata.yg5ih.mongodb.net/BrainB"
DB_NAME = "BrainB"
COLLECTION_NAME = "recommendations"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# ניקוי קודם (רשותי, אם רוצים לשמור ישנים אז לא למחוק)
collection.delete_many({})

# קבצים להעלאה (קובץ : סוג המלצה)
FILES = {
    "Recommendations spreadsheet - Nutrition Recommendations.csv": "nutrition",
    "Recommendations spreadsheet - Environmental Recommendations.csv": "environment",
    "Recommendations spreadsheet - physical activity Recommendations.csv": "physical_activity"
}

def clean_tags(tag_str):
    """ממיר מחרוזת תגיות למערך, גם אם זו תגית אחת"""
    if pd.isna(tag_str) or tag_str.strip() == "":
        return []
    return [tag.strip() for tag in tag_str.split(",")]

def load_recommendations(filename, recommendation_type):
    df = pd.read_csv(filename, encoding="utf-8")
    df.fillna('', inplace=True)

    count = 0
    for _, row in df.iterrows():
        # טיפול בדוגמה - אם היא מוגדרת כ-array, לפצל לפסיקים
        def format_example(lang):
            val = row.get(f"example_{lang}", "").strip()
            if row.get("example_is_array", "").strip().lower() == "array":
                return [item.strip() for item in val.split(",") if item.strip()]
            return val

        doc = {
            "type": recommendation_type,
            "difficulty_description": {
                "en": row.get("difficulty_description_en", "").strip(),
                "he": row.get("difficulty_description_he", "").strip()
            },
            "tags": clean_tags(row.get("difficulty_tags_en", "")),
            "recommendation": {
                "en": row.get("recommendation_en", "").strip(),
                "he": row.get("recommendation_he", "").strip()
            },
            "example": {
                "en": format_example("en"),
                "he": format_example("he")
            },
            "catagory": {
                "en": row.get("category_en", "").strip(),
                "he": row.get("category_he", "").strip()
            },
            "diagnosis_type": {
                "en": clean_tags(row.get("diagnosis_type_en", "")),
                "he": clean_tags(row.get("diagnosis_type_he", ""))
            },
            "contribution": {
                "en": row.get("contribution_en", "").strip(),
                "he": row.get("contribution_he", "").strip()
            }
        }
        collection.insert_one(doc)
        count += 1

    print(f"✅ הוזנו {count} המלצות מסוג '{recommendation_type}' לקולקציה ✔️")

# הרצת הטעינה על כל הקבצים
for file, rec_type in FILES.items():
    load_recommendations(file, rec_type)
