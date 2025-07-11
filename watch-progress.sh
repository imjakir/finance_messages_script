#!/bin/bash

# Real-time progress monitor
echo "🔄 Real-time Screenshot Progress Monitor"
echo "Press Ctrl+C to stop monitoring"
echo "========================================"

while true; do
    # Clear screen and show current time
    clear
    echo "🕒 $(date)"
    echo "========================================"
    
    # Get current counts
    TOTAL_URLS=4540
    COMPLETED=$(find screenshots/ -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
    REMAINING=$((TOTAL_URLS - COMPLETED))
    PERCENTAGE=$((COMPLETED * 100 / TOTAL_URLS))
    
    # Display progress
    echo "📊 Progress: $PERCENTAGE% complete"
    echo "✅ Screenshots taken: $COMPLETED"
    echo "⏳ Remaining: $REMAINING"
    echo "📋 Total: $TOTAL_URLS"
    
    # Progress bar
    FILLED=$((PERCENTAGE / 2))
    printf "["
    for i in $(seq 1 50); do
        if [ $i -le $FILLED ]; then
            printf "█"
        else
            printf "░"
        fi
    done
    printf "] $PERCENTAGE%%\n"
    
    echo ""
    echo "🕒 Last 3 screenshot folders:"
    ls -lt screenshots/ | head -4 | tail -3
    
    # Wait 5 seconds before next update
    sleep 5
done 