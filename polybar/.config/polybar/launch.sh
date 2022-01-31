#!/usr/bin/env bash

killall -q polybar && sleep 2

echo "---" | tee -a /tmp/polybar1.log

# Desktop
polybar -r dominicbar 2>&1 | tee -a /tmp/polybar1.log & disown
polybar -r dominicbar-secondary 2>&1 | tee -a /tmp/polybar1.log & disown

# Laptop
# polybar -r dominicbar-laptop 2>&1 | tee -a /tmp/polybar1.log & disown

echo "Bars launched..."
