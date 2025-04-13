#!/bin/bash

while read -r; do dunstctl history-pop; done <<<"$(dunstctl history | grep '"id" :')"
