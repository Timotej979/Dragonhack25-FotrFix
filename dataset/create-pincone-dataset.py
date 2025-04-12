import os
import re
import json
from sentence_transformers import SentenceTransformer  # Importing sentence-transformers
from langchain_community.document_loaders import PyPDFLoader  # Updated import
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

# Load environment from .env file
load_dotenv()

# Initialize the Hugging Face SentenceTransformer model
model = SentenceTransformer('all-MiniLM-L6-v2')  # Open-source model for embeddings

# Define a function to preprocess text
def preprocess_text(text):
    # Replace consecutive spaces, newlines, and tabs
    text = re.sub(r'\s+', ' ', text)
    return text

def process_pdf(file_path):
    # create a loader
    loader = PyPDFLoader(file_path)
    # load your data
    data = loader.load()
    # Split your data up into smaller documents with chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    documents = text_splitter.split_documents(data)
    # Convert Document objects into strings
    texts = [str(doc) for doc in documents]
    return texts

# Define a function to create embeddings using Hugging Face model
def create_embeddings(texts):
    # Use the Hugging Face SentenceTransformer model to create embeddings
    embeddings_list = model.encode(texts, convert_to_tensor=True)  # Directly generate embeddings
    return embeddings_list

# Define a function to create a dataset for uploading to Pinecone
def create_dataset(file_paths):
    dataset = []
    
    # Process each PDF document
    for file_path in file_paths:
        print(f"Processing file: {file_path}")
        
        texts = process_pdf(file_path)
        embeddings = create_embeddings(texts)

        # Create a list of dictionaries for the dataset
        for idx, (text, embedding) in enumerate(zip(texts, embeddings)):
            # Create a unique ID (e.g., based on the text index or file name)
            document_id = f"{os.path.basename(file_path)}_doc_{idx}"
            
            # Optional metadata (e.g., the text itself or source information)
            metadata = {
                "text": text[:200]  # Store the first 200 characters for a snippet (optional)
            }

            # Append to dataset
            dataset.append({
                "id": document_id,
                "embedding": embedding.tolist(),  # Convert tensor to list for JSON compatibility
                "metadata": metadata
            })

    # Save the dataset as a JSON file
    output_file = "pinecone_dataset.json"
    with open(output_file, 'w') as f:
        json.dump(dataset, f, indent=2)
    
    print(f"Dataset saved to {output_file}")
    return output_file

# Example usage with multiple PDF files
pdf_directory = "./documents"  # Specify the directory containing your PDFs
pdf_files = [os.path.join(pdf_directory, f) for f in os.listdir(pdf_directory) if f.endswith('.pdf')]

# Generate the dataset
dataset_file = create_dataset(pdf_files)