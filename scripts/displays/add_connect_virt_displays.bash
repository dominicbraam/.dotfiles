#!/bin/bash

EVDI_DEVICES=($(xrandr | grep -o DVI-I-.-.))
read EVDI0 EVDI1 EVDI2 EVDI3 <<<${EVDI_DEVICES[@]}
# used cvt command to get modeline for below. eg: `cvt 1920 1200`
xrandr --newmode "1920x1200_60.00" 193.25 1920 2056 2256 2592 1200 1203 1209 1245 -hsync +vsync
xrandr --newmode "1440x900_60.00" 106.50 1440 1528 1672 1904 900 903 909 934 -hsync +vsync
for dev in ${EVDI_DEVICES[@]}; do
    xrandr --addmode $dev 1920x1200
    xrandr --addmode $dev 1440x900
done

# Select how many virtual displays you will use
MY_DEVICES=("$EVDI0" "$EVDI1")
for dev in ${MY_DEVICES[@]}; do
    sysfs_id=$(echo "${dev}" | cut -d '-' -f 4)
    sysfs_path=$(sudo find /sys/kernel/debug/dri -type d -name "DVI-I-${sysfs_id}")
    echo on | sudo tee "${sysfs_path}/force" >/dev/null
done
