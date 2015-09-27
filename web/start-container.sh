#!/bin/bash
set -e

echo "Starting Celery"
gunicorn app:app -b 0.0.0.0:5000
