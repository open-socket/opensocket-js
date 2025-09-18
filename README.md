# OpenSocket JavaScript SDK

> 🔌 Vendor-agnostic real-time communication for JavaScript/TypeScript

[![CI](https://github.com/open-socket/opensocket-js/actions/workflows/ci.yml/badge.svg)](https://github.com/open-socket/opensocket-js/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@open-socket/core)](https://www.npmjs.com/package/@open-socket/core)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## Overview

OpenSocket provides a unified API for real-time communication across multiple providers (Pusher, Ably, Socket.io, etc.), allowing you to switch providers without changing your application code.

## 🚀 Quick Start

```bash
npm install @open-socket/core
```

```typescript
import { createOpenSocket } from '@open-socket/core';
import { PusherProvider } from '@open-socket/provider-pusher';

// Initialize with your chosen provider
const socket = await createOpenSocket({
  provider: new PusherProvider({
    key: 'your-pusher-key',
    cluster: 'us2'
  })
});

// Connect to the provider
await socket.connect();

// Subscribe to a channel
const channel = socket.channel('my-channel');

// Listen for messages
await channel.subscribe('my-event', (message) => {
  console.log('Received:', message.data);
});

// Publish messages
await channel.publish('my-event', { 
  text: 'Hello, real-time world!' 
});
```

## 📦 Packages

This monorepo contains the following packages:

| Package | Description | Version |
|---------|-------------|---------|
| [`@open-socket/core`](./packages/core) | Core abstractions and interfaces | ![npm](https://img.shields.io/npm/v/@open-socket/core) |
| [`@open-socket/testing-utils`](./packages/testing-utils) | Testing utilities and mock provider | ![npm](https://img.shields.io/npm/v/@open-socket/testing-utils) |

### Provider Packages (Coming Soon)

- `@open-socket/provider-pusher` - Pusher adapter
- `@open-socket/provider-ably` - Ably adapter  
- `@open-socket/provider-socketio` - Socket.io adapter

### Framework Packages (Coming Soon)

- `@open-socket/react` - React hooks and components
- `@open-socket/vue` - Vue composables
- `@open-socket/angular` - Angular services

## ✨ Features

- **Vendor Agnostic**: Switch between providers with a single config change
- **Type Safe**: Full TypeScript support with strict typing
- **Lightweight**: Core package <10KB gzipped
- **Extensible**: Middleware system for customization
- **Well Tested**: Comprehensive test suite for all providers
- **Modern**: ES modules, tree-shaking, async/await

## 🔄 Switching Providers

One of the key benefits of OpenSocket is the ability to switch providers easily:

```typescript
// Using Pusher
const socket = await createOpenSocket({
  provider: new PusherProvider({ key: 'pusher-key' })
});

// Switch to Ably (same API!)
const socket = await createOpenSocket({
  provider: new AblyProvider({ key: 'ably-key' })
});

// Switch to Socket.io (same API!)
const socket = await createOpenSocket({
  provider: new SocketIOProvider({ url: 'http://localhost:3000' })
});
```

## 🧪 Testing

OpenSocket includes comprehensive testing utilities:

```typescript
import { MockProvider, createProviderTestSuite } from '@open-socket/testing-utils';

// Use the mock provider for testing
const mockProvider = new MockProvider();
const socket = await createOpenSocket({ provider: mockProvider });

// Simulate events
mockProvider.simulateMessage('channel', 'event', { test: true });

// Run the standard test suite against your provider
createProviderTestSuite(() => new YourProvider(), 'YourProvider');
```

## 🏗️ Architecture

OpenSocket uses a layered architecture:

```
Application Code
     ↓
OpenSocket API (unified interface)
     ↓
Provider Interface (abstraction)
     ↓
Provider Adapter (implementation)
     ↓
Native Provider SDK
```

## 🛠️ Development

This project uses pnpm workspaces and Turborepo:

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run in development mode
pnpm dev

# Lint and format
pnpm lint
pnpm format
```

## 📊 Provider Feature Matrix

| Feature | Pusher | Ably | Socket.io |
|---------|--------|------|-----------|
| Public Channels | ✅ | ✅ | ✅ |
| Private Channels | ✅ | ✅ | ✅ |
| Presence | ✅ | ✅ | ✅ |
| Message History | ❌ | ✅ | ⚠️ |
| Binary Data | ❌ | ✅ | ✅ |
| Acknowledgments | ❌ | ✅ | ✅ |

## 🔌 Middleware

Extend OpenSocket with custom middleware:

```typescript
const loggingMiddleware = {
  name: 'logging',
  pre: async (context) => {
    console.log('Before:', context.operation);
  },
  post: async (context) => {
    console.log('After:', context.operation);
  },
  error: async (error, context) => {
    console.error('Error:', error);
  }
};

socket.use(loggingMiddleware);
```

## 📚 Documentation

- [Getting Started Guide](https://docs.opensocket.dev/getting-started)
- [API Reference](https://docs.opensocket.dev/api)
- [Provider Guides](https://docs.opensocket.dev/providers)
- [Migration Guide](https://docs.opensocket.dev/migration)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

OpenSocket is inspired by:
- [OpenFeature](https://openfeature.dev/) for the vendor-agnostic approach
- The real-time communication community

## 🔗 Links

- [Website](https://opensocket.dev)
- [GitHub](https://github.com/open-socket/opensocket-js)
- [NPM](https://www.npmjs.com/org/open-socket)
- [Discord](https://discord.gg/opensocket)

---

<p align="center">Built with ❤️ by the OpenSocket community</p>