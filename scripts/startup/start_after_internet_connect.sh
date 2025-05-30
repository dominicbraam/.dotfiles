# wait for an internet connection
while ! wget -q --tries=10 --timeout=20 --spider -O - http://google.com >/dev/null; do
    sleep .5
done

# launch stuff after internet connection

# file sync app
pgrep -x nextcloud >/dev/null || nextcloud &

# bspc rule -a discord desktop='^4' follow=off && discord &
pgrep -x mailspring >/dev/null && (
    killall mailspring &
    mailspring --password-store="gnome-libsecret"
) || mailspring --password-store="gnome-libsecret" &

# check for updates in .dotfiles
"$HOME"/.dotfiles/cron/dotfiles/check_updates.sh
