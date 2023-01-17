#!/bin/bash

[[ -z "$1" ]] && { echo "No brightness value entered. Use values from 1 to 255"; exit 1; }

echo $1 > /sys/devices/pci0000:00//0000:00:08.1/0000:63:00.0/backlight/amdgpu_bl0/brightness
