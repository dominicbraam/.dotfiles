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
HISTFILE=$HOME/.cache/zsh/histfile
HIST_STAMPS='yyyy-mm-dd'

setopt autocd
bindkey -v

zstyle :compinstall filename '/home/dominic/.zshrc'

# Default text editor
export EDITOR='nvim'
export VISUAL='nvim'

# Startup commands
# neofetch
pfetch

# Prompt
source /usr/share/zsh/plugins/zsh-git-prompt/zshrc.sh
# PS1="[%n@%m]%~$ "
RPROMPT='$(git_super_status) %B[%F{#f1fa8c}%~%f][%F{#ff5555}%n%f @ %M]%b'
# PROMPT='%{$fg[green]%}%B%n%{$reset_color%} in %{$fg[cyan]%}%B%~ %{$reset_color%} > '
# PROMPT="%F{green}%n%f in %F{cyan}%~%f > "
# RPROMPT='%w | %T'
PROMPT='%B%F{#50fa7b}>%f%b '
# TIMEFMT=$'\n================\nCPU\t%P\nuser\t%*U\nsystem\t%*S\ntotal\t%*E'

# Aliases
alias ls='ls --color=auto'
alias la='ls -A'
alias ll='ls -lh'
alias v='nvim'

# $PATH
path+=('/home/dominic/.local/bin')
path+=('/home/dominic/.local/share/gem/ruby/3.0.0/bin')

# env variables
export MYSQL_HISTFILE="$HOME/.cache/mysql/mysql_history"
export PYTHONHISTORY="$HOME/.cache/python/python_history"
export LESSHISTFILE="$HOME/.cache/less/lesshst"
export PYLINTHOME="$HOME/.config/pylint.d"

# command exec time
source /usr/share/zsh/plugins/zsh-command-time/command-time.plugin.zsh
# If command execution time above min. time, plugins will not output time.
ZSH_COMMAND_TIME_MIN_SECONDS=0
# Message to display (set to "" for disable).
ZSH_COMMAND_TIME_MSG="Exec time: %s"
# Message color.
# ZSH_COMMAND_TIME_COLOR="cyan"
# Exclude some commands
ZSH_COMMAND_TIME_EXCLUDE=(ls nvim cd)

# Auto suggestions
source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh

# Load zsh syntax highlighting. MUST BE LAST THING IN .zshrc
source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
