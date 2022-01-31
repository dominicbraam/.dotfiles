syntax on
set number relativenumber
set nu rnu
set showtabline=2
set updatetime=300
set clipboard=unnamedplus
syntax enable
set autoindent
set noexpandtab
set tabstop=4
" set softtabstop=4
set shiftwidth=4
set list
set listchars=tab:→\ ,nbsp:·,trail:· ",eol:¬
" colorscheme dracula

set termguicolors
let g:tokyonight_style = 'night' " available: night, storm
let g:tokyonight_enable_italic = 1
colorscheme catppuccin

let g:airline#extensions#tabline#enabled = 1
let g:airline#extensions#tabline#left_sep = ' '
let g:airline#extensions#tabline#left_alt_sep = '|'
let g:python3_host_prog = '/bin/python3'
