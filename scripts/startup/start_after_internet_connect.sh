# wait for an internet connection
while ! wget http://google.com -O- 2>/dev/null | grep -q Lucky; do
  sleep .1
done

# launch stuff after internet connection

# file sync app
pgrep -x nextcloud > /dev/null || nextcloud &

# bspc rule -a discord desktop='^4' follow=off && discord &
pgrep -x Mailspring >/dev/null || bspc rule -a Mailspring desktop='^9' follow=off && mailspring --password-store="gnome-libsecret" &

# check for updates in .dotfiles
$HOME/.dotfiles/cron/dotfiles/check_updates.sh
