// lib/ai/vector/query.ts
import { pineconeIndex } from './pinecone';
import { embedTextWithGemini } from './embed';

export async function queryRelevantDocs(query: string, topK: number = 5): Promise<string[]> {
  const queryEmbedding = await embedTextWithGemini(query);

  const queryResult = await pineconeIndex.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
  });

  return queryResult.matches?.map(match => match.metadata?.text) ?? [];
}
