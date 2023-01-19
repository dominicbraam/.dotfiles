#!/bin/bash

TIME=$(date +%R)
DATE=$(date +'%e %b')

if [[ $(date +%H) == "00" ]]; then
  HEADER="New Day"
  OUTPUT="$DATE\n$TIME"
else
  HEADER="Time"
  OUTPUT="$TIME"
fi

number_word=("zero" "one" "two" "three" "four" "five" "six" "seven" "eight" "nine" "ten" "eleven" "twelve")
TWELVE_HOUR=$(date +%l)
ICON="clock-time-${number_word[$TWELVE_HOUR]}.png"
ICON_PATH="$HOME/.dotfiles/icons/${ICON}"

dunstify -i $ICON_PATH -u low "$HEADER" "$OUTPUT" -t 2000
