"use client";

import { type SessionConfig } from "@outspeed/client";
import { useConversation } from "@outspeed/react";
import Image from "next/image";
import { useState } from "react";

import { CLIENT_TOOL_SCHEMAS, clientTools, systemTools } from "@/app/config/tools";

const getEphemeralKeyFromServer = async (config: SessionConfig) => {
  const tokenResponse = await fetch("/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });

  const data = await tokenResponse.json();
  if (!tokenResponse.ok) {
    throw new Error("Failed to get ephemeral key");
  }

  return data.client_secret.value;
};

const SYSTEM_PROMPT = `
You are a helpful but witty assistant for Outspeed.

Outspeed is a platform that allows you to build AI voice companions with emotions and memory.
Use Outspeed Live API to quickly deploy unlimited voice companions that scale with your users, only at $1/hr (includes LLM).

Website: https://outspeed.com
`;

const sessionConfig: SessionConfig = {
  model: "outspeed-v1",
  instructions: SYSTEM_PROMPT,
  voice: "sophie", // find more voices at https://dashboard.outspeed.com (this will be improved soon!)
  temperature: 0.5,
  turn_detection: {
    type: "semantic_vad",
  },
  tools: Object.values(CLIENT_TOOL_SCHEMAS), // this makes the tools available to the model
  first_message: "Hello, how can I assist you with Outspeed today?",
  system_tools: systemTools,
};

export default function Home() {
  const [sessionCreated, setSessionCreated] = useState(false);

  const conversation = useConversation({
    sessionConfig: sessionConfig,
    clientTools, // this is a mapping of tool names and actual functions that would be called when the model uses the tool
    onDisconnect: () => {
      console.log("Disconnected! cleaning up...");
      endSession();
    },
  });

  const startSession = async () => {
    try {
      const ephemeralKey = await getEphemeralKeyFromServer(sessionConfig);

      await conversation.startSession(ephemeralKey);

      // call after startSession to ensure the session is created
      conversation.on("session.created", (event) => {
        console.log("session.created", event);
        setSessionCreated(true);
      });

      // listen to all events from the server
      conversation.on("*", (event) => {
        console.log("event received from server", event);
      });

      setSessionCreated(true);
    } catch (error) {
      console.error("Error starting session", error);
    }
  };

  const endSession = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error("Error ending session", error);
    } finally {
      setSessionCreated(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Deploy Button - Fixed Top Right */}
      <div className="fixed top-4 right-4 z-10">
        <a
          href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Foutspeed-ai%2Foutspeed-next-js-example"
          target="_blank"
        >
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-3 mb-6">
              <Image src="/outspeed-logo.png" alt="Outspeed logo" width={32} height={32} priority />
              <span className="text-2xl text-gray-400">×</span>
              <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={120} height={26} priority />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Voice Assistant</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
              {"Powered by Outspeed's Live API with voice capabilities and intelligent tools"}
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                  sessionCreated
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${sessionCreated ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                ></div>
                {sessionCreated ? "Session Active" : "Ready to Connect"}
              </div>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {sessionCreated ? "Voice Assistant is Live" : "Start Your Session"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                {sessionCreated
                  ? "You can now speak with the AI assistant"
                  : "Click the button below to begin your conversation"}
              </p>

              {sessionCreated ? (
                <button
                  onClick={endSession}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  End Session
                </button>
              ) : (
                <button
                  onClick={startSession}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Start Session
                </button>
              )}
            </div>
          </div>

          <ToolsList />
        </div>
      </div>
    </div>
  );
}

function ToolsList() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">Available Tools</h3>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Client Tools */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h4 className="font-medium text-gray-900 dark:text-white">Client Tools</h4>
          </div>
          <div className="space-y-2">
            {Object.keys(CLIENT_TOOL_SCHEMAS).map((toolName) => (
              <div key={toolName} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">{toolName}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {CLIENT_TOOL_SCHEMAS[toolName].description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Tools */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h4 className="font-medium text-gray-900 dark:text-white">System Tools</h4>
          </div>
          <div className="space-y-2">
            {systemTools
              .filter((tool) => tool.enabled !== false)
              .map((tool) => (
                <div key={tool.name} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="font-medium text-sm text-gray-900 dark:text-white">{tool.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Backend system tool</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
