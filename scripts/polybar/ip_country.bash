#!/usr/bin/env bash

PUBLIC_IP=$(curl -s https://api.ipify.org)

COUNTRY_CODE=$(curl -s "https://ipapi.co/$PUBLIC_IP/country/")

echo "$COUNTRY_CODE"
