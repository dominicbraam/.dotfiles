# wait for an internet connection
while ! wget -q --tries=10 --timeout=20 --spider -O - http://google.com >/dev/null; do
    sleep .5
done

# launch stuff after internet connection

# file sync app
pgrep -x nextcloud >/dev/null || nextcloud &

# bspc rule -a discord desktop='^4' follow=off && discord &
pgrep -x Mailspring >/dev/null || mailspring --password-store="gnome-libsecret" &
pgrep -x gnome-calendar >/dev/null || gnome-calendar &
pgrep -x planify >/dev/null || planify &

# check for updates in .dotfiles
"$HOME"/.dotfiles/cron/dotfiles/check_updates.sh
