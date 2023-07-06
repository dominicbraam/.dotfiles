#!/usr/bin/env bash

killall -q polybar && sleep 2

echo "---" | tee -a /tmp/polybar1.log

source $HOME/.local/bin/bash-ini-parser/bash-ini-parser

cfg_parser $HOME/.dotfiles/custom_config/device/displays
cfg_section_display

if [ ! -z $secondary ]; then
  polybar -r dominicbar 2>&1 | tee -a /tmp/polybar1.log & disown
  polybar -r dominicbar-secondary 2>&1 | tee -a /tmp/polybar1.log & disown
else
  polybar -r dominicbar 2>&1 | tee -a /tmp/polybar1.log & disown
fi


echo "Bars launched..."
