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

# Display resolution

xrandr --output eDP1 --mode 2880x1800 &
# xrandr --output eDP1 --mode 2880x1800 --dpi 200  &
# xrandr --output eDP1 --mode 2880x1800 --scale 0.5x0.5 
# xrandr --output HDMI3 --mode 2560x1440 --output eDP1 --auto --below HDMI3
# xrandr --output HDMI3 --mode 2560x1440 --output eDP1 --mode 1920x1200 --pos 1440x0 --above HDMI3
# xrandr --fb 4000x3240 --output HDMI3 --mode 2560x1440 --output eDP1 --scale 0.55x0.55 --pos 0x1440 --panning 2560x1440+0+1440

# Compositor
picom &

# wallpaper
nitrogen --restore &

#Status bar
# ~/.config/dwm-bar/bar.sh &
dwmbar &
# ~/Programs/dwm-bar/dwm_bar.sh &

# Execute WM
exec dwm
