#!/usr/bin/env bash

killall -q polybar && sleep 2

echo "---" | tee -a /tmp/polybar1.log

$HOME/.config/polybar/device_config

echo "Bars launched..."
