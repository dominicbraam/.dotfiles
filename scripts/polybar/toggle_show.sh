#!/bin/bash

# https://www.reddit.com/r/bspwm/comments/ury8vb/toggle_polybar_onoff/

if [ -f /tmp/polybarhidden ]; then 
  polybar-msg cmd show 
  bspc config top_padding 45
  rm /tmp/polybarhidden 
else 
  polybar-msg cmd hide 
  bspc config top_padding 0 
  touch /tmp/polybarhidden 
fi
