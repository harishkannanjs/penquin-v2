# Overview

Penquin is a comprehensive bug bounty and cybersecurity toolkit designed to streamline security research workflows. The platform combines a Next.js-based web application with an interactive terminal, pre-built security commands, browser extensions, educational writeups, and a component CLI system. It serves as a centralized hub for security researchers to access tools, learn techniques, and execute reconnaissance and vulnerability testing workflows.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Next.js 15 with React 19, using TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system variables and dark/light theme support
- **UI Components**: Custom component library built with Radix UI primitives and class-variance-authority for consistent styling
- **Animation**: Motion (Framer Motion) for smooth interactions and page transitions
- **Documentation**: Fumadocs for MDX-based documentation rendering with search capabilities
- **State Management**: React Context for theme management, local state for component interactions

## Backend Architecture
- **API Routes**: Next.js API routes for terminal command execution and search functionality
- **Terminal Backend**: Node.js child_process spawning for executing security tools in a sandboxed environment
- **Static Content**: File-based content management for documentation, commands, and tool configurations
- **Component Registry**: JSON-based registry system for distributing UI components and code snippets

## CLI Tool Architecture
- **Package**: Standalone Node.js CLI tool (`vynk`) for component installation and project initialization
- **Commands**: Commander.js for CLI structure with init, add, and registry management commands
- **Package Management**: Multi-package manager support (npm, yarn, pnpm, bun) using @antfu/ni detection
- **Component Distribution**: HTTP-based registry system for fetching and installing components

## Content Management
- **Documentation**: MDX files with frontmatter for structured content organization
- **Tool Definitions**: JSON configurations for security tools, commands, and browser extensions
- **Component Registry**: Centralized JSON registry with component metadata, dependencies, and file contents
- **Static Assets**: File-based storage for installation scripts and tool configurations

## Security Tool Integration
- **Command Templates**: Pre-configured command templates for popular security tools (subfinder, httpx, nuclei, etc.)
- **Domain Substitution**: Dynamic domain replacement in command templates for personalized reconnaissance
- **Tool Installation**: Automated installation scripts for security tool dependencies
- **Browser Extensions**: Curated collection of security-focused browser extensions with installation links

## Development Workflow
- **Component Development**: Registry-based component system with TypeScript support
- **Build Process**: Automated registry building for component distribution
- **Development Server**: Hot-reload development environment with Turbopack
- **Type Safety**: Full TypeScript coverage with strict type checking

# External Dependencies

## Core Framework Dependencies
- **Next.js**: React framework for full-stack web application
- **React**: Frontend library for component-based UI
- **TypeScript**: Type system for development safety

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI primitives for accessible components
- **Motion (Framer Motion)**: Animation library for interactive elements
- **@tabler/icons-react**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe variant API for components

## Documentation and Content
- **Fumadocs**: Documentation framework for MDX content
- **MDX**: Markdown with JSX for rich content authoring

## CLI and Package Management
- **Commander.js**: CLI framework for component installation tool
- **@antfu/ni**: Universal package manager interface
- **prompts**: Interactive CLI prompts for user input
- **chalk**: Terminal string styling for CLI feedback
- **ora**: Terminal spinners for loading states

## Development and Build Tools
- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing and optimization
- **Vercel Analytics**: Application performance monitoring

## Security Tools (Referenced/Integrated)
- **subfinder**: Subdomain discovery tool
- **httpx**: HTTP toolkit for reconnaissance
- **nuclei**: Vulnerability scanner
- **katana**: Web crawler and spider
- **nmap**: Network discovery and security auditing
- **ffuf**: Web fuzzer for directory and parameter discovery
- **wpscan**: WordPress security scanner
- **arjun**: HTTP parameter discovery tool
- **dalfox**: XSS vulnerability scanner