import mlflow
import mlflow.pyfunc
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# 1. Define the MLflow PythonModel wrapper
class DeepSeekR1Wrapper(mlflow.pyfunc.PythonModel):
    def __init__(self, model_name):
        self.model_name = model_name
        self.tokenizer = None
        self.model = None

    def load_context(self, context):
        """Load tokenizer and model from Hugging Face"""
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name, trust_remote_code=True)
        self.model = AutoModelForCausalLM.from_pretrained(self.model_name, trust_remote_code=True, torch_dtype=torch.float16)
        self.model.eval()

    def predict(self, context, model_input):
        """Generate response using DeepSeek-R1"""
        if isinstance(model_input, str):
            model_input = [model_input]

        inputs = self.tokenizer(model_input, return_tensors="pt", padding=True)
        with torch.no_grad():
            outputs = self.model.generate(
                input_ids=inputs["input_ids"],
                attention_mask=inputs["attention_mask"],
                max_new_tokens=200,
                do_sample=True,
                temperature=0.7,
                top_p=0.9
            )
        return [self.tokenizer.decode(output, skip_special_tokens=True) for output in outputs]


# 2. Save the model to MLflow
def save_model_to_mlflow(model_name, model_path):
    wrapper = DeepSeekR1Wrapper(model_name)
    with mlflow.start_run():
        mlflow.pyfunc.log_model(artifact_path=model_path, python_model=wrapper)


# 3. Load and test the saved model
def load_and_test_model(model_path):
    model = mlflow.pyfunc.load_model(model_uri=f"models:/{model_path}/1")
    input_text = "Describe the key differences between classical physics and quantum physics."
    response = model.predict(input_text)
    print("Generated Text:", response[0])


# 4. Run the script
if __name__ == "__main__":
    model_name = "deepseek-ai/DeepSeek-R1"
    model_path = "deepseek-r1-model"

    print("Logging DeepSeek-R1 model to MLflow...")
    save_model_to_mlflow(model_name, model_path)

    print("Loading and testing DeepSeek-R1 model...")
    load_and_test_model(model_path)
