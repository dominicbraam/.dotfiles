call plug#begin('~/.config/nvim/plugged')


    " For file browser
    Plug 'scrooloose/nerdtree', { 'on': 'NERDTreeToggle' }

	Plug 'neoclide/coc.nvim', {'branch': 'release'}

	" Layout for neovim
	Plug 'vim-airline/vim-airline'
	Plug 'vim-airline/vim-airline-themes'

	Plug 'jiangmiao/auto-pairs'
	Plug 'machakann/vim-sandwich'

	" Plug 'dracula/vim', { 'as': 'dracula' }
	" Plug 'arcticicestudio/nord-vim'
	" Plug 'tiagovla/tokyodark.nvim'
	" Plug 'ghifarit53/tokyonight-vim'
	" Plug 'catppuccin/nvim', {'as': 'catppuccin'}
	" Plug 'shaunsingh/solarized.nvim'
	Plug 'ellisonleao/gruvbox.nvim'
	Plug 'olimorris/onedarkpro.nvim'

	" To get terminal within neovim
	Plug 'akinsho/toggleterm.nvim'

	" For fuzzy search (mainly for telescope)
	Plug 'nvim-telescope/telescope-fzf-native.nvim', { 'do': 'make' }

	" Telescope
	Plug 'nvim-lua/plenary.nvim'
	Plug 'nvim-telescope/telescope.nvim'

	" Lazygit
	Plug 'kdheepak/lazygit.nvim'

	call plug#end()
