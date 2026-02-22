#!/usr/bin/env bash

# Cache last known IP to avoid redundant API calls
# since ip monitor can output multiple lines and therefore,
# trigger the api call mutliple times per change.
last_ip=""

ip monitor address link route | while read -r _; do
	# Get current public IP
	current_ip=$(curl -s https://api.ipify.org)

	# Skip if empty (no internet) or unchanged.
	# Helping solve the same problem like above:
	# deduplicating since ip monitor hsa multi line output per process
	if [[ -z "$current_ip" || "$current_ip" == "$last_ip" ]]; then
		continue
	fi

	# Lookup country only when the IP changes
	country=$(curl -s "https://ipapi.co/$current_ip/country/")

	last_ip="$current_ip"

	echo "$country"
done
