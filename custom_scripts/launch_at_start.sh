#!/bin/bash

killall -qw discord

# wait for an internet connection
while ! wget http://google.com -O- 2>/dev/null | grep -q Lucky; do
  sleep .1
done

# launch stuff
discord &
# bspc rule -a Alacritty -o desktop='^2' follow=on && /usr/bin/alacritty -e btop &
