#!/usr/bin/env bash
# From: https://github.com/rahriver/polynord

FLAGS_JSON="$HOME/.dotfiles/scripts/rofi/nord/vpn_flags.json"
LOG=/tmp/vpn_menu.log

echo "=== vpn_menu.sh start $(date) ===" >>"$LOG"

if ! [ -r "$FLAGS_JSON" ]; then
	echo "Missing $FLAGS_JSON" >>"$LOG"
	exit 1
fi

mapfile -t menu < <(
	jq -r 'to_entries[] | "\(.value)|\(.key)"' "$FLAGS_JSON" \
		2>>"$LOG"
)
echo "Loaded ${#menu[@]} countries" >>"$LOG"

country=$(printf '%s\n' "${menu[@]}" |
	rofi -dmenu -i -no-show-icons -mesg "NordVPN" \
		-p "country" \
		-theme-str '
			mainbox { children: [ message, inputbar, listview ]; }
		' 2>>"$LOG" |
	awk -F '|' '{print $2}')
echo "Chosen country: $country" >>"$LOG"
[ -z "$country" ] && exit

mapfile -t cities < <(nordvpn cities "$country" 2>>"$LOG")
echo "Found ${#cities[@]} cities" >>"$LOG"
[ ${#cities[@]} -eq 0 ] && exit

city=$(printf '%s\n' "${cities[@]}" |
	rofi -dmenu -i -no-show-icons -mesg "NordVPN" \
		-p "city$(grep "|$country$" <<<"${menu[@]}" | cut -d'|' -f1)" \
		-theme-str '
			mainbox { children: [ message, inputbar, listview ]; }
		' 2>>"$LOG")
echo "Chosen city: $city" >>"$LOG"
[ -z "$city" ] && exit

echo "Running: nordvpn connect $country $city" >>"$LOG"
nordvpn connect "$country" "$city" 2>>"$LOG"
