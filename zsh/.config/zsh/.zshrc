# To see load times of different objects in zshrc,
# uncomment the following line along with the line at the end
# of this file.
# zmodload zsh/zprof

# For additional debugging, use the following command in your terminal
# when loading zsh to see your startup time: time `/bin/zsh -i -c exit`

# More lazyloading tips: https://sumercip.com/posts/lazyload-zsh/

# Language
export LC_ALL=en_GB.UTF-8
export LC_CTYPE=en_GB.UTF-8

# Load colours
autoload -U colors && colors

# Basic auto/tab completion
# autoload -U compinit
# zstyle ':completion:*' menu select
# zmodload zsh/complist
# compinit
# _comp_options+=(globdots)

# Autocomplete (taking the place of compinit)
# This needs to be close to the top
source /usr/share/zsh/plugins/zsh-autocomplete/zsh-autocomplete.plugin.zsh

# History
HISTSIZE=10000
SAVEHIST=10000
HISTFILE="$HOME/.cache/zsh/histfile"
HIST_STAMPS='yyyy-mm-dd'

setopt autocd
bindkey -v

zstyle :compinstall filename '/home/dominic/.zshrc'

# Default text editor
export EDITOR='nvim'
export VISUAL='nvim'

# Startup commands
# neofetch
# pfetch

# Prompt
# source /usr/share/zsh/plugins/zsh-git-prompt/zshrc.sh
# PS1="[%n@%m]%~$ "
# RPROMPT='$(git_super_status) %B[%F{#f1fa8c}%~%f][%F{#ff5555}%n%f @ %M]%b'
# PROMPT='%{$fg[green]%}%B%n%{$reset_color%} in %{$fg[cyan]%}%B%~ %{$reset_color%} > '
# PROMPT="%F{green}%n%f in %F{cyan}%~%f > "
# RPROMPT='%w | %T'
# PROMPT='%B%F{#50fa7b}>%f%b '
# TIMEFMT=$'\n================\nCPU\t%P\nuser\t%*U\nsystem\t%*S\ntotal\t%*E'

# $PATH
path+=("$HOME/.local/bin")
path+=("$HOME/.local/share/gem/ruby/3.0.0/bin")
path+=("$HOME/.local/share/cargo/bin")

# recommended from xdg-ninja
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_STATE_HOME="$HOME/.local/state"
export XDG_CACHE_HOME="$HOME/.cache"

# env variables
export MYSQL_HISTFILE="$HOME/.cache/mysql/mysql_history"
export PYTHONHISTORY="$HOME/.cache/python/python_history"
export LESSHISTFILE="$XDG_CACHE_HOME"/less/history
export PYLINTHOME="$HOME/.config/pylint.d"
export KDEHOME="$HOME/.config/kdehome"
export CARGO_HOME="$XDG_DATA_HOME"/cargo
export RUSTUP_HOME="$XDG_DATA_HOME"/rustup
export DOCKER_CONFIG="$XDG_CONFIG_HOME"/docker
export GNUPGHOME="$XDG_DATA_HOME"/gnupg
export GTK2_RC_FILES="$XDG_CONFIG_HOME"/gtk-2.0/gtkrc
export _JAVA_OPTIONS=-Djava.util.prefs.userRoot="$XDG_CONFIG_HOME"/java
export PYTHONSTARTUP="${XDG_CONFIG_HOME}/python/pythonrc"
export KERAS_HOME="${XDG_STATE_HOME}/keras"
export BUNDLE_USER_CONFIG="$XDG_CONFIG_HOME"/bundle
export BUNDLE_USER_CACHE="$XDG_CACHE_HOME"/bundle
export BUNDLE_USER_PLUGIN="$XDG_DATA_HOME"/bundle
export SQLITE_HISTORY="$XDG_CACHE_HOME"/sqlite_history
export GOPATH="$XDG_CACHE_HOME"/go
export GTK2_RC_FILES="$XDG_CONFIG_HOME"/gtk-2.0/gtkrc
export OLLAMA_MODELS="$XDG_DATA_HOME/ollama/models"
# compinit -d "$XDG_CACHE_HOME"/zsh/zcompdump-"$ZSH_VERSION" # replaced by zsh-autocomplete plugin

# Java + non-reparenting WM issue. Java AWT thinks the WM is “weird” and never maps the window unless you set that hint.
export _JAVA_AWT_WM_NONREPARENTING=1

# Aliases
# alias ls='ls --color=auto'
alias ls='exa --icons --group-directories-first'
# alias la='ls -A'
alias la='exa --icons --group-directories-first -a -a'
# alias ll='ls -lh'
alias ll='exa --icons --group-directories-first -l -g --git'
alias v='nvim'
alias grep='grep --colour=auto'
alias mydot="cd $HOME/.dotfiles/"
alias cat='bat'
alias df='duf'
alias du='dua'
alias powershell='echo This is an alias for pwsh && pwsh'
alias rm='echo Use the full path i.e. '/bin/rm', consider using trash i.e. trash-cli. Do not forget the Jupyter Notebook incident!!'
alias cpc='xclip -sel c < '
alias wget=wget --hsts-file="$XDG_DATA_HOME/wget-hsts"

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

# Install plugins with package manager because it will be easier to maintain

# Vi Mode
source /usr/share/zsh/plugins/zsh-vi-mode/zsh-vi-mode.plugin.zsh

# you-should-use - it gives a prompt when an alias is available for that task
source /usr/share/zsh/plugins/zsh-you-should-use/you-should-use.plugin.zsh

# Auto suggestions
source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh

# bash-zsh-insulter
if [ -f /etc/bash.command-not-found ]; then
	. /etc/bash.command-not-found
fi

# the starship prompt
eval "$(starship init zsh)"

# Load zsh syntax highlighting. MUST BE LAST THING IN .zshrc
source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

###############################
# Lazy conda
# Taken from this reddit post: https://www.reddit.com/r/zsh/comments/qmd25q/lazy_loading_conda/
# Anaconda will not load until one of the commands in lazy_conda_aliases is used.

# Add any commands which depend on conda here
lazy_conda_aliases=('python' 'conda')

load_conda() {
	for lazy_conda_alias in $lazy_conda_aliases; do
		unalias $lazy_conda_alias
	done

	# conda init edit: for a better (but not the best) solution for cross device support
	MINICONDA3_DIR="${HOME}/.local/lib/miniconda3"

	# >>> conda initialize >>>
	# !! Contents within this block are managed by 'conda init' !!
	__conda_setup="$("${MINICONDA3_DIR}/bin/conda" 'shell.zsh' 'hook' 2>/dev/null)"
	if [ $? -eq 0 ]; then
		eval "$__conda_setup"
	else
		if [ -f "${MINICONDA3_DIR}/etc/profile.d/conda.sh" ]; then
			. "${MINICONDA3_DIR}/etc/profile.d/conda.sh"
		else
			export PATH="${MINICONDA3_DIR}/bin:$PATH"
		fi
	fi
	unset __conda_setup
	# <<< conda initialize <<<

	unset __conda_prefix
	unfunction load_conda
}

for lazy_conda_alias in $lazy_conda_aliases; do
	alias $lazy_conda_alias="load_conda && $lazy_conda_alias"
done
###############################

# Uncomment line below for debug.
# See instructions at the top of this file.
# zprof
