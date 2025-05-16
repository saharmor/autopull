#!/bin/bash

# Load environment variables from .env-github-oauth file
if [ -f ".env-github-oauth" ]; then
    echo "Loading environment variables from .env-github-oauth..."
    export $(grep -v '^#' .env-github-oauth | xargs)
fi

# Check if Python virtual environment exists, if not create it
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install backend requirements
echo "Installing backend requirements..."
pip install -r backend/requirements.txt

# Install frontend dependencies if package-lock.json doesn't exist
if [ ! -f "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Run backend and frontend concurrently
echo "Starting backend and frontend..."
(cd backend && python run.py) & 
(cd frontend && npm run dev) &

# Wait for both processes
wait 