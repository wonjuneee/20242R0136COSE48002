#!/bin/bash
export DEBIAN_FRONTEND=noninteractive

# register-model 서비스 파일 등록
sudo tee /etc/systemd/system/register-model.service > /dev/null <<EOL
[Unit]
Description=Check Latest Model From S3 and Upload to MLflow
After=network.target

[Service]
Type=oneshot
User=ubuntu
ExecStart=/home/ubuntu/deeplant-admin/venv/bin/python3.10 /home/ubuntu/deeplant-admin/register-model.py >> /home/ubuntu/deeplant-admin/log/register-model.log 2>&1
WorkingDirectory=/home/ubuntu/deeplant-admin

[Install]
WantedBy=multi-user.target
EOL

# register-model 타이머 서비스 파일 등록
sudo tee /etc/systemd/system/register-model.timer > /dev/null <<EOL
[Unit]
Description=Run Check Latest Model From S3 and Upload to MLflow Daily

[Timer]
OnCalendar=*-*-* 12:00:00
Persistent=true

[Install]
WantedBy=timers.target
EOL

# 서비스 파일 리로드 및 시작
sudo systemctl daemon-reload
sudo systemctl start register-model.timer
sudo systemctl enable register-model.timer
