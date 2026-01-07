#!/bin/bash

# Orchard Management System Frontend Deployment Script

set -e  # Exit on any error

echo "🚀 Deploying Orchard Management System Frontend"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v)"
print_status "npm version: $(npm -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if npm install; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Create production environment file if it doesn't exist
if [ ! -f .env.production ]; then
    echo ""
    echo "📝 Creating production environment file..."
    cat > .env.production << EOF
# Production Environment Variables
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
EOF
    print_warning "Created .env.production - please update with your actual API URL"
fi

# Build the application
echo ""
echo "🔨 Building production application..."
if npm run build; then
    print_status "Production build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Check if build was successful
if [ ! -d "build" ]; then
    print_error "Build directory not found. Build may have failed."
    exit 1
fi

# Create deployment package
echo ""
echo "📦 Creating deployment package..."
DEPLOY_DIR="deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"
cp -r build/* "$DEPLOY_DIR/"
cp package.json "$DEPLOY_DIR/"
cp .env.production "$DEPLOY_DIR/"

# Create deployment info
cat > "$DEPLOY_DIR/DEPLOYMENT_INFO.txt" << EOF
Orchard Management System Frontend
Deployment Date: $(date)
Build Version: $(node -p "require('./package.json').version")
Node Version: $(node -v)
npm Version: $(npm -v)

Deployment Instructions:
1. Upload the contents of this directory to your web server
2. Configure your web server to serve the static files
3. Ensure your backend API is accessible at the URL specified in .env.production
4. Test all features after deployment

For Vercel deployment:
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

For Netlify deployment:
1. Drag and drop this directory to Netlify
2. Set environment variables in Netlify dashboard
3. Configure redirects for React Router

For traditional hosting:
1. Upload files to your web server
2. Configure server to serve index.html for all routes
3. Set up SSL certificate
4. Configure caching headers
EOF

print_status "Deployment package created: $DEPLOY_DIR"

# Create Vercel configuration
echo ""
echo "📝 Creating Vercel configuration..."
cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "@react_app_api_url"
  }
}
EOF
print_status "Vercel configuration created"

# Create Netlify configuration
echo ""
echo "📝 Creating Netlify configuration..."
cat > netlify.toml << EOF
[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  REACT_APP_API_URL = "https://your-backend-domain.com"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
EOF
print_status "Netlify configuration created"

# Create nginx configuration for traditional hosting
echo ""
echo "📝 Creating Nginx configuration for traditional hosting..."
cat > nginx.conf << EOF
server {
    listen 80;
    server_name your-frontend-domain.com www.your-frontend-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-frontend-domain.com www.your-frontend-domain.com;

    # SSL configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Root directory
    root /path/to/your/build;
    index index.html;

    # Static files with caching
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
    }

    # Handle React Router
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API proxy (if needed)
    location /api/ {
        proxy_pass https://your-backend-domain.com;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
print_status "Nginx configuration created"

echo ""
echo "🎉 Deployment setup completed successfully!"
echo "================================================"
echo ""
echo "📋 Available deployment options:"
echo ""
echo "1. 📦 Traditional Hosting:"
echo "   - Upload contents of '$DEPLOY_DIR' to your web server"
echo "   - Use nginx.conf for server configuration"
echo "   - Update domain and SSL paths in nginx.conf"
echo ""
echo "2. 🚀 Vercel Deployment:"
echo "   - Push code to GitHub"
echo "   - Connect repository to Vercel"
echo "   - Set REACT_APP_API_URL environment variable"
echo "   - Deploy automatically"
echo ""
echo "3. 🌐 Netlify Deployment:"
echo "   - Drag and drop '$DEPLOY_DIR' to Netlify"
echo "   - Or connect repository for automatic deployment"
echo "   - Set environment variables in Netlify dashboard"
echo ""
echo "⚠️  Important: Update .env.production with your actual backend API URL"
echo ""
echo "📚 For detailed deployment instructions, see the README.md" 