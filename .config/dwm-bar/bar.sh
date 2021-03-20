#!/bin/zsh

batstat(){
	stat="$(cat /sys/class/power_supply/BAT0/capacity)"
	printf "   %s %s " "$stat" "%"
}

cpupwr(){
	pwr="$(awk '{printf("%.1f  W",$1*10^-6)}' /sys/class/power_supply/BAT0/current_now)"
	printf " %s " "$pwr"
}

cputemp(){
	temp="$(sensors | grep 'Package id 0' | awk '{print $4}')"
	printf "   %s " "$temp"
}

fanspeed(){
	rpm="$(sensors | grep 'Left side' | awk '{print $4}')"
	printf " %s rpm " "$rpm"
}

getdate(){
	dte="$(date '+%a %d %b   %X')"
	printf "    %s " "$dte"
}

while true
do
	xsetroot -name "|   cpu  $(cpupwr)  $(cputemp)  $(fanspeed)   |   $(batstat)   |   $(getdate)   |"
	sleep 1
done &
