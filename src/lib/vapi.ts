import Vapi from "@vapi-ai/web";

const vapiPublicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;

if (!vapiPublicKey) {
  throw new Error("Missing VAPI_PUBLIC_KEY environment variable");
}

export const vapi = new Vapi(vapiPublicKey);

export const startCall = async (assistantId?: string) => {
  try {
    await vapi.start(assistantId);
  } catch (error) {
    console.error("Error starting call:", error);
  }
};

export const endCall = async () => {
  try {
    await vapi.stop();
  } catch (error) {
    console.error("Error ending call:", error);
  }
};
