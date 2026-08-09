#!/usr/bin/env bash

# Cache last known IP to avoid redundant API calls
# since ip monitor can output multiple lines and therefore,
# trigger the api call mutliple times per change.
last_ip=""

ip monitor address link route | while read -r _; do
	# Get current public IP
	current_ip=$(curl -fsS https://api.ipify.org) || {
		echo "err(ip)"
		sleep 3600 # delay cuz the error is most likely a rate limit
		continue
	}

	# Skip if empty (no internet) or unchanged.
	# Helping solve the same problem like above:
	# deduplicating since ip monitor hsa multi line output per process
	if [[ -z "$current_ip" || "$current_ip" == "$last_ip" ]]; then
		continue
	else
		last_ip="$current_ip"
	fi

	country=$(curl -fsS "https://ipapi.co/$current_ip/country/") || {
		echo "err(country)"
		sleep 3600 # delay cuz the error is most likely a rate limit
		continue
	}

	if [[ -z "$country" ]]; then
		echo "err(country)"
		continue
	fi

	echo "$country"
done
