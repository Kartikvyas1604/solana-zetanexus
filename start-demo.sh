#!/bin/bash

# ZetaChain Solana Universal NFT Program - Quick Start Script
# This script sets up and runs the application for bounty evaluation

echo "🏆 ZetaChain Solana Universal NFT Program - Bounty Submission"
echo "============================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ Environment check passed"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🚀 Starting development server..."
echo ""
echo "🌐 The application will be available at: http://localhost:8080"
echo ""
echo "📋 Bounty Evaluation Checklist:"
echo "  1. ✅ Connect Solana wallet (Phantom recommended)"
echo "  2. ✅ Connect EVM wallet (MetaMask)"
echo "  3. ✅ Navigate to NFT Studio section"
echo "  4. ✅ Try minting an NFT on Solana"
echo "  5. ✅ Try cross-chain transfer functionality"
echo "  6. ✅ View collection and transaction history"
echo ""
echo "📚 Documentation available in:"
echo "  - README.md - Complete project documentation"
echo "  - README_BOUNTY.md - Detailed bounty submission info"
echo "  - BOUNTY_SUMMARY.md - Executive summary for evaluators"
echo ""
echo "🔧 Press Ctrl+C to stop the server when done testing"
echo ""

# Start the development server
npm run dev
