#!/bin/bash

# Screenshot Automation Progress Checker
echo "🔍 Screenshot Automation Progress Report"
echo "========================================"

# Count total URLs
TOTAL_URLS=$(grep -c '"url":' tests/screenshot-automation.spec.ts)
echo "📋 Total URLs to process: $TOTAL_URLS"

# Count completed screenshots
COMPLETED_SCREENSHOTS=$(find screenshots/ -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
echo "✅ Screenshots completed: $COMPLETED_SCREENSHOTS"

# Calculate remaining
REMAINING=$((TOTAL_URLS - COMPLETED_SCREENSHOTS))
echo "⏳ URLs remaining: $REMAINING"

# Calculate percentage
if [ $TOTAL_URLS -gt 0 ]; then
    PERCENTAGE=$((COMPLETED_SCREENSHOTS * 100 / TOTAL_URLS))
    echo "📊 Progress: $PERCENTAGE% complete"
else
    echo "📊 Progress: Unable to calculate"
fi

echo ""
echo "📁 Recent screenshot directories:"
ls -lt screenshots/ | head -10

echo ""
echo "🕒 Last screenshot taken:"
find screenshots/ -name "*.png" -exec ls -lt {} + | head -1 