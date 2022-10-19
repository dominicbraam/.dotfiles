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

# to prevent computer from sleeping when idle
# https://unix.stackexchange.com/questions/556913/prevent-the-computer-from-suspending-when-idle
xset s off
xset -dpms
xset s noblank

sxhkd &

# Desktop
source $HOME/.dotfiles/Xorg/.config/Xorg/hori_both1440.sh

# Laptop
# xrandr --output eDP1 --mode 2880x1800 &

# Compositor
picom &

nm-applet &

# wallpaper
nitrogen --restore &

#Status bar
# ~/.config/dwm-bar/bar.sh &
# dwmbar &
# ~/Programs/dwm-bar/dwm_bar.sh &

# Execute WM
exec bspwm -c ~/.config/bspwm/bspwmrc
