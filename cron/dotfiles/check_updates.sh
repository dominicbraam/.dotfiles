#!/bin/bash
# will give you the total number of "different" commits between the two

DOTFILES_DIR="$HOME/.dotfiles/"

UPDATES=$(git -C $DOTFILES_DIR rev-list HEAD...origin/main --count)

if [[ $UPDATES -gt 0 ]]; then
  ACTION=$(dunstify --action="update,Update" -u normal ".dotfiles" "Repo is $UPDATES commits behind.")
fi

case "$ACTION" in
  "update")
    RESPONSE=$(git -C $DOTFILES_DIR pull)
    dunstify --action="update,Update" -u normal ".dotfiles" "$RESPONSE"
    ;;
  "*")
    exit
    ;;
esac
