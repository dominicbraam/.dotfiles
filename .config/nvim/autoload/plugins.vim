call plug#begin('~/.config/nvim/plugged')

	Plug 'scrooloose/nerdtree', { 'on': 'NERDTreeToggle' }

	Plug 'neoclide/coc.nvim', {'branch': 'release'}

	Plug 'vim-airline/vim-airline'
	Plug 'vim-airline/vim-airline-themes'

	Plug 'jiangmiao/auto-pairs'
	Plug 'machakann/vim-sandwich'

	" Plug 'dracula/vim', { 'as': 'dracula' }
	Plug 'arcticicestudio/nord-vim'

call plug#end()
