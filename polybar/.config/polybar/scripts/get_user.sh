#!/bin/bash

user=$(whoami)

if [[ $user == "dominic" ]]; then
  icon="🏠"
elif [[ $user == "uog" ]]; then
  icon="💼"
fi

echo "$icon $user"
