#!/bin/bash

function is_tmux_session {
  tmux_sessions=( $(tmux ls -F "#S") )

  re='^[0-9]+$'

  for session in ${tmux_sessions[@]}
  do
    # if [[ $session =~ $re ]] ; then
    #   # returns 0 because the session name comes from dir name and so
    #   # is unlikely to be a number
    #   continue
    # fi
    if [ -z $1 ]; then
      return 1
    fi
    if [ $1 = $session ]; then
      return 0
    fi
  done
  return 1
}

function tmux_new {
  dir=$(fd --hidden --max-depth=1 --type directory "" $1 | rofi -dmenu -i -no-show-icons -p "tmux new")

  session_name=$(basename $dir)

  if [[ $session_name == .* ]]; then
    # ensure session name for hidden files begin with _ rathen than .
    # this follows tmux naming scheme
    session_name="_${session_name:1}"
  fi

  is_tmux_session $session_name

  if [[ $? -eq 0 ]]; then
    alacritty --command tmux attach-session -t $session_name
  else
    echo "$dir and $session_name"
    alacritty --working-directory $dir --command tmux new -s $session_name
  fi
}

function tmux_attach {
  session_name=$(tmux ls -F "#S" | rofi -dmenu -i -no-show-icons -theme-str "listview { require-input: false; }" -p "tmux attach")

  is_tmux_session $session_name

  if [[ $? -eq 0 ]]; then
    echo "hmm"
    alacritty --command tmux attach-session -t $session_name
  fi
}

function tcd {
  dir=$(fd --type directory | rofi -dmenu -i -no-show-icons -p "cd")
  alacritty --working-directory $dir
}

case $1 in
  cd)
    tcd
    ;;
  tn)
    tmux_new $2
    ;;
  ta)
    tmux_attach
    ;;
  *)
    exit
    ;;
esac
