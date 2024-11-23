from dotenv import load_dotenv
import mlflow
import mlflow.pytorch
import boto3
import os
import torch

load_dotenv()  

def register_model_from_s3(s3_bucket, model_name):
    try:
        # AWS S3 클라이언트 설정
        s3_client = boto3.client("s3", region_name=os.getnev('S3_REGION_NAME'))

        # S3에서 가장 최근에 업로드된 모델 파일 가져오기
        response = s3_client.list_objects_v2(Bucket=s3_bucket, Prefix=os.getenv('S3_MODEL_PREFIX'))

        if "Contents" not in response:
            raise FileNotFoundError(f"No models found in S3 bucket '{s3_bucket}' with prefix '{os.getenv('S3_MODEL_PREFIX')}'")

        # 파일 목록 정렬 (업로드 시각 기준으로 가장 최근 파일 찾기)
        files = sorted(response["Contents"], key=lambda x: x["LastModified"], reverse=True)
        latest_file = files[0]["Key"]

        # 로컬로 모델 파일 다운로드
        local_model_path = os.path.join("/tmp", os.path.basename(latest_file))
        s3_client.download_file(s3_bucket, latest_file, local_model_path)

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
        print(f"Error in registering or loading model: {e}")
        return None
