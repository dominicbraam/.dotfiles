#!/bin/bash

batt=$(headsetcontrol -b 2>/dev/null)
exit_code=$?

if [ $exit_code -eq 0 ]; then
	headsetcontrol -b | grep Battery | awk '{print $2}'
else
	echo ""
fi
