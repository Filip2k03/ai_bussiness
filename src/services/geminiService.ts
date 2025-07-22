import { GoogleGenAI, Type } from "@google/genai";
import { TaskType } from "../types";
import { TASKS } from "../constants";
import Constants from 'expo-constants';

const apiKey = Constants.expoConfig?.extra?.GEMINI_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY environment variable not found. App will not be able to connect to Gemini API.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const getSystemInstruction = (task: TaskType): string => {
  switch (task) {
    case TaskType.KEY_INSIGHTS:
      return "You are an expert business analyst. Analyze the following text and extract the most important trends, sentiments, pain points, or opportunities. Present the output in a clear, structured format using markdown with headings for each key area.";
    case TaskType.SWOT:
      return "You are an expert business strategist. Analyze the following business information and generate a detailed SWOT analysis (Strengths, Weaknesses, Opportunities, Threats). Use markdown headings for each section (e.g., '## Strengths'). Under each heading, provide a bulleted list of points.";
    case TaskType.CONTENT_ENHANCER:
      return "You are an expert copywriter and editor. Analyze the following text for clarity, tone, and impact. Provide a section with '### Suggestions' for improvement, followed by a '### Rewritten Version' of the text with the suggested improvements applied. Use markdown for formatting.";
    case TaskType.HUMANIZE_TEXT:
      return "You are an expert in communication with a high degree of emotional intelligence. Rewrite the user's text to sound more natural, empathetic, and human. Focus on clarity, warmth, and connection. Provide a '### Rewritten Version' with the improvements. Use markdown for formatting.";
    case TaskType.CODE_GENERATOR:
      return "You are an expert programmer and senior software engineer. Generate clean, efficient, and well-documented code based on the user's request. Explain the code and provide usage examples. Format the code blocks using markdown's triple backticks.";
    case TaskType.CODE_DEBUGGER:
      return "You are an expert software developer specializing in debugging. Analyze the provided code snippet and error message. Identify the bug, explain the cause, and provide a corrected version of the code. Format your response clearly with headings for '### Analysis', '### The Bug', and '### Corrected Code'. Use markdown for code blocks.";
    case TaskType.DIAGRAM_AI:
      return "You are an expert in software architecture and UML design. Based on the user's description, generate a UML Class Diagram using Mermaid.js syntax. CRITICAL: Your entire response must ONLY be the Mermaid syntax inside a ```mermaid code block. Do not include any other text, explanations, or formatting outside of the code block.";
    case TaskType.IMAGE_ANALYSIS:
      return "You are an expert image analyst. Based on the user's prompt and the provided image, give a detailed analysis. If no prompt is given, provide a general description of the image. Identify objects, people, settings, and any visible text. Format your response using markdown.";
    case TaskType.VIDEO_ANALYSIS:
       return "You are an expert media analyst. The user has provided a video file and an optional prompt. You will be given a single frame from the middle of the video. Analyze this frame based on the user's prompt. If no prompt is given, provide a general description of what is happening in the frame. Identify objects, people, and the setting. Format your response using markdown.";
    default:
      return "You are a helpful assistant.";
  }
};

const fileToGenerativePart = async (file: any) => {
  // For React Native, we need to handle file differently
  const response = await fetch(file.uri);
  const blob = await response.blob();
  
  return new Promise<any>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64,
          mimeType: file.mimeType || 'image/jpeg',
        },
      });
    };
    reader.readAsDataURL(blob);
  });
};

export const generateInsights = async (taskType: TaskType, text: string, file: any): Promise<string | string[]> => {
  if (!apiKey) {
    throw new Error("API key is not configured. Please set the EXPO_PUBLIC_GEMINI_API_KEY environment variable.");
  }

  const taskInfo = TASKS.find(t => t.id === taskType);
  if (!taskInfo) throw new Error("Invalid task selected.");
  
  if (taskType === TaskType.STORYBOARD_CREATOR) {
    // 1. Generate scene prompts using a text model
    const directorSystemInstruction = "You are a film director. Based on the user's prompt, create a sequence of exactly 3 distinct, detailed visual scenes that tell a short story. Each scene description should be a vivid prompt for an AI image generator. Return the result as a JSON object with a single key 'scenes' which is an array of strings.";
    
    const textResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: text,
        config: {
            systemInstruction: directorSystemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    scenes: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            }
        }
    });
    
    const parsedResponse = JSON.parse(textResponse.text);
    const prompts: string[] = parsedResponse.scenes;

    if (!prompts || prompts.length === 0) {
        throw new Error("The AI failed to generate storyboard scenes.");
    }
    
    // 2. Generate images for each prompt
    const imagePromises = prompts.map(prompt => 
        ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        })
    );

    const imageResponses = await Promise.all(imagePromises);

    const base64Images = imageResponses.map(res => {
        if (res.generatedImages && res.generatedImages.length > 0) {
            return `data:image/jpeg;base64,${res.generatedImages[0].image.imageBytes}`;
        }
        throw new Error("An image could not be generated for one of the scenes.");
    });

    return base64Images;
  }
  
  // Handle Image Creation task
  if (taskType === TaskType.IMAGE_CREATE) {
      try {
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: text,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
      } else {
        throw new Error("Received no image from the AI.");
      }
    } catch (error) {
      console.error("Error calling Imagen API:", error);
      if (error instanceof Error) {
          throw new Error(`Imagen API Error: ${error.message}`);
      }
      throw new Error("An unexpected error occurred while communicating with the Image AI.");
    }
  }

  // --- Handle all other content generation tasks ---
  const systemInstruction = getSystemInstruction(taskType);
  const model = "gemini-2.5-flash";
  let contents: any;

  if (file && (taskInfo.accepts === 'image' || taskInfo.accepts === 'video')) {
    const textPart = { text: text || "Analyze what you see in the media and describe it." };
    const filePart = await fileToGenerativePart(file);
    contents = { parts: [filePart, textPart] };
  } else {
    contents = text;
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
        topP: 0.95,
        topK: 64,
      },
    });

    if (response && response.text) {
      return response.text;
    } else {
      throw new Error("Received an empty response from the AI.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while communicating with the AI.");
  }
};