#!/bin/bash
# purpose of pgrep: https://www.reddit.com/r/bspwm/comments/sb4ics/what_does_this_line_do_in_the_config/

# hoykey daemon
# pgrep -x sxhkd >/dev/null || sxhkd &

# notification daemon
pgrep -x dunst >/dev/null || dunst &

# compositor
pgrep -x picom >/dev/null || picom &

# network and bluetooth applets
pgrep -x nm-applet >/dev/null || nm-applet --indicator &
pgrep -x blueman-applet >/dev/null || blueman-applet &
# pgrep -x bitwarden-desktop >/dev/null || bitwarden-desktop &

# auto mount media
pgrep -x udiskie >/dev/null || udiskie &

# display resolution
"$HOME"/.screenlayout/xrandr_cmd.sh

"$HOME"/.config/polybar/launch.sh

# wallpaper manager
nitrogen --restore &

"$HOME"/.dotfiles/scripts/general/dbus_var_handler.sh &

/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1 &
