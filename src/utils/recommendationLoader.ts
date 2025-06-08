import { getMongoCollection } from "src/utils/mongoUtils";

export async function getAllRecommendations() {
  const collection = getMongoCollection("recommendations");
  return await collection.find({}).toArray();
}
//sandra