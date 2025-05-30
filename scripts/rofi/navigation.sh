function tcd {
    dir=$(fd --hidden --type directory | rofi -dmenu -i -no-show-icons -p "cd")
    kitty --working-directory "$dir"
}

function topen {
    selection=$(fd --type file | awk -F/ '{print $NF " | " $0}' | rofi -dmenu -i -no-show-icons -p "🔎📂")
    file_path=$(echo "$selection" | sed 's#.*| ##')
    xdg-open "$file_path"
}

case $1 in
cd)
    tcd
    ;;
open)
    topen
    ;;
*)
    exit
    ;;
esac
