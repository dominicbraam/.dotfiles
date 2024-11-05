#!/bin/bash

monitors_data_file="$HOME/.screenlayout/monitors_data"
xrandr_cmd_script="$HOME/.screenlayout/xrandr_cmd.sh"

while IFS= read -r line; do
    if [[ $line == "xrandr"* ]]; then
        xrandr_cmd=$line
        break
    fi
done <"$xrandr_cmd_script"

delimiter="--output "
s=$xrandr_cmd$delimiter

displays=()
while [[ $s ]]; do
    displays+=("${s%%"$delimiter"*}")
    s=${s#*"$delimiter"}
done

declare -A configs
for display in "${displays[@]:1}"; do

    # skip if display is off
    [[ $display == *"off"* ]] && continue

    # get name of display
    name=$(echo "$display" | awk '{print $1}')

    # check if it is a primary display
    [[ $display == *"primary"* ]] && primary_bool=true || primary_bool=false

    # get position
    pos=$(cut -d " " -f2 <<<"${display#*--pos}")
    pos_x=$(cut -d "x" -f1 <<<"$pos")

    configs["$name"]="$primary_bool,$pos_x"
done

configs_sorted=$(for k in "${!configs[@]}"; do
    echo "$k" ',' "${configs["$k"]};"
done | sort --field-separator=, --key=3)
configs_sorted=$(echo "$configs_sorted" | tr -d ' ')

i=0
secondary_i=0
echo "[displays]" >"$monitors_data_file"
for display in ${configs_sorted[@]}; do
    ((i++))
    display_name=$(cut -d "," -f1 <<<"$display")
    echo "display$i=$display_name" >>"$monitors_data_file"
    if [[ $display == *"true"* ]]; then
        echo "primary=$display_name" >>"$monitors_data_file"
    else
        ((secondary_i++))
        echo "secondary$secondary_i=$display_name" >>"$monitors_data_file"
    fi
done

echo "monitor_count=$i" >>"$monitors_data_file"
