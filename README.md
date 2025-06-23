# Outspeed AI Voice Assistant

A modern AI voice assistant built with Next.js and powered by Outspeed's Live API. This application demonstrates how to integrate voice capabilities, client-side tools, and system tools into a seamless conversational experience.

## Features

- 🎤 **Realtime Voice Conversation** - Speak directly with the AI assistant
- 🛠️ **Client Tools** - Weather API integration and browser tab management
- ⚙️ **System Tools** - Backend-managed call termination
- 🎨 **Modern UI** - Clean, responsive design with dark mode support
- 🚀 **Built with Next.js** - App Router, TypeScript, and Tailwind CSS

## Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- An Outspeed API key (get one at [dashboard.outspeed.com](https://dashboard.outspeed.com))

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/outspeed-ai/outspeed-next-js-example.git
cd outspeed-next-js-example
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add your API keys:

```bash
# Required: Get your API key from https://dashboard.outspeed.com
OUTSPEED_API_KEY=your_outspeed_api_key_here

# Optional: For weather client tool functionality
NEXT_PUBLIC_OPEN_WEATHER_MAP_API_KEY=your_openweather_api_key_here
```

> **Important**: The `OUTSPEED_API_KEY` is required for the voice assistant to work. Without it, you'll get authentication errors when trying to start a session.

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 5. Open your browser

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## How to Use

1. **Start a Session**: Click the "Start Session" button to begin
2. **Voice Interaction**: Once connected, speak directly to the AI assistant
3. **Client Tools**: The assistant can use get weather and open browser tabs
4. **System Tools**: The assistant can end the call if it identifies the user intent to end the call
5. **End Session**: Click "End Session" to disconnect

## API Keys Setup

### Outspeed API Key (Required)

1. Visit [dashboard.outspeed.com](https://dashboard.outspeed.com)
2. Create an account or log in
3. Generate a new API key
4. Add it to your `.env` file as `OUTSPEED_API_KEY`

### OpenWeatherMap API Key (Optional)

1. Visit [openweathermap.org](https://openweathermap.org/api)
2. Create a free account
3. Generate an API key
4. Add it to your `.env` file as `NEXT_PUBLIC_OPEN_WEATHER_MAP_API_KEY`

## Project Structure

```
outspeed-next-js-example/
├── app/
│   ├── api/
│   │   └── token/
│   │       └── route.ts          # API endpoint for Outspeed authentication
│   ├── config/
│   │   ├── env.client.ts         # Client-side environment variables
│   │   ├── env.server.ts         # Server-side environment variables
│   │   └── tools.ts              # Tool definitions and implementations
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main application page
├── public/                       # Static assets
├── .env                    # Environment variables (create this)
└── README.md                     # This file
```

## Available Tools

### Client Tools

- **get_weather**: Get current weather for any city
- **open_browser_tab**: Open URLs in new browser tabs

### System Tools

- **end_call**: Terminate the voice session (managed by backend)

## Deployment

### Deploy to Vercel

The easiest way to deploy is using the Vercel Platform:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Foutspeed-ai%2Foutspeed-next-js-example)

**Remember to add your environment variables in your Vercel project settings:**

- `OUTSPEED_API_KEY` (required)
- `NEXT_PUBLIC_OPEN_WEATHER_MAP_API_KEY` (optional)

### Other Deployment Options

This Next.js app can be deployed to any platform that supports Node.js:

- Netlify
- Railway
- Render
- DigitalOcean App Platform

## Learn More

- [Outspeed Documentation](https://docs.outspeed.com) - Learn about Outspeed's AI platform
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Outspeed Dashboard](https://dashboard.outspeed.com) - Manage your API keys and projects

## Troubleshooting

### Common Issues

1. **"OUTSPEED_API_KEY is required" error**

   - Make sure you've created `.env` with your API key
   - Restart your development server after adding the key

2. **401 Unauthorized when starting session**

   - Verify your Outspeed API key is correct
   - Check if your API key has the necessary permissions

3. **Weather tool not working**
   - Add your OpenWeatherMap API key to `.env`
   - The weather tool is optional and won't break the app if missing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](https://opensource.org/license/mit).
