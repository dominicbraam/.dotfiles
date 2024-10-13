#!/bin/bash

function run_chatgpt {
  env OPENAI_KEY=$(secret-tool lookup apikey openai-shell-cli) alacritty --hold -e chatgpt --model gpt-4o-mini-2024-07-18 -p "$1"
}

function chat_quick_response {
  query=$(rofi -dmenu -no-show-icons -theme-str "listview { require-input: false; }" -p "ask")
  run_chatgpt "$query"
}

mode1="Quick Response"
mode2="Conversation"
mode3="History"
options="$mode1\n$mode2\n$mode3"
mode=$(echo -e $options | rofi -dmenu -no-show-icons -theme-str "listview { require-input: false; } inputbar { enabled: false; }")

case $mode in
  $mode1)
    chat_quick_response
    ;;
  $mode2)
    run_chatgpt
    ;;
  $mode3)
    run_chatgpt "history"
    ;;
  *)
    exit
    ;;
esac
