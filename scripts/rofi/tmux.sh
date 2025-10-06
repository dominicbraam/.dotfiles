#!/bin/bash

set -euo pipefail

function send_notification() {
    dunstify -a "tmux_session_mgr" -u low -t 2500 -r 9993 "Tmux Manager" "$1"
}

function is_tmux_session {
    mapfile -t tmux_sessions < <(tmux ls -F "#S")

    # re='^[0-9]+$'

    for session in "${tmux_sessions[@]}"; do
        # if [[ $session =~ $re ]] ; then
        #   # returns 0 because the session name comes from dir name and so
        #   # is unlikely to be a number
        #   continue
        # fi
        if [ -z "$1" ]; then
            return 1
        fi
        if [ "$1" = "$session" ]; then
            return 0
        fi
    done
    return 1
}

function tmux_new {
    dir=$(
        fd --hidden --max-depth=1 --type directory "" "$1" |
            rofi -dmenu -i -no-show-icons -p "$1" \
                -mesg "tmux new" \
                -theme-str '
                        mainbox { children: [ message, inputbar, listview ]; }
                    '
    )

    session_name=$(basename "$dir")

    if [[ $session_name == .* ]]; then
        # ensure session name for hidden files begin with _ rathen than .
        # this follows tmux naming scheme
        session_name="_${session_name:1}"
    fi

    if is_tmux_session "$session_name"; then
        kitty tmux attach-session -t "$session_name"
    else
        if [ -n "$dir" ]; then
            kitty --working-directory "$dir" tmux new -s "$session_name"
        fi
    fi
}

function tmux_attach {
    sessions=$(tmux ls -F "#S" || true)

    if [ -z "$sessions" ]; then
        send_notification "No sessions found."
        exit 0
    fi

    session_name=$(
        printf '%s\n' "$sessions" | rofi -dmenu -i -no-show-icons \
            -mesg "tmux attach" \
            -theme-str '
                listview { require-input: false; }
                mainbox { children: [ message, listview ]; }
            '
    )

    if is_tmux_session "$session_name"; then
        kitty tmux attach-session -t "$session_name"
    fi
}

function tcd {
    dir=$(fd --type directory | rofi -dmenu -i -no-show-icons -p "cd")
    kitty --working-directory "$dir"
}

case $1 in
cd)
    tcd
    ;;
tn)
    tmux_new "$2"
    ;;
ta)
    tmux_attach
    ;;
*)
    exit
    ;;
esac
