function tcd {
  dir=$(fd --hidden --type directory | rofi -dmenu -i -no-show-icons -p "cd")
  alacritty --working-directory $dir
}

case $1 in
  cd)
    tcd
    ;;
  *)
    exit
    ;;
esac
