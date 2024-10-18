#!/bin/bash

wallpapers_dir=$HOME/Wallpapers
wallpaper_file_name=$(ls $wallpapers_dir | shuf -n 1)
wallpaper_full_path="${wallpapers_dir}/${wallpaper_file_name}"

nitrogen --set-zoom-fill $wallpaper_full_path --save
betterlockscreen -u $wallpaper_full_path --fx dim --dim 50
