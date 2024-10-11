#!/bin/bash

# This serves to change configs based on device
[[ -z "$1" ]] && { echo "Parameter is empty"; echo "(0 = laptop, 1 = laptop at work with their display, 2 = laptop and G7, 3 = PC - dualscreen - hori-vert)" ; exit 1; }

if [ $1 = '0' ]; then
  echo "Xft.dpi: 130" > $HOME/.dotfiles/Xorg/.Xresources

  mkdir -p $HOME/.dotfiles/custom_config
  echo "[display]" > $HOME/.dotfiles/custom_config/device/displays
  echo "primary=eDP-1" >> $HOME/.dotfiles/custom_config/device/displays
  echo "[cpu-temp]" > $HOME/.dotfiles/custom_config/device/temperature
  echo "hwmon-path=/sys/devices/platform/thinkpad_hwmon/hwmon/hwmon4/temp1_input" >> $HOME/.dotfiles/custom_config/device/temperature
  chmod +x $HOME/.dotfiles/custom_config/device/displays
  chmod +x $HOME/.dotfiles/custom_config/device/temperature

  echo "$HOME/.config/Xorg/layouts/thinkpad_z13-1200p.sh" > $HOME/.config/Xorg/.display_res
  chmod +x $HOME/.config/Xorg/.display_res
elif [ $1 = '1' ]; then
  echo "Xft.dpi: 100" > $HOME/.dotfiles/Xorg/.Xresources

  mkdir -p $HOME/.dotfiles/custom_config
  echo "[display]" > $HOME/.dotfiles/custom_config/device/displays
  echo "primary=DP-1" >> $HOME/.dotfiles/custom_config/device/displays
  echo "secondary=eDP-1" >> $HOME/.dotfiles/custom_config/device/displays
  echo "[cpu-temp]" > $HOME/.dotfiles/custom_config/device/temperature
  echo "hwmon-path=/sys/devices/platform/thinkpad_hwmon/hwmon/hwmon4/temp1_input" >> $HOME/.dotfiles/custom_config/device/temperature
  chmod +x $HOME/.dotfiles/custom_config/device/displays
  chmod +x $HOME/.dotfiles/custom_config/device/temperature

  echo "$HOME/.config/Xorg/layouts/work-display_z13.sh" > $HOME/.config/Xorg/.display_res
  chmod +x $HOME/.config/Xorg/.display_res
elif [ $1 = '2' ]; then
  echo "Xft.dpi: 130" > $HOME/.dotfiles/Xorg/.Xresources

  mkdir -p $HOME/.dotfiles/custom_config
  echo "[display]" > $HOME/.dotfiles/custom_config/device/displays
  echo "primary=DP-1" >> $HOME/.dotfiles/custom_config/device/displays
  echo "secondary=eDP-1" >> $HOME/.dotfiles/custom_config/device/displays
  echo "[cpu-temp]" > $HOME/.dotfiles/custom_config/device/temperature
  echo "hwmon-path=/sys/devices/platform/thinkpad_hwmon/hwmon/hwmon4/temp1_input" >> $HOME/.dotfiles/custom_config/device/temperature
  chmod +x $HOME/.dotfiles/custom_config/device/displays
  chmod +x $HOME/.dotfiles/custom_config/device/temperature

  echo "$HOME/.config/Xorg/layouts/lg4k_z13.sh" > $HOME/.config/Xorg/.display_res
  chmod +x $HOME/.config/Xorg/.display_res

else
  echo "Xft.dpi: 120" > $HOME/.dotfiles/Xorg/.Xresources

  mkdir -p $HOME/.dotfiles/custom_config
  echo "[display]" > $HOME/.dotfiles/custom_config/device/displays
  echo "primary=DP-2" >> $HOME/.dotfiles/custom_config/device/displays
  echo "secondary=DP-3" >> $HOME/.dotfiles/custom_config/device/displays
  echo "[cpu-temp]" > $HOME/.dotfiles/custom_config/device/temperature
  echo "hwmon-path=/sys/devices/pci0000:00/0000:00:18.3/hwmon/hwmon4/temp1_input" >> $HOME/.dotfiles/custom_config/device/temperature
  echo "[gpu-temp]" >> $HOME/.dotfiles/custom_config/device/temperature
  echo "hwmon-path=/sys/devices/pci0000:00/0000:00:03.1/0000:07:00.0/0000:08:00.0/0000:09:00.0/hwmon/hwmon3/temp1_input" >> $HOME/.dotfiles/custom_config/device/temperature
  chmod +x $HOME/.dotfiles/custom_config/device/displays
  chmod +x $HOME/.dotfiles/custom_config/device/temperature

  echo "$HOME/.config/Xorg/layouts/hori_1440-4k.sh" > $HOME/.config/Xorg/.display_res
  chmod +x $HOME/.config/Xorg/.display_res
fi

