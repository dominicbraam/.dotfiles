#!/bin/bash

echo "Save arandr file to $HOME/.screenlayout/xrandr_cmd.sh"
/usr/bin/arandr
$HOME/.dotfiles/scripts/displays/set_monitors_data.bash
