#!/bin/bash

source "$HOME"/.local/bin/bash-ini-parser/bash-ini-parser

cfg_parser "$HOME"/.screenlayout/monitors_data
cfg_section_displays

BSPC_MONITOR_IDS=($(bspc query -M))
BSPC_PRIMARY_ID=$(bspc query -M -m "$primary")
BSPC_PRIMARY_DESKTOP_ID=$(bspc query -m "$primary" -D | head -n 1)

# remove primary monitor id from list
for i in "${!BSPC_MONITOR_IDS[@]}"; do
    if [ "${BSPC_MONITOR_IDS[$i]}" == "$BSPC_PRIMARY_ID" ]; then
        unset "BSPC_MONITOR_IDS[$i]"
    fi
done

for monitor_id in "${BSPC_MONITOR_IDS[@]}"; do
    MONITOR_NODES_IDS=($(bspc query -m "$monitor_id" -N))
    for node_id in "${MONITOR_NODES_IDS[@]}"; do
        bspc node "$node_id" -d "$BSPC_PRIMARY_DESKTOP_ID"
    done
done
