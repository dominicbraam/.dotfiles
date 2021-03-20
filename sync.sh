#!/bin/zsh

rsync -avu --delete "$HOME/.config" "$HOME/.dotfiles"
rsync -avu --delete "$HOME/Programs/dwm" "$HOME/.dotfiles"
rsync -avu --delete "$HOME/Programs/dmenu" "$HOME/.dotfiles"
rsync -avu --delete "$HOME/Programs/dwmbar" "$HOME/.dotfiles"
rsync -avu --delete "$HOME/.gtkrc-2.0" "$HOME/.dotfiles"
rsync -avu --delete "$HOME/.xinitrc" "$HOME/.dotfiles"
rsync -avu --delete "$HOME/.zshenv" "$HOME/.dotfiles"
