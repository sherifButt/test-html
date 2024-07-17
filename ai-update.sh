#!/bin/bash
export OPENAI_API_KEY=your_openai_api_key
export GROQ_API_KEY=your_groq_api_key
node ai-update.js -type "html" -dir "test"
