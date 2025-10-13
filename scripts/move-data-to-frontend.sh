#!/bin/bash

# Script to move processed Uma Musume data files to frontend assets
# Moves chara-names-with-id.json, affinity-mapping.json, and affinity-combined.json
# from ./data/home to ./frontend/src/assets/home

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Uma Musume Data Mover${NC}"
echo "================================================"

# Check if we're in the project root
if [[ ! -f "package.json" ]]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Check if source directory exists
if [[ ! -d "./data/home" ]]; then
    echo -e "${RED}Error: ./data/home directory not found${NC}"
    exit 1
fi

# Create destination directory if it doesn't exist
mkdir -p ./frontend/src/assets/home

echo -e "${YELLOW}Moving processed data files to frontend assets...${NC}"

# Move chara-names-with-id.json
if [[ -f "./data/home/chara-names-with-id.json" ]]; then
    cp ./data/home/chara-names-with-id.json ./frontend/src/assets/home/
    echo "Moved chara-names-with-id.json"
else
    echo -e "${YELLOW}Warning: chara-names-with-id.json not found in ./data/home${NC}"
fi

# Move affinity-mapping.json
if [[ -f "./data/home/affinity-mapping.json" ]]; then
    cp ./data/home/affinity-mapping.json ./frontend/src/assets/home/
    echo "Moved affinity-mapping.json"
else
    echo -e "${YELLOW}Warning: affinity-mapping.json not found in ./data/home${NC}"
fi

# Move affinity-combined.json
if [[ -f "./data/home/affinity-combined.json" ]]; then
    cp ./data/home/affinity-combined.json ./frontend/src/assets/home/
    echo "Moved affinity-combined.json"
else
    echo -e "${YELLOW}Warning: affinity-combined.json not found in ./data/home${NC}"
fi

# Move character images directory
if [[ -d "./data/home/images/characters" ]]; then
  mkdir -p ./frontend/src/assets/home/images/characters
  cp -rn ./data/home/images/characters/* ./frontend/src/assets/home/images/characters/
  echo "Moved character images to frontend assets"
else
  echo -e "${YELLOW}Warning: ./data/home/images/characters directory not found${NC}"
fi

echo -e "${GREEN}File movement completed successfully!${NC}"
echo "================================================"
echo "Files moved to ./frontend/src/assets/home/:"
echo "- chara-names-with-id.json"
echo "- affinity-mapping.json" 
echo "- affinity-combined.json"
echo -e "${GREEN}Frontend assets updated!${NC}"