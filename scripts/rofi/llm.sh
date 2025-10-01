#!/bin/bash
SESSION_FILE="$HOME/.cache/oatmeal/session_mappings.json"
CURRENT_LOC="$PWD"

# create session file if it doesn't exist
if [ ! -f "$SESSION_FILE" ]; then
    echo "[]" >"$SESSION_FILE"
fi

function run_oatmeal {

    if [ -z "$1" ]; then
        return
    fi

    base_cmd="kitty --class Oatmeal -e oatmeal"

    if [ "$1" = "ollama" ]; then
        cmd="$base_cmd --backend ollama"
    elif [ "$1" = "openai" ]; then
        cmd="env OATMEAL_OPENAI_TOKEN=$(secret-tool lookup apikey openai-shell-cli) $base_cmd --backend openai --model o4-mini"
    fi

    if [ -z "$2" ]; then
        logger "creating new session [$1]"
        $cmd
    else
        logger "connecting to session [$1]: $2"
        env OATMEAL_OPENAI_TOKEN="$(secret-tool lookup apikey openai-shell-cli)" kitty --class=Oatmeal -e oatmeal sessions open --id "$2"
    fi
}

# maps session based on where the command was started and which backend
function get_oatmeal_session {

    SESSION_ID=$(jq -r --arg loc "$CURRENT_LOC" --arg backend "$1" '.[] | select(.location==$loc and .backend==$backend) | .session_id' "$SESSION_FILE")

    if [ -n "$SESSION_ID" ] && [ "$SESSION_ID" != "null" ]; then
        echo "$SESSION_ID"
    fi
    echo "poop"
}

function save_oatmeal_session {

    exists=$(jq --arg loc "$CURRENT_LOC" --arg backend "$1" 'any(.[]; .location == $loc and .backend==$backend)' "$SESSION_FILE")
    if [ "$exists" = "true" ]; then
        logger "Entry for location: $CURRENT_LOC, backend: $1 already exists. Not updating."
        return
    fi

    # uses latest values so it's not perfect
    LATEST_SESSION_ID=$(oatmeal sessions list | awk 'NR==1 {gsub(/\)$/, "", $3); print $3}')

    if
        [ -z "$LATEST_SESSION_ID" ] || [ "$LATEST_SESSION_ID" = "null" ]
    then
        logger "No valid session id found."
        return
    fi

    new_json=$(jq --arg loc "$CURRENT_LOC" --arg backend "$1" --arg session_id "$LATEST_SESSION_ID" '. + [{"location": $loc, "backend": $backend, "session_id": $session_id}]' "$SESSION_FILE")

    echo "$new_json" >"$SESSION_FILE"
    logger "Session saved for location $CURRENT_LOC with session id $LATEST_SESSION_ID"
}

mode1="openai"
mode2="ollama"
options="$mode1\n$mode2"
mode=$(echo -e "$options" | rofi -dmenu -no-show-icons -theme-str "listview { require-input: false; } inputbar { enabled: false; }")

# session_id=$(get_oatmeal_session "$mode")
# run_oatmeal "$mode" "$session_id"
run_oatmeal "$mode"
save_oatmeal_session "$mode"

case $mode in
"get_oatmeal_session")
    get_oatmeal_session "$1"
    ;;
*)
    exit
    ;;
esac
