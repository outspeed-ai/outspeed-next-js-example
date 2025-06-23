import { type FunctionDefinition, type SystemToolConfig } from "@outspeed/client";
import axios from "axios";

import { env } from "./env.client";

/**
 * This is a mapping of tool names and their function definitions.
 * The model will use these definitions to call the actual functions.
 */
export const CLIENT_TOOL_SCHEMAS: Record<string, FunctionDefinition> = {
  get_weather: {
    name: "get_weather",
    type: "function",
    description: "Get the current weather",
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "The city, e.g. San Francisco",
        },
      },
      required: ["city"],
    },
  },
  open_browser_tab: {
    name: "open_browser_tab",
    type: "function",
    description: "Open a new browser tab",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL to open",
        },
      },
      required: ["url"],
    },
  },
};

/**
 * Uses the OpenWeatherMap API to get the current weather for a given city.
 *
 * @returns The weather data
 */
export async function getWeather({ city }: { city: string }) {
  try {
    if (!env.OPEN_WEATHER_MAP_API_KEY) {
      throw new Error("OPEN_WEATHER_MAP_API_KEY is not set");
    }

    const url = new URL("https://api.openweathermap.org/data/2.5/weather");
    url.searchParams.set("q", city);
    url.searchParams.set("appid", env.OPEN_WEATHER_MAP_API_KEY);
    url.searchParams.set("units", "imperial"); // to get the temperature in Fahrenheit
    const response = await axios.get(url.toString());
    return response.data;
  } catch (error) {
    console.error(error);
    return error instanceof Error ? error.message : "Unable to get weather";
  }
}

/**
 * This function just opens a new browser tab. It's not very useful,
 * but it's a good example of a tool. Like tell it to open Outspeed's
 * website, it will open it in a new tab.
 *
 * @returns A message indicating whether the browser tab was opened successfully
 */
export function openBrowserTab({ url }: { url: string }) {
  try {
    console.log("Opening browser tab", url);

    const result = window.open(url, "_blank");
    if (result) {
      return "Browser tab opened";
    } else {
      return "Unable to open browser tab. Tell the user to allow popups.";
    }
  } catch (error) {
    console.error(error);
    return error instanceof Error ? error.message : "Unable to open browser tab";
  }
}

/**
 * This is a mapping of tool names and actual functions that would be called when the model uses the tool
 */
export const clientTools = {
  get_weather: getWeather,
  open_browser_tab: openBrowserTab,
};

/**
 * System tools are pre-defined tools that will be executed on the server.
 */
export const systemTools: SystemToolConfig[] = [{ name: "end_call", enabled: true }];
