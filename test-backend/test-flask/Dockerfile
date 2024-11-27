# Python 베이스 이미지 사용
FROM python:3.10-slim

# 필수 패키지 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    vim \
    apt-utils \
    build-essential \
    gcc \
    python3-dev \
    libffi-dev \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Flask 애플리케이션 파일 저장 경로
WORKDIR /admin_server
COPY . /admin_server

# Python 패키지 설치
WORKDIR /admin_server
RUN pip install --upgrade pip && \
    pip install -r requirements-dev.txt

# Flask 서버 포트 노출
EXPOSE 8080

# Flask 애플리케이션 실행
CMD ["python3", "app.py", "--host=0.0.0.0", "--port=8080"]
