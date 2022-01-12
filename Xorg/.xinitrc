#!/bin/sh

userresources=$HOME/.config/Xorg/.Xresources
usermodmap=$HOME/.Xmodmap
sysresources=/etc/X11/xinit/.Xresources
sysmodmap=/etc/X11/xinit/.Xmodmap

# merge in defaults and keymaps

if [ -f $sysresources ]; then
    xrdb -merge $sysresources
fi

if [ -f $sysmodmap ]; then
    xmodmap $sysmodmap
fi

if [ -f "$userresources" ]; then

    xrdb -merge "$userresources"

fi

if [ -f "$usermodmap" ]; then
    xmodmap "$usermodmap"
fi

# start some nice programs

if [ -d /etc/X11/xinit/xinitrc.d ] ; then
 for f in /etc/X11/xinit/xinitrc.d/?*.sh ; do
  [ -x "$f" ] && . "$f"
 done
 unset f
fi

sxhkd &

xrandr --output DP-1 --off --output DP-2 --primary --mode 2560x1440 --pos 2560x0 --rotate normal --output DP-3 --mode 2560x1440 --pos 0x0 --rotate normal --output HDMI-1 --off
# xrandr --output eDP1 --mode 2880x1800 &

# Compositor
picom &

nm-applet &

# wallpaper
nitrogen --restore &

nmcli device modify eno1 ipv4.ignore-auto-dns yes

#Status bar
# ~/.config/dwm-bar/bar.sh &
# dwmbar &
# ~/Programs/dwm-bar/dwm_bar.sh &

# Execute WM
exec bspwm -c ~/.config/bspwm/bspwmrc
