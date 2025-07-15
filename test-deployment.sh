#!/bin/bash

# Pre-deployment Testing Script for Calculator FhyTS

echo "🧮 Calculator FhyTS - Pre-deployment Testing"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# 1. Check Node.js version
print_info "Checking Node.js version..."
node_version=$(node -v)
echo "Node.js version: $node_version"

# 2. Install dependencies
print_info "Installing dependencies..."
npm install
print_status $? "Dependencies installed"

# 3. TypeScript compilation
print_info "Compiling TypeScript..."
npx tsc --noEmit
print_status $? "TypeScript compilation successful"

# 4. Build project
print_info "Building project..."
npm run build
print_status $? "Project build successful"

# 5. Check if dist folder exists and has files
print_info "Checking build output..."
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    print_status 0 "Build output directory exists and contains files"
else
    print_status 1 "Build output directory missing or empty"
fi

# 6. Check required files for Vercel
print_info "Checking Vercel configuration..."
required_files=("vercel.json" "package.json" "tsconfig.json")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$file exists"
    else
        print_status 1 "$file missing"
    fi
done

# 7. Validate package.json
print_info "Validating package.json..."
if node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" 2>/dev/null; then
    print_status 0 "package.json is valid JSON"
else
    print_status 1 "package.json is invalid JSON"
fi

# 8. Check if all dependencies are in dependencies (not devDependencies)
print_info "Checking production dependencies..."
required_deps=("typescript" "fhyts" "ejs" "@types/node")
for dep in "${required_deps[@]}"; do
    if npm list --depth=0 "$dep" >/dev/null 2>&1; then
        print_status 0 "$dep is installed"
    else
        print_status 1 "$dep is missing"
    fi
done

# 9. Test basic API endpoints (if server is running)
print_info "Starting test server..."
npm start &
SERVER_PID=$!
sleep 5

# Test if server responds
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    print_status 0 "Server responding on port 3000"
    
    # Test API endpoints
    api_endpoints=("/api/calculate" "/api/history" "/calculator")
    for endpoint in "${api_endpoints[@]}"; do
        if [ "$endpoint" = "/api/calculate" ]; then
            # Test POST endpoint
            response=$(curl -s -X POST http://localhost:3000$endpoint \
                -H "Content-Type: application/json" \
                -d '{"expression":"2+2"}' \
                -w "%{http_code}")
            if [[ $response == *"200"* ]]; then
                print_status 0 "API endpoint $endpoint working"
            else
                print_status 1 "API endpoint $endpoint failed"
            fi
        else
            # Test GET endpoints
            if curl -f http://localhost:3000$endpoint >/dev/null 2>&1; then
                print_status 0 "Route $endpoint accessible"
            else
                print_status 1 "Route $endpoint failed"
            fi
        fi
    done
else
    print_status 1 "Server not responding"
fi

# Cleanup
kill $SERVER_PID 2>/dev/null

echo ""
echo -e "${GREEN}🎉 Pre-deployment testing completed successfully!${NC}"
echo ""
echo "Ready for Vercel deployment:"
echo "1. Push to GitHub repository"
echo "2. Connect repository to Vercel"
echo "3. Deploy automatically"
echo ""
echo "Or deploy via CLI:"
echo "vercel --prod"
