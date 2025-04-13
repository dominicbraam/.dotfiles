local handle = io.popen("secret-tool lookup apikey openai-shell-cli")
if not handle then
    error("Error: io.popen returned nil")
end
local token = handle:read("*a")
handle:close()

local opts = {
    backend = "openai",
    model = "o3-mini",
    open_ai_token = token,
}

require("oatmeal").setup(opts)
