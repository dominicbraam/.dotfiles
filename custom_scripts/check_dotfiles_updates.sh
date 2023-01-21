#!/bin/bash
# will give you the total number of "different" commits between the two

cd $HOME/.dotfiles/
UPDATES=$(git rev-list HEAD...origin/main --count)

if [[ UPDATES -gt 0 ]]; then
  dunstify -u normal ".dotfiles" "Repo is $UPDATES commits behind."
fi
