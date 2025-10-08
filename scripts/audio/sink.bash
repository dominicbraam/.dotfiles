#!/bin/bash

function transform_sink_name {
    # Transforms output from:
    # 'alsa_output.pci-0000_63_00.6.HiFi__Speaker__sink'
    # to
    # 'Speaker'
    echo "$1" | sed -E "s/.*__([A-Za-z0-9]+)__sink/\1/"
}

function get_default {
    pactl get-default-sink
}

function set_default {

    count=0
    options=()
    old_default_sink_name=$(get_default)
    mapfile -t sinks < <(pactl list short sinks | awk '{print $1"\t"$2}')

    for line in "${sinks[@]}"; do

        sink_idx="${line%%$'\t'*}"
        sink_name="${line#*$'\t'}"

        # Formats menu labels in the format "idx sink_name human_readable_name".
        printf -v label '%s\t%s\t%s' "$sink_idx" "$sink_name" "$(transform_sink_name "$sink_name")"

        # Attaches "[Current]" to end of default menu label and maps it to idx that will
        # be used in the menu since the sink indeces can be random-ish.
        [[ "$sink_name" == "$old_default_sink_name" ]] &&
            label="$label [Current]" &&
            default_sink_menu_idx="$count"

        options+=("$label")
        count=$((count + 1))
    done

    selected_item="$(
        printf '%s\n' "${options[@]}" |
            rofi -dmenu -i \
                -mesg "Audio Output Switcher" \
                -theme-str '
                    window { width: 300px; }
                    mainbox { children: [ message, listview ]; }
                    listview { require-input: false; }
                ' \
                -no-show-icons \
                -selected-row "$default_sink_menu_idx" \
                -a "$default_sink_menu_idx" \
                -display-columns 3
    )"

    selected_sink_name="$(echo "$selected_item" | awk '{print $2}')"

    [[ -z "$selected_sink_name" ]] && exit 0

    pactl set-default-sink "$selected_sink_name"

    # Get the updated sink_name because sometimes the output doesn't switch.
    # If the selected port isn't avaialble, it defaults to another available
    # port on the selected output.
    new_default_sink_name=$(get_default)
    new_sink_human_readable=$(transform_sink_name "$new_default_sink_name")

    # Moves all current audio streams to the newly selected or closest
    # available port.
    pactl list short sink-inputs |
        awk '{print $1}' |
        xargs -r -I{} pactl move-sink-input {} "$new_default_sink_name"

    # Notification.
    [ "$new_default_sink_name" == "$old_default_sink_name" ] &&
        msg="No change." ||
        msg="Changed to $new_sink_human_readable."
    dunstify -a "changevolume" -u low -t 2500 -r 9993 "Audio Ouput" "$msg"
}

case $1 in
"get_default")
    transform_sink_name "$(get_default)"
    ;;
"set_default")
    set_default
    ;;
*)
    exit
    ;;
esac
