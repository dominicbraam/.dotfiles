#!/bin/bash

[[ -z "$1" ]] && { echo "No brightness value entered. Use values from 100 to 1900"; exit 1; }

echo $1 > /sys/devices/pci0000:00/0000:00:02.0/drm/card0/card0-eDP-1/intel_backlight/brightness
