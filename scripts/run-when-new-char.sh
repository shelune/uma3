#!/bin/bash

# Script to process Uma Musume data from master.db
# 1. Export SQLite data to JSON files
# 2. Move JSON files to data/wild directory
# 3. Run individual character data processors (chara-name-exporter, affinity-table-builder, affinity-calculator)

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Updating character names >>> Compile affinity table >>> Compile affinity mapping ${NC}"
echo "================================================"

# Check if we're in the project root
if [[ ! -f "package.json" ]]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Step 1: Check for master.db and export SQLite data
echo -e "${YELLOW}Step 1: Checking for master.db and exporting data...${NC}"
if [[ -f "./universal-assets/master.db" ]]; then
    echo "Found master.db, exporting data to JSON..."
    
    cd universal-assets
    
    # Export dress_data table
    echo "  Exporting dress_data..."
    sqlite3 -json master.db "SELECT * FROM dress_data;" > dress-data.json
    
    # Export succession_relation_member table
    echo "  Exporting succession_relation_member..."
    sqlite3 -json master.db "SELECT * FROM succession_relation_member;" > succession-relation-member.json
    
    # Export succession_relation table
    echo "  Exporting succession_relation..."
    sqlite3 -json master.db "SELECT * FROM succession_relation;" > succession-relation.json
    
    cd ..
    echo "SQLite export completed"
else
    echo -e "${RED}Error: master.db not found in ./universal-assets directory${NC}"
    echo "Please ensure master.db exists before running this script"
    exit 1
fi

# Step 2: Move JSON files to data/wild directory
echo -e "${YELLOW}Step 2: Moving JSON files to data/wild directory...${NC}"

# Create data/wild directory if it doesn't exist
mkdir -p ./data/wild

# Move JSON files
if [[ -f "./universal-assets/dress-data.json" ]]; then
    mv ./universal-assets/dress-data.json ./data/wild/
    echo "Moved dress-data.json"
fi

if [[ -f "./universal-assets/succession-relation-member.json" ]]; then
    mv ./universal-assets/succession-relation-member.json ./data/wild/
    echo "Moved succession-relation-member.json"
fi

if [[ -f "./universal-assets/succession-relation.json" ]]; then
    mv ./universal-assets/succession-relation.json ./data/wild/
    echo "Moved succession-relation.json"
fi

echo "File movement completed"

# Step 3: Run character data processors
echo -e "${YELLOW}Step 3: Running character data processors...${NC}"

cd data/processor

# Check if all required scripts exist
if [[ ! -f "chara-name-exporter.ts" ]]; then
    echo -e "${RED}Error: chara-name-exporter.ts not found in ./data/processor directory${NC}"
    exit 1
fi

if [[ ! -f "affinity-table-builder.ts" ]]; then
    echo -e "${RED}Error: affinity-table-builder.ts not found in ./data/processor directory${NC}"
    exit 1
fi

if [[ ! -f "affinity-calculator.ts" ]]; then
    echo -e "${RED}Error: affinity-calculator.ts not found in ./data/processor directory${NC}"
    exit 1
fi

# Run processors in sequence
echo "Step 3.1: Exporting character names..."
npx tsx chara-name-exporter.ts
if [[ $? -ne 0 ]]; then
    echo -e "${RED}Error: chara-name-exporter.ts failed${NC}"
    exit 1
fi

echo "Step 3.2: Building affinity table..."
npx tsx affinity-table-builder.ts
if [[ $? -ne 0 ]]; then
    echo -e "${RED}Error: affinity-table-builder.ts failed${NC}"
    exit 1
fi

echo "Step 3.3: Calculating affinity combinations..."
npx tsx affinity-calculator.ts
if [[ $? -ne 0 ]]; then
    echo -e "${RED}Error: affinity-calculator.ts failed${NC}"
    exit 1
fi

cd ../..

echo -e "${GREEN}All processing completed successfully!${NC}"
echo "================================================"
echo "Summary:"
echo "SQLite data exported from master.db"
echo "JSON files moved to ./data/wild/"
echo "Character names exported"
echo "Affinity table built"
echo "Affinity combinations calculated"
echo -e "${GREEN}Ready for frontend usage!${NC}"