#! /bin/sh
#
# https://www.reddit.com/r/bspwm/comments/au6ody/update_desktops_on_monitor_change/
#
# Use script only after setting both laptop and external display variables using set_config script

# check if bspwm is running:
pgrep bspwm > /dev/null || exit 0

monitor_add() {
    # Add the external monitor
    # xrandr --output VGA-1 \
    #     --mode 1920x1080 \
    #     --pos 0x0 \
    #     --rotate normal \
    #     --output LVDS-1 \
    #     --primary \
    #     --mode 1600x900 \
    #     --pos 1920x0 \
    #     --rotate normal
    source $HOME/.dotfiles/Xorg/.config/Xorg/.display_res

    n_desktops=5 # How many desktops should be on second monitor

    for desktop in $(bspc query -D -m $secondary | sed "$n_desktops"q)
    do
        bspc desktop $desktop --to-monitor $primary
    done

    # The desktop "Desktop" is removed
    bspc desktop Desktop --remove > /dev/null
}

monitor_remove() {
    # Check if a single monitor is registerd by bspwm
    if [[ "$(bspc query -M | wc -l)" = 1 ]]
    then
        # Then do nothing
        exit
    fi
    # primary = external display
    # secondary = laptop display
    # at this time of running because set_config script has
    # to be run after this.
    bspc monitor $secondary -a Desktop > /dev/null

    for desktop in $(bspc query -D -m $secondary)
    do
        bspc desktop $desktop --to-monitor $primary
    done

    # Swap desktops

    bspc monitor $primary -a Desktop

    for desktop in $(bspc query -D -m $primary)
    do
        bspc desktop $desktop --to-monitor $secondary
    done
    
    bspc monitor $primary --remove > /dev/null

    # xrandr --output $secondary --off \
    #     --output $primary \
    #     --primary \
    #     --mode 1920x1200 \
    #     --pos 0x0 \
    #     --rotate normal

    source $HOME/.dotfiles/Xorg/.config/Xorg/layouts/thinkpad_z13-1200p.sh

    bspc desktop Desktop -r
}

source $HOME/.local/bin/bash-ini-parser/bash-ini-parser
cfg_parser $HOME/.dotfiles/custom_config/device_config
cfg_section_display

if xrandr | grep -o "$secondary connected" > /dev/null && [[ "$1" != "1" ]] && [[ "$(bspc query -M | wc -l)" != 2 ]] && [ ! -z $secondary ]
then
    monitor_add
else
    monitor_remove
fi
