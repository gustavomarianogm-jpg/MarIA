#!/bin/bash
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

echo "Entering frontend directory..."
if cd frontend; then
  echo "Installing frontend dependencies..."
  npm install
  echo "Building frontend..."
  npm run build
else
  echo "FAILED to cd into frontend. Directory does not exist?"
  exit 1
fi
