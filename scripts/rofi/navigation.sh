#!/bin/bash
#
# Fast Nav allows for quickly searching and opening files using its
# default app.

set -euo pipefail

function send_notification() {
    dunstify -a "navigation" -u low -t 2500 -r 9993 "Fast Nav" "$1"
}

function tcd {
    dir=$(fd --hidden --type directory | rofi -dmenu -i -no-show-icons -p "cd")
    kitty --working-directory "$dir"
}

function topen {
    # Create separation using span and rofi markup
    selection=$(
        fd --type file |
            awk -F/ '{
                name=$NF
                if (length(name) > 50)
                    name_truncated = substr(name, 1, 47) "..."
                else
                    name_truncated = name
                printf "%-50s\t%s\t%s\n", name_truncated, $0, name
            }' |
            rofi -dmenu -i -no-show-icons -p "🔎📂" \
                -theme-str '
                    window { width: 1500px; }
                ' \
                -display-columns 1,2
    )
    if [[ -n "$selection" ]]; then
        file_name=$(printf '%s\n' "$selection" | awk -F'\t' '{print $3}' | xargs)
        file_path=$(printf '%s\n' "$selection" | awk -F'\t' '{print $2}')
        send_notification "Opening '$file_name'"
        xdg-open "$file_path"
    fi
}

case $1 in
cd)
    tcd
    ;;
open)
    topen
    ;;
*)
    exit
    ;;
esac
