import os
import time
from dotenv import load_dotenv
import PyPDF2
import pinecone
from google import genai
from pinecone import Pinecone, ServerlessSpec
from google.genai.errors import ClientError

# Load environment variables from .env file
load_dotenv()

# Environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Initialize the Google Gemini API client with the API key from environment variables
client = genai.Client(api_key=GEMINI_API_KEY)
pc = Pinecone(api_key=PINECONE_API_KEY)

# Create or connect to an existing Pinecone index (ensure the index exists)
index_name = "diy-pdf-embeddings"  # You can change the name if needed

# Check if the index exists, if not, create a new one
if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=768,  # Adjust dimension based on your embeddings
        metric="cosine",  # Use cosine similarity (or change to "euclidean" if preferred)
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        ),
    )

# Connect to the index
index = pc.Index(index_name)

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text

# Function to split text into chunks
def split_text_into_chunks(text, chunk_size=1000):
    # Split the text into chunks of approximately 'chunk_size' characters
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end])
        start = end
    return chunks

# Function to generate embedding using the Gemini API
def generate_embedding(text):
    attempt = 0
    max_retries = 5  # Retry attempts
    backoff_factor = 2  # Exponential backoff factor
    max_wait_time = 120  # Maximum wait time in seconds

    while attempt < max_retries:
        try:
            result = client.models.embed_content(
                model="text-embedding-004",
                contents=text
            )
            embeddings = result.embeddings
            if isinstance(embeddings, list) and hasattr(embeddings[0], 'values'):
                embeddings = embeddings[0].values
            embeddings = [float(val) for val in embeddings]
            return embeddings

        except ClientError as e:
            # Inspect the error and retry if it is a rate-limit error
            error_message = e.message if hasattr(e, 'message') else str(e)
            print(f"API Error: {error_message}")

            if "RESOURCE_EXHAUSTED" in error_message:  # Rate-limited
                print("Rate limit exceeded. Sleeping for a longer period before retrying...")
                wait_time = min(backoff_factor ** attempt, max_wait_time)  # Exponential backoff
                print(f"Waiting for {wait_time} seconds before retrying...")
                time.sleep(wait_time)
                attempt += 1
            else:
                # For other types of errors, we raise the exception
                raise e

    raise Exception(f"Maximum retries reached. Please check your quota or API limits. Last error: {error_message}")

# Function to upload embeddings to Pinecone
def upload_to_pinecone(pdf_filename, chunk_text, chunk_id):
    # Generate the embedding for the chunk
    embedding = generate_embedding(chunk_text)
    
    # Upload the embedding to Pinecone (index name, ids, embeddings)
    doc_id = f"{pdf_filename}_chunk_{chunk_id}"  # Use filename and chunk ID to create unique IDs
    index.upsert(
        vectors=[(doc_id, embedding)]
    )
    print(f"Uploaded embedding for {pdf_filename} chunk {chunk_id} to Pinecone.")

# Function to process all PDFs in a directory
def process_pdfs(directory):
    total_chunks = 0
    rate_limit_interval = 30  # Number of seconds between processing each chunk to avoid overloading API
    for filename in os.listdir(directory):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(directory, filename)
            print(f"Processing {pdf_path}")
            
            # Extract text from PDF
            text = extract_text_from_pdf(pdf_path)
            
            # Split the text into chunks
            chunks = split_text_into_chunks(text)
            
            # Upload embedding for each chunk
            for i, chunk_text in enumerate(chunks):
                upload_to_pinecone(filename, chunk_text, i)
                total_chunks += 1

                # Add a delay after each chunk
                print(f"Processed {total_chunks} chunks, sleeping for {rate_limit_interval} seconds.")
                time.sleep(rate_limit_interval)  # Control the rate of API calls

# Set the directory containing the PDFs
pdf_directory = "./documents"  # Replace with your actual directory

# Process all PDFs in the directory
process_pdfs(pdf_directory)
