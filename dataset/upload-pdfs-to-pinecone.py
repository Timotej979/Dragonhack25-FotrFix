import os
import uuid
import time
import datetime
from elasticsearch import Elasticsearch
from PyPDF2 import PdfReader
from dotenv import load_dotenv
import tiktoken
from tenacity import retry, stop_after_attempt, wait_exponential

# Load .env file
load_dotenv()

# ========== CONFIG ==========
PDF_DIR = "./documents"
ELASTICSEARCH_HOST = os.getenv("ELASTICSEARCH_HOST")
ELASTICSEARCH_API_KEY = os.getenv("ELASTICSEARCH_API_KEY")
ELASTICSEARCH_INDEX_NAME = "diy"
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", 100))  
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", 0))
BATCH_SIZE = 3  
REQUEST_DELAY = 60  
MAX_RPM = 3  
last_request_time = datetime.datetime.now()  
# ============================

# Initialize Elasticsearch client
client = Elasticsearch([ELASTICSEARCH_HOST], api_key=ELASTICSEARCH_API_KEY)
tokenizer = tiktoken.get_encoding("cl100k_base")

def extract_text_from_pdf(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for i, page in enumerate(reader.pages):
            try:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
                else:
                    print(f"Warning: Page {i+1} in {pdf_path} is empty or cannot be extracted.")
            except Exception as e:
                print(f"Error extracting text from page {i+1} in {pdf_path}: {e}")
                continue  # Skip this page and move on to the next
        return text
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")
        return None

def chunk_text(text):
    tokens = tokenizer.encode(text)
    return [tokenizer.decode(tokens[i:i + CHUNK_SIZE - CHUNK_OVERLAP]) for i in range(0, len(tokens), CHUNK_SIZE - CHUNK_OVERLAP)]

def wait_for_rate_limit():
    global last_request_time
    elapsed_time = (datetime.datetime.now() - last_request_time).seconds
    if elapsed_time < 20:
        wait_time = 20 - elapsed_time
        print(f"Waiting {wait_time}s to respect rate limit...")
        time.sleep(wait_time)
    last_request_time = datetime.datetime.now()

@retry(stop=stop_after_attempt(5), wait=wait_exponential(min=1, max=60))
def insert_into_elasticsearch(chunks, metadata_base, start_idx=0):
    try:
        batch = chunks[start_idx:start_idx + BATCH_SIZE]
        operations = [{
            "index": {
                "_index": ELASTICSEARCH_INDEX_NAME,
                "_id": str(uuid.uuid4()),  # Unique ID for the record
                "_source": {
                    "chunk_text": chunk,  # Ensure chunk_text is a string
                    "metadata": {**metadata_base, "chunk_index": start_idx + i},
                    "_extract_binary_content": True,
                    "_reduce_whitespace": True,
                    "_run_ml_inference": True
                }
            }
        } for i, chunk in enumerate(batch)]
        
        # Bulk insert operation
        response = client.bulk(body=operations)
        if response["errors"]:
            print(f"Bulk insert error: {response}")
        else:
            print(f"Inserted {len(operations)} documents into Elasticsearch.")
        wait_for_rate_limit()
        return len(batch)
    except Exception as e:
        print(f"Insert error: {e}")
        return 0

def main():
    for filename in os.listdir(PDF_DIR):
        if filename.endswith(".pdf"):
            filepath = os.path.join(PDF_DIR, filename)
            print(f"Processing {filename}")
            text = extract_text_from_pdf(filepath)
            if text:
                chunks = chunk_text(text)
                total_chunks = len(chunks)
                for last_idx in range(0, total_chunks, BATCH_SIZE):
                    if insert_into_elasticsearch(chunks, {"filename": filename}, last_idx) == 0:
                        continue  # Retry if insert fails

if __name__ == "__main__":
    main()
