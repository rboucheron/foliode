#!/usr/bin/env bash

echo "Deploy frontend"

cd ../../frontend/website
vercel --prod

echo "Deploy backend"

cd ../../backend
vercel --prod
