#!/bin/bash

# This serves to change configs based on device
[[ -z "$1" ]] && { echo "Parameter is empty"; echo "(0 = laptop, 1 = laptop at work with their display, 2 = PC - dualscreen - hori-vert)" ; exit 1; }

if [ $1 = '0' ]; then
  echo "Xft.dpi: 100" > $HOME/.dotfiles/Xorg/.config/Xorg/.Xresources

  echo "bspc monitor eDP-1 -d 1 2 3 4 5 6 7 8 9 0" > $HOME/.dotfiles/bspwm/.config/bspwm/device_config
  chmod +x $HOME/.dotfiles/bspwm/.config/bspwm/device_config

  echo "polybar -r dominicbar 2>&1 | tee -a /tmp/polybar1.log & disown" > $HOME/.dotfiles/polybar/.config/polybar/device_config
  chmod +x $HOME/.dotfiles/polybar/.config/polybar/device_config

  echo "[cpu-temp]" > $HOME/.dotfiles/polybar/.config/polybar/device_vars
  echo "hwmon-path = /sys/devices/platform/thinkpad_hwmon/hwmon/hwmon4/temp1_input" >> $HOME/.dotfiles/polybar/.config/polybar/device_vars
  echo "[gpu-temp]" >> $HOME/.dotfiles/polybar/.config/polybar/device_vars
  echo "bar-config = ''" >> $HOME/.dotfiles/polybar/.config/polybar/device_vars
  chmod +x $HOME/.dotfiles/polybar/.config/polybar/device_vars

  echo "[display]" > $HOME/.dotfiles/custom_config/displays
  echo "primary = eDP-1" >> $HOME/.dotfiles/custom_config/displays
  chmod +x $HOME/.dotfiles/custom_config/displays

  bspc wm --restart
elif [ $1 = '1' ]; then
  echo "Xft.dpi: 100" > $HOME/.dotfiles/Xorg/.config/Xorg/.Xresources

  echo "bspc monitor DP-1 -d 1 2 3 4 5" > $HOME/.dotfiles/bspwm/.config/bspwm/device_config
  echo "bspc monitor eDP-1 -d 6 7 8 9 0" >> $HOME/.dotfiles/bspwm/.config/bspwm/device_config
  chmod +x $HOME/.dotfiles/bspwm/.config/bspwm/device_config

  echo "polybar -r dominicbar 2>&1 | tee -a /tmp/polybar1.log & disown" > $HOME/.dotfiles/polybar/.config/polybar/device_config
  echo "polybar -r dominicbar-secondary 2>&1 | tee -a /tmp/polybar1.log & disown" >> $HOME/.dotfiles/polybar/.config/polybar/device_config
  chmod +x $HOME/.dotfiles/polybar/.config/polybar/device_config

  echo "[cpu-temp]" > $HOME/.dotfiles/polybar/.config/polybar/device_vars
  echo "hwmon-path = /sys/devices/platform/thinkpad_hwmon/hwmon/hwmon4/temp1_input" >> $HOME/.dotfiles/polybar/.config/polybar/device_vars
  echo "[gpu-temp]" >> $HOME/.dotfiles/polybar/.config/polybar/device_vars
  echo "bar-config = ''" >> $HOME/.dotfiles/polybar/.config/polybar/device_vars
  chmod +x $HOME/.dotfiles/polybar/.config/polybar/device_vars

  echo "[display]" > $HOME/.dotfiles/custom_config/displays
  echo "primary = DP-1" >> $HOME/.dotfiles/custom_config/displays
  echo "secondary = eDP-1" >> $HOME/.dotfiles/custom_config/displays
  chmod +x $HOME/.dotfiles/custom_config/displays

  bspc wm --restart
else
  echo "Xft.dpi: 100" > $HOME/.dotfiles/Xorg/.config/Xorg/.Xresources

  echo "bspc monitor DP-2 -d 1 2 3 4 5" > $HOME/.dotfiles/bspwm/.config/bspwm/device_config
  echo "bspc monitor DP-3 -d 6 7 8 9 0" >> $HOME/.dotfiles/bspwm/.config/bspwm/device_config
  chmod +x $HOME/.dotfiles/bspwm/.config/bspwm/device_config

  echo "polybar -r dominicbar 2>&1 | tee -a /tmp/polybar1.log & disown" > $HOME/.dotfiles/polybar/.config/polybar/device_config
  echo "polybar -r dominicbar-secondary 2>&1 | tee -a /tmp/polybar1.log & disown" >> $HOME/.dotfiles/polybar/.config/polybar/device_config
  chmod +x $HOME/.dotfiles/polybar/.config/polybar/device_config

  echo "[cpu-temp]" > $HOME/.dotfiles/polybar/.config/polybar/device_vars
  echo "hwmon-path = /sys/devices/pci0000:00/0000:00:18.3/hwmon/hwmon4/temp1_input" >> $HOME/.dotfiles/polybar/.config/polybar/device_vars
  echo "[gpu-temp]" >> $HOME/.dotfiles/polybar/.config/polybar/device_vars
  echo "hwmon-path = /sys/devices/pci0000:00/0000:00:03.1/0000:07:00.0/0000:08:00.0/0000:09:00.0/hwmon/hwmon3/temp1_input" >> $HOME/.dotfiles/polybar/.config/polybar/device_vars
  echo "bar-config = 'temperature-gpu m-gap '" >> $HOME/.dotfiles/polybar/.config/polybar/device_vars
  chmod +x $HOME/.dotfiles/polybar/.config/polybar/device_vars

  echo "[display]" > $HOME/.dotfiles/custom_config/displays
  echo "primary = DP-2" >> $HOME/.dotfiles/custom_config/displays
  echo "secondary = DP-3" >> $HOME/.dotfiles/custom_config/displays
  chmod +x $HOME/.dotfiles/custom_config/displays

  bspc wm --restart
fi

./../polybar/.config/polybar/launch.sh &
