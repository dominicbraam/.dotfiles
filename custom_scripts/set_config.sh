#!/bin/bash

# This serves to change configs based on device
[[ -z "$1" ]] && { echo "Parameter is empty"; echo "(0 = laptop, 1 = PC - dualscreen - hori-vert)" ; exit 1; }

if [ $1 = '0' ]; then
  echo "Xft.dpi: 140" > $HOME/.dotfiles/Xorg/.config/Xorg/.Xresources
  echo "bspc monitor eDP1 -d 1 2 3 4 5 6 7 8 9 0" > $HOME/.dotfiles/bspwm/.config/bspwm/device_config
  echo "polybar -r dominicbar-laptop 2>&1 | tee -a /tmp/polybar1.log & disown" > $HOME/.dotfiles/polybar/.config/polybar/device_config
  echo "[device]" > $HOME/.dotfiles/polybar/.config/polybar/device_vars
  echo "hwmon-path = /sys/devices/platform/coretemp.0/hwmon/hwmon5/device/hwmon/hwmon5/temp1_input" >> $HOME/.dotfiles/polybar/.config/polybar/device_vars
else
  echo "Xft.dpi: 100" > $HOME/.dotfiles/Xorg/.config/Xorg/.Xresources
  echo "bspc monitor DP-2 -d 1 2 3 4 5" > $HOME/.dotfiles/bspwm/.config/bspwm/device_config
  echo "bspc monitor DP-3 -d 6 7 8 9 0" >> $HOME/.dotfiles/bspwm/.config/bspwm/device_config
  echo "polybar -r dominicbar 2>&1 | tee -a /tmp/polybar1.log & disown" > $HOME/.dotfiles/polybar/.config/polybar/device_config
  echo "polybar -r dominicbar-secondary 2>&1 | tee -a /tmp/polybar1.log & disown" >> $HOME/.dotfiles/polybar/.config/polybar/device_config
  echo "[device]" > $HOME/.dotfiles/polybar/.config/polybar/device_vars
  echo "hwmon-path = /sys/devices/pci0000:00/0000:00:18.3/hwmon/hwmon3/temp1_input" >> $HOME/.dotfiles/polybar/.config/polybar/device_vars
fi
