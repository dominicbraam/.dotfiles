# Language
export LC_ALL=en_GB.UTF-8
export LC_CTYPE=en_GB.UTF-8

# Load colours
autoload -U colors && colors

# Basic auto/tab completion
autoload -U compinit
zstyle ':completion:*' menu select
zmodload zsh/complist
compinit
_comp_options+=(globdots)

# History
HISTSIZE=10000
SAVEHIST=10000
HISTFILE=$HOME/.cache/zsh/.zsh_history
HIST_STAMPS='yyyy-mm-dd'

# Default text editor
export EDITOR='nvim'
export VISUAL='nvim'

# Startup commands
# neofetch
pfetch

# Prompt
source /usr/share/zsh/plugins/zsh-git-prompt/zshrc.sh
# PS1="[%n@%m]%~$ "
RPROMPT='$(git_super_status) %B[%F{#f1fa8c}%~%f][%F{#ff5555}%n%f]%b'
# PROMPT='%{$fg[green]%}%B%n%{$reset_color%} in %{$fg[cyan]%}%B%~ %{$reset_color%} > '
# PROMPT="%F{green}%n%f in %F{cyan}%~%f > "
# RPROMPT='%w | %T'
PROMPT='%B%F{#50fa7b}>%f%b '

# Aliases
alias ls='ls --color=auto'
alias la='ls -A'
alias ll='ls -lh'
alias brightnessdisplay="sudo nvim /sys/class/backlight/intel_backlight/brightness"
alias brightnesskb="sudo nvim /sys/class/leds/smc::kbd_backlight/brightness"
alias display500="echo 'echo 500 >> /sys/class/backlight/intel_backlight/brightness' | sudo -s"
alias display1500="echo 'echo 1500 >> /sys/class/backlight/intel_backlight/brightness' | sudo -s"

# $PATH
path+=('/home/dominic/.local/bin')

# env variables
export MYSQL_HISTFILE="$HOME/.cache/mysql/mysql_history"
export PYTHONHISTORY="$HOME/.cache/python/python_history"
export LESSHISTFILE="$HOME/.cache/less/lesshst"
export PYLINTHOME="$HOME/.config/pylint.d"

# Auto suggestions
source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh

# Load zsh syntax highlighting. MUST BE LAST THING IN .zshrc
source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
