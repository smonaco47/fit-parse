
import { GoogleGenAI, Type } from "@google/genai";
import { WorkoutSet } from "../types";

export const extractWorkoutData = async (base64Data: string, mimeType: string): Promise<WorkoutSet[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const isVideo = mimeType.startsWith('video/');
  const fileDescription = isVideo ? 'screen recording of a workout app' : 'PDF workout summary';

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
        {
          text: `You are looking at a ${fileDescription}. 
          Extract all individual workout sets shown. 
          Important: If this is a video, watch the entire duration carefully as it may scroll through multiple dates or exercises.
          
          For each set, provide:
          - date: The date of the workout (in YYYY-MM-DD format). If multiple dates appear (e.g., Dec 09 and Dec 12), capture each set under its correct date.
          - exercise: The name of the exercise.
          - weight: The weight used (e.g., '10 lb', '50 kg'). If no weight is specified (bodyweight), use '0' or 'BW'.
          - reps: The number of repetitions (integer). If duration is given (e.g., '30 sec'), convert or note it in the reps or notes field accordingly, but return an integer for reps if possible.
          - set_number: The sequential number of the set for that specific exercise (1, 2, 3...).
          - notes: Any additional info like RPE, "Personal Best", or specific variations.
          
          Return an array of these objects in JSON format.`
        }
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            exercise: { type: Type.STRING },
            weight: { type: Type.STRING },
            reps: { type: Type.INTEGER },
            set_number: { type: Type.INTEGER },
            notes: { type: Type.STRING },
          },
          required: ["date", "exercise", "weight", "reps", "set_number", "notes"],
        },
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No data extracted from file.");
  }

  try {
    return JSON.parse(text) as WorkoutSet[];
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Failed to parse workout data. The model response was not valid JSON.");
  }
};
