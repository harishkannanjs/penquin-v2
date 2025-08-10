
#!/bin/bash

# Penquin Security Tools Installation Script
# This script installs essential penetration testing and bug hunting tools

set -e  # Exit on any error
export DEBIAN_FRONTEND=noninteractive

echo "🐧 Starting Penquin Security Tools Installation..."

# Create necessary directories
mkdir -p /root/go/bin
mkdir -p /usr/share/wordlists
mkdir -p /root/.gf

# Update package lists and install essential packages
echo "📦 Installing essential packages..."
apt-get update -y > /dev/null 2>&1
apt-get install -y curl wget git python3 python3-pip nodejs npm golang-go ruby ruby-dev build-essential libssl-dev libffi-dev python3-dev python3-setuptools unzip > /dev/null 2>&1

# Set up Go environment
export GOPATH=/root/go
export GOROOT=/usr/local/go
export PATH=$PATH:/usr/local/go/bin:/root/go/bin

# Install Go tools with proper error handling
echo "🔧 Installing Go-based tools..."
go install github.com/tomnomnom/gau/v2/cmd/gau@latest 2>/dev/null || echo "Failed to install gau"
go install github.com/tomnomnom/assetfinder@latest 2>/dev/null || echo "Failed to install assetfinder"
go install github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest 2>/dev/null || echo "Failed to install subfinder"
go install github.com/projectdiscovery/httpx/cmd/httpx@latest 2>/dev/null || echo "Failed to install httpx"
go install github.com/projectdiscovery/nuclei/v2/cmd/nuclei@latest 2>/dev/null || echo "Failed to install nuclei"
go install github.com/projectdiscovery/katana/cmd/katana@latest 2>/dev/null || echo "Failed to install katana"
go install github.com/tomnomnom/waybackurls@latest 2>/dev/null || echo "Failed to install waybackurls"
go install github.com/tomnomnom/qsreplace@latest 2>/dev/null || echo "Failed to install qsreplace"
go install github.com/hahwul/dalfox/v2@latest 2>/dev/null || echo "Failed to install dalfox"
go install github.com/ffuf/ffuf@latest 2>/dev/null || echo "Failed to install ffuf"
go install github.com/OJ/gobuster/v3@latest 2>/dev/null || echo "Failed to install gobuster"
go install github.com/tomnomnom/httprobe@latest 2>/dev/null || echo "Failed to install httprobe"
go install github.com/projectdiscovery/naabu/v2/cmd/naabu@latest 2>/dev/null || echo "Failed to install naabu"
go install github.com/tomnomnom/gf@latest 2>/dev/null || echo "Failed to install gf"

# Install Python tools
echo "🐍 Installing Python-based tools..."
pip3 install --break-system-packages sqlmap dirsearch paramspider uro arjun sublist3r dnsrecon theHarvester requests beautifulsoup4 > /dev/null 2>&1 || echo "Some Python tools failed to install"

# Install Ruby tools
echo "💎 Installing Ruby-based tools..."
gem install wpscan > /dev/null 2>&1 || echo "Failed to install wpscan"

# Install additional tools via apt
echo "📋 Installing additional tools..."
apt-get install -y nmap dirb nikto hashcat john hydra masscan amass dnsutils whois host dnsutils fierce > /dev/null 2>&1 || echo "Some apt tools failed to install"

# Install Node.js tools
echo "🟢 Installing Node.js tools..."
npm install -g retire js-beautify > /dev/null 2>&1 || echo "Some Node.js tools failed to install"

# Download SecLists
echo "⬇️ Downloading SecLists..."
if [ ! -d "/usr/share/seclists" ]; then
    git clone --depth 1 https://github.com/danielmiessler/SecLists.git /usr/share/seclists > /dev/null 2>&1 || echo "Failed to clone SecLists"
fi

# Download common wordlists
echo "📝 Setting up wordlists..."
if [ ! -f "/usr/share/wordlists/common.txt" ]; then
    wget -q -O /usr/share/wordlists/common.txt https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/common.txt 2>/dev/null || echo "Failed to download common.txt"
fi

# Install gf patterns
echo "🔍 Installing gf patterns..."
if [ ! -d "/root/.gf" ]; then
    git clone --depth 1 https://github.com/tomnomnom/gf.git /tmp/gf > /dev/null 2>&1
    if [ -d "/tmp/gf/examples" ]; then
        cp -r /tmp/gf/examples/* /root/.gf/ 2>/dev/null || echo "Failed to copy gf patterns"
    fi
    rm -rf /tmp/gf
fi

# Update nuclei templates
echo "🧬 Updating nuclei templates..."
if command -v nuclei >/dev/null 2>&1; then
    nuclei -update-templates > /dev/null 2>&1 || echo "Failed to update nuclei templates"
fi

# Make binaries executable
chmod +x /root/go/bin/* 2>/dev/null || echo "Failed to set permissions"

# Update PATH permanently
echo 'export PATH=$PATH:/root/go/bin:/usr/local/go/bin' >> /root/.bashrc

echo "✅ Installation completed! Available tools:"
echo "🔍 Recon: subfinder, assetfinder, httpx, httprobe, katana, gau"
echo "🛡️ Security: nuclei, nmap, wpscan, nikto, sqlmap"
echo "🌐 Web: ffuf, gobuster, dirb, dirsearch"
echo "🔧 Utils: gf, qsreplace, waybackurls, dalfox"
echo ""
echo "🐧 All tools are ready for penetration testing!"
