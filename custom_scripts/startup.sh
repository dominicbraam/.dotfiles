#!/bin/bash
# purpose of pgrep: https://www.reddit.com/r/bspwm/comments/sb4ics/what_does_this_line_do_in_the_config/

# wallpaper manager
nitrogen --restore &

# hoykey daemon
pgrep -x sxhkd >/dev/null || sxhkd &

# notification daemon
pgrep -x dunst >/dev/null || dunst &

# compositor
pgrep -x picom >/dev/null || picom &

# network and bluetooth applets
pgrep -x nm-applet >/dev/null || nm-applet &
pgrep -x blueman-applet >/dev/null || blueman-applet &

# bar
# $HOME/.config/polybar/launch.sh &

# WM
exec bspwm -c $HOME/.config/bspwm/bspwmrc
