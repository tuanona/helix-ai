# helix-ai

<p align="center">
  <img src="assets/logo.png" alt="helix-ai logo" width="200">
</p>

![Build Status](https://github.com/leona/helix-gpt/actions/workflows/release.yml/badge.svg)

**Multi-AI code assistant language server for [Helix Editor](https://github.com/helix-editor/helix)** with support for:

- 🌟 **Gemini** (Google AI Studio)
- 🤖 **OpenAI** (GPT-3.5, GPT-4)
- ✈️ **GitHub Copilot**
- 💎 **Codeium**
- 🦙 **Ollama** (self-hosted models)

> 📝 _Forked from [helix-gpt](https://github.com/leona/helix-gpt) with Gemini support added_

---

## Features

### Code Completion

When a trigger character is pressed, it requests completion using the entire file as context.
Default triggers: `["{", "(", " "]`, can be overwritten with `--triggerCharacters "{||(|| "`

Use `ctrl+x` to manually trigger completions.

### Code Actions

Press `space+a` to trigger code actions:

- `resolveDiagnostics` - Fix errors/warnings
- `generateDocs` - Add documentation
- `improveCode` - Improve code quality
- `refactorFromComment` - Refactor based on comments
- `writeTest` - Write unit tests

---

## Installation

This project is made for [Bun](https://bun.sh/), but you can also use precompiled binaries.

### With Bun (recommended)

```bash
# Install Bun if not already installed
curl -fsSL https://bun.sh/install | bash

# Clone and run
git clone https://github.com/YOUR_USERNAME/helix-ai.git
cd helix-ai
bun install
```

### Precompiled Binary (Linux x86_64)

```bash
wget https://github.com/leona/helix-gpt/releases/download/0.34/helix-gpt-0.34-x86_64-linux.tar.gz \
-O /tmp/helix-ai.tar.gz \
&& tar -zxvf /tmp/helix-ai.tar.gz \
&& mv helix-gpt-0.34-x86_64-linux /usr/bin/helix-ai \
&& chmod +x /usr/bin/helix-ai
```

---

## Configuration

### Environment Variables

```bash
# Gemini (Google AI Studio) - NEW!
GEMINI_API_KEY=your_api_key         # Get from https://aistudio.google.com/app/apikey
GEMINI_MODEL=gemini-1.5-flash       # or gemini-1.5-pro, gemini-2.0-flash
GEMINI_MAX_TOKENS=8192

# OpenAI
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-3.5-turbo-16k

# Copilot
COPILOT_API_KEY=your_token

# Codeium (optional, has default public key)
CODEIUM_API_KEY=your_api_key

# Ollama (self-hosted)
OLLAMA_ENDPOINT=http://127.0.0.1:11434
OLLAMA_MODEL=codellama

# Select handler
HANDLER=gemini   # gemini/openai/copilot/codeium/ollama
```

### Command Line Arguments

```bash
# Using Gemini
helix-ai --handler gemini --geminiKey YOUR_API_KEY

# Using OpenAI
helix-ai --handler openai --openaiKey YOUR_API_KEY

# Auth Copilot
helix-ai --authCopilot
```

---

## Helix Editor Configuration

Add the following to your Helix configuration file.

### Global Configuration

Edit `~/.config/helix/languages.toml` (Linux/macOS) or `%AppData%\helix\languages.toml` (Windows):

```toml
# Define helix-ai language server
[language-server.helix-ai]
command = "helix-ai"
# Or with Bun:
# command = "bun"
# args = ["run", "/path/to/helix-ai/src/app.ts"]

# Add to your desired languages
[[language]]
name = "typescript"
language-servers = ["typescript-language-server", "helix-ai"]

[[language]]
name = "javascript"
language-servers = ["typescript-language-server", "helix-ai"]

[[language]]
name = "python"
language-servers = ["pylsp", "helix-ai"]

[[language]]
name = "rust"
language-servers = ["rust-analyzer", "helix-ai"]

[[language]]
name = "go"
language-servers = ["gopls", "helix-ai"]
```

### Project-Specific Configuration

Create `.helix/languages.toml` in your project root:

```toml
[language-server.helix-ai]
command = "helix-ai"
args = ["--handler", "gemini", "--geminiKey", "YOUR_API_KEY"]

[[language]]
name = "typescript"
language-servers = ["typescript-language-server", "helix-ai"]
```

### Using Environment Variables with Helix

Create a wrapper script `~/.local/bin/helix-ai`:

```bash
#!/bin/bash
export GEMINI_API_KEY="your_api_key_here"
export HANDLER="gemini"
exec /path/to/helix-ai "$@"
```

Make it executable: `chmod +x ~/.local/bin/helix-ai`

---

## Getting API Keys

### Gemini (Google AI Studio)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and set `GEMINI_API_KEY`

### OpenAI

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Set `OPENAI_API_KEY`

### Copilot

```bash
helix-ai --authCopilot
```

---

## Docker

### Development

```bash
docker-compose up dev
```

### Build

```bash
docker-compose run build
```

---

## Troubleshooting

Check log files if there are any issues:

```bash
# Helix log
tail -f ~/.cache/helix/helix.log

# helix-ai log
tail -f /app/helix-ai.log  # or wherever --logFile is set
```

---

## Development

```bash
# Clone
git clone https://github.com/tuanona/helix-ai.git
cd helix-ai

# Install dependencies
bun install

# Run
bun run dev

# Test
bun test

# Build binary
bun run build:bin

# Build minified JS
bun run build:smol
```

---

## Credits

- [leona/helix-gpt](https://github.com/leona/helix-gpt) - Original project
- [rsc1975](https://github.com/rsc1975/bun-docker) - Bun Dockerfile

---

## License

MIT License
