#!/bin/bash

killall -qw discord

# wait for an internet connection
while ! wget http://google.com -O- 2>/dev/null | grep -q Lucky; do
  sleep .1
done

# launch stuff
# discord &
mailspring &
bspc rule -a Surf -o desktop='^10' state=tiled follow=off && /usr/bin/surf http://assistant.home:8123 &
bspc rule -a Surf -o desktop='^10' state=tiled follow=off && /usr/bin/surf https://pihole.local.dominicbraam.com &
# bspc rule -a Alacritty -o desktop='^2' follow=on && /usr/bin/alacritty -e btop &
