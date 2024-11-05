#!/usr/bin/env bash

# Terminate already running bar instances
# If all your bars have ipc enabled, you can use
polybar-msg cmd quit
# Otherwise you can use the nuclear option:
# killall -q polybar && sleep 2

echo "---" | tee -a /tmp/polybar1.log

source $HOME/.local/bin/bash-ini-parser/bash-ini-parser
cfg_parser $HOME/.screenlayout/monitors_data
cfg_section_displays

if [[ $monitor_count -eq 1 ]]; then
    polybar -r dominicbar 2>&1 | tee -a /tmp/polybar1.log &
    disown
elif [[ $monitor_count -eq 2 ]]; then
    polybar -r dominicbar 2>&1 | tee -a /tmp/polybar1.log &
    disown
    polybar -r dominicbar-secondary1 2>&1 | tee -a /tmp/polybar1.log &
    disown
elif [[ $monitor_count -eq 3 ]]; then
    polybar -r dominicbar 2>&1 | tee -a /tmp/polybar1.log &
    disown
    polybar -r dominicbar-secondary1 2>&1 | tee -a /tmp/polybar1.log &
    disown
    polybar -r dominicbar-secondary2 2>&1 | tee -a /tmp/polybar1.log &
    disown
fi

echo "Bars launched..."
