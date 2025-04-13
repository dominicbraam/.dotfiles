#!/bin/bash

function run_openai {
    env OATMEAL_OPENAI_TOKEN="$(secret-tool lookup apikey openai-shell-cli)" alacritty -e oatmeal --backend openai --model o3-mini &
    sleep 0.25

    node_id=$(bspc query -N -n focused)
    bspc node "$node_id" -t floating
    bspc node "$node_id" -z top 0 -200
    bspc node "$node_id" -z right 160 0
    bspc node "$node_id" -z bottom 0 200
    bspc node "$node_id" -z left -160 0
}

mode1="openai"
mode2="ollama-local"
options="$mode1\n$mode2"
mode=$(echo -e "$options" | rofi -dmenu -no-show-icons -theme-str "listview { require-input: false; } inputbar { enabled: false; }")

case $mode in
"$mode1")
    run_openai
    ;;
"$mode2")
    run_deepseek
    ;;
*)
    exit
    ;;
esac
