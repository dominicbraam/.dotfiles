#!/bin/bash

killall -qw discord

nitrogen --restore &
nm-applet &
blueman-applet &

# wait for an internet connection
while ! wget http://google.com -O- 2>/dev/null | grep -q Lucky; do
  sleep .1
done

# launch stuff
# bspc rule -a discord desktop='^4' follow=off && discord &
bspc rule -a Mailspring desktop='^5' follow=off && mailspring &
# bspc rule -a Surf -o desktop='^10' state=tiled follow=off && /usr/bin/surf https://home.dominicbraam.com &
# bspc rule -a Surf -o desktop='^10' state=tiled follow=off && /usr/bin/surf https://pihole.local.dominicbraam.com &
