#!/usr/bin/env bash

killall -q polybar && sleep 2

echo "---" | tee -a /tmp/polybar1.log

polybar -r dominicbar 2>&1 | tee -a /tmp/polybar1.log & disown
polybar -r dominicbar-secondary 2>&1 | tee -a /tmp/polybar1.log & disown

echo "Bars launched..."
