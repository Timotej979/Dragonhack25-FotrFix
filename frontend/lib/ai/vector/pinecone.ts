// lib/ai/vector/pinecone.ts
import { Pinecone } from '@pinecone-database/pinecone';

export const pinecone = new Pinecone({
  environment: process.env.PINECONE_ENVIRONMENT,
  projectName: process.env.PINECONE_PROJECT_NAME,
});

export const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
