from datetime import datetime
from dotenv import load_dotenv
import mlflow
import mlflow.pytorch
import boto3
import os
import torch

load_dotenv()

def register_model_from_s3(model_name):
    try:
        # 필수 환경 변수 확인
        s3_region_name = os.getenv('S3_REGION_NAME')
        s3_bucket_name = os.getenv('S3_BUCKET_NAME')
        s3_model_prefix = os.getenv('S3_MODEL_PREFIX')

        if not all([s3_region_name, s3_bucket_name, s3_model_prefix]):
            raise EnvironmentError("Missing required environment variables: S3_REGION_NAME, S3_BUCKET_NAME, or S3_MODEL_PREFIX")

        # AWS S3 클라이언트 설정
        s3_client = boto3.client("s3", region_name=s3_region_name)

        # S3에서 가장 최근에 업로드된 모델 파일 가져오기
        response = s3_client.list_objects_v2(Bucket=s3_bucket_name, Prefix=s3_model_prefix)

        if "Contents" not in response:
            raise FileNotFoundError(f"No models found in S3 bucket '{s3_bucket_name}' with prefix '{s3_model_prefix}'")

        # 파일 목록 정렬 (업로드 시각 기준으로 가장 최근 파일 찾기)
        files = sorted(response["Contents"], key=lambda x: x["LastModified"], reverse=True)
        latest_file = files[0]["Key"]

        # 로컬로 모델 파일 다운로드
        local_model_path = os.path.join("/tmp", os.path.basename(latest_file))
        print(f"Downloading '{latest_file}' to '{local_model_path}'...")
        s3_client.download_file(s3_bucket_name, latest_file, local_model_path)

        # MLflow에 모델 등록
        mlflow.set_tracking_uri("http://localhost:5000")

        with mlflow.start_run():
            mlflow.pytorch.log_model(
                pytorch_model=torch.load(local_model_path, map_location="cpu"),
                artifact_path="model",
                registered_model_name=model_name
            )
        
        return f"Model '{model_name}' registered successfully!"

    except Exception as e:
        print(f"Error while processing model '{model_name}': {str(e)}")
        return None

if __name__ == "__main__":
    # 시작 로그
    time = datetime.now()
    print(f"--------------- {time.strftime('%Y-%m-%d %H:%M:%S')} ---------------")
    print(f"Start Sync Model Versions with S3 and MLflow\n")

    # 모델 등록 루프
    model_names = ['regression', 'classification', 'segmentation']
    for model_name in model_names:
        print(f"Processing model: {model_name}")
        result = register_model_from_s3(model_name)
        if result:
            print(result)
        print("\n")

    # 종료 로그
    print("Model sync process completed!")
