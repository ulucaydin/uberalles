#!/bin/bash
set -e

echo "Starting Celery"
sudo -u celery_user celery -A tasks worker -B 
