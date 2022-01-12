nnoremap tn :tabnew<Space>

nnoremap tk :tabnext<CR>
nnoremap tj :tabprev<CR>

nnoremap th :tabfirst<CR>
nnoremap tl :tablast<CR>

inoremap <Up> <Nop>
inoremap <Down> <Nop>
inoremap <Left> <Nop>
inoremap <Right> <Nop>
nnoremap <Right> <Nop>
nnoremap <Right> <Nop>
nnoremap <Right> <Nop>
nnoremap <Right> <Nop>

" Toggle file tree
nnoremap <leader>ft <cmd>NERDTreeToggle<cr>

" Find files using Telescope command-line sugar.
nnoremap <leader>ff <cmd>Telescope find_files theme=dropdown<cr>
nnoremap <leader>fg <cmd>Telescope live_grep<cr>
nnoremap <leader>fb <cmd>Telescope buffers<cr>
nnoremap <leader>fh <cmd>Telescope help_tags<cr>

" Toggle terminal
nnoremap <leader>tt <cmd>ToggleTerm direction=float<cr>

" Execute programs
 nnoremap <leader>xp <cmd>py3f %<CR>
