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
" set background=dark " or light if you want light mode
" colorscheme onedarkpro

lua << EOF
local onedarkpro = require("onedarkpro")
onedarkpro.setup({
theme = "onedark_dark"
})
onedarkpro.load()

EOF

set termguicolors
" let g:tokyonight_style = 'night' " available: night, storm
" let g:tokyonight_enable_italic = 1

let g:airline#extensions#tabline#enabled = 1
let g:airline_theme='base16'
let g:airline#extensions#tabline#left_sep = ' '
let g:airline#extensions#tabline#left_alt_sep = '|'
let g:python3_host_prog = '/bin/python3'
