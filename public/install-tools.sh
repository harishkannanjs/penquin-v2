
#!/bin/bash

# Penquin Security Tools Installation Script
# Replit-compatible version using pre-built binaries and alternative methods

echo "🐧 Starting Penquin Security Tools Installation (Replit Edition)..."

# Create necessary directories in user space
mkdir -p $HOME/tools/bin
mkdir -p $HOME/.gf
mkdir -p $HOME/wordlists

# Set up PATH for tools
export PATH=$PATH:$HOME/tools/bin

# Download and install pre-compiled tools
echo "📦 Installing pre-compiled security tools..."

# Function to download and install binary
install_binary() {
    local name=$1
    local url=$2
    local filename=$3
    
    echo "  Installing $name..."
    if curl -sL "$url" -o "$HOME/tools/bin/$filename" 2>/dev/null; then
        chmod +x "$HOME/tools/bin/$filename"
        echo "  ✅ $name downloaded successfully"
    else
        echo "  ❌ Failed to download $name"
    fi
}

# Install available pre-built tools using direct binary downloads
echo "  Installing subfinder..."
if curl -sL "https://github.com/projectdiscovery/subfinder/releases/download/v2.8.0/subfinder_2.8.0_linux_amd64.tar.gz" -o "$HOME/tools/bin/subfinder.tar.gz"; then
    cd $HOME/tools/bin && tar -xzf subfinder.tar.gz subfinder && chmod +x subfinder && rm subfinder.tar.gz && cd -
    echo "  ✅ subfinder installed successfully"
else
    echo "  ❌ Failed to install subfinder"
fi

echo "  Installing httpx..."
if curl -sL "https://github.com/projectdiscovery/httpx/releases/download/v1.7.1/httpx_1.7.1_linux_amd64.tar.gz" -o "$HOME/tools/bin/httpx.tar.gz"; then
    cd $HOME/tools/bin && tar -xzf httpx.tar.gz httpx && chmod +x httpx && rm httpx.tar.gz && cd -
    echo "  ✅ httpx installed successfully"
else
    echo "  ❌ Failed to install httpx"
fi

# Install Python tools with simplified approach
echo "🐍 Installing Python-based tools..."
if command -v pip3 >/dev/null 2>&1; then
    pip3 install --user requests beautifulsoup4 || echo "❌ Some Python dependencies failed"
    
    # Install dirsearch manually
    if [ ! -d "$HOME/tools/dirsearch" ]; then
        git clone --depth 1 https://github.com/maurosoria/dirsearch.git $HOME/tools/dirsearch
        echo "✅ dirsearch installed"
    fi
    
    # Install sqlmap manually
    if [ ! -d "$HOME/tools/sqlmap" ]; then
        git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git $HOME/tools/sqlmap
        echo "✅ sqlmap installed"
    fi
else
    echo "⚠️ pip3 not available, skipping Python tools"
fi

# Create simple wrapper scripts
echo "🔧 Creating tool wrappers..."

# Create dirsearch wrapper
cat > $HOME/tools/bin/dirsearch << 'EOF'
#!/bin/bash
cd $HOME/tools/dirsearch && python3 dirsearch.py "$@"
EOF
chmod +x $HOME/tools/bin/dirsearch

# Create sqlmap wrapper
cat > $HOME/tools/bin/sqlmap << 'EOF'
#!/bin/bash
cd $HOME/tools/sqlmap && python3 sqlmap.py "$@"
EOF
chmod +x $HOME/tools/bin/sqlmap

# Download SecLists
echo "⬇️ Downloading SecLists..."
if [ ! -d "$HOME/wordlists/seclists" ]; then
    git clone --depth 1 https://github.com/danielmiessler/SecLists.git $HOME/wordlists/seclists && echo "✅ SecLists downloaded" || echo "❌ Failed to download SecLists"
fi

# Copy wordlists from SecLists (already downloaded)
echo "📝 Setting up common wordlists..."
if [ -d "$HOME/wordlists/seclists" ]; then
    cp "$HOME/wordlists/seclists/Discovery/Web-Content/common.txt" "$HOME/wordlists/common.txt" 2>/dev/null && echo "✅ common.txt ready"
    cp "$HOME/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt" "$HOME/wordlists/directory-list-2.3-medium.txt" 2>/dev/null && echo "✅ directory-list ready"
    cp "$HOME/wordlists/seclists/Discovery/Web-Content/big.txt" "$HOME/wordlists/big.txt" 2>/dev/null && echo "✅ big.txt ready"
else
    echo "❌ SecLists not available for wordlist setup"
fi

# Create some useful command aliases
echo "⚙️ Setting up command shortcuts..."
cat > $HOME/tools/bin/scan-subdomains << 'EOF'
#!/bin/bash
if [ -z "$1" ]; then
    echo "Usage: scan-subdomains <domain>"
    exit 1
fi
echo "🔍 Scanning subdomains for $1..."
if command -v subfinder >/dev/null 2>&1; then
    subfinder -d "$1" -all
else
    echo "❌ subfinder not available"
fi
EOF
chmod +x $HOME/tools/bin/scan-subdomains

cat > $HOME/tools/bin/probe-urls << 'EOF'
#!/bin/bash
if [ -z "$1" ]; then
    echo "Usage: probe-urls <domain>"
    exit 1
fi
echo "🌐 Probing URLs for $1..."
echo "$1" | if command -v httpx >/dev/null 2>&1; then
    httpx -title -status-code -tech-detect
else
    echo "❌ httpx not available"
fi
EOF
chmod +x $HOME/tools/bin/probe-urls

# Update PATH permanently (create .bashrc if it doesn't exist)
touch $HOME/.bashrc 2>/dev/null || true
echo 'export PATH=$PATH:$HOME/tools/bin' >> $HOME/.bashrc 2>/dev/null || echo "⚠️ Could not update .bashrc permanently"

echo ""
echo "✅ Installation completed! Available tools:"
echo "🔍 Recon: subfinder, httpx, scan-subdomains, probe-urls"
echo "🌐 Web: dirsearch, sqlmap"
echo "📁 Wordlists: $HOME/wordlists/"
echo ""
echo "🎯 Quick start examples:"
echo "  scan-subdomains example.com"
echo "  probe-urls example.com"
echo "  dirsearch -u https://example.com"
echo "  sqlmap -u 'https://example.com?id=1'"
echo ""
echo "📁 Wordlists location: $HOME/wordlists/"
echo "🐧 Tools ready for penetration testing!"
echo ""
echo "💡 Note: Tools are installed in $HOME/tools/bin/"
echo "💡 PATH updated automatically for future sessions"
