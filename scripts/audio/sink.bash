#!/bin/bash

default_sink_name=$(pactl info | sed -n "s/^Default Sink: //p")

function get_human_name {
    echo "$1" | sed -E "s/.*__([A-Za-z0-9]+)__sink/\1/"
}

function get_default {
    get_human_name "$default_sink_name"
}

function set_default {
    mapfile -t sinks < <(pactl list short sinks | awk '{print $1"\t"$2}')

    options=()
    for line in "${sinks[@]}"; do
        idx="${line%%$'\t'*}"
        sink_name="${line#*$'\t'}"

        printf -v label '%s\t%s\t%s' "$idx" "$sink_name" "$(get_human_name "$sink_name")"
        [[ "$sink_name" == "$default_sink_name" ]] &&
            label="$label [default]" &&
            default_sink_idx="$idx"

        options+=("$label")
    done

    selected_idx="$(printf '%s\n' "${options[@]}" | rofi -dmenu -i -p 'Audio Output' -no-show-icons -selected-row "$default_sink_idx" -a "$default_sink_idx" -theme-str "listview { require-input: false; } inputbar { enabled: false; }" -display-columns 3 -format i)"

    [[ -z "$selected_idx" ]] && exit 1

    IFS=$'\t' read -r new_sink_idx new_sink_name _ <<<"${sinks[$selected_idx]}"

    pactl set-default-sink "$new_sink_name"
}

case $1 in
"get_default")
    get_default
    ;;
"set_default")
    set_default
    ;;
*)
    exit
    ;;
esac
