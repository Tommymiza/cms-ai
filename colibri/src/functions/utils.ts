import axios from "@/lib/axios";
import { toast } from "sonner";

export default function utilsTool() {
  const token = sessionStorage.getItem("token") || "";
  const generateImage = async (toolCall: {
    toolName: string;
    toolCallId: string;
    input: any;
  }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const { description } = toolCall.input as { description: string };
      const url = await createImage(description);
      return `Voici l'image créée :\n\n![${description}](${url})`;
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue lors de la génération de l’image");
      throw new Error(
        "Une erreur est survenue lors de la génération de l’image"
      );
    }
  };

  const createImage = async (alt: string) => {
    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: alt,
          token,
        }),
      });
      const data = await response.json();
      if (data.image) {
        const blob = new Blob([`data:image/png;base64,${data.image}`], {
          type: "image/png",
        });
        const formData = new FormData();
        formData.append(
          "files",
          new File([blob], Date.now().toString(), { type: "image/png" })
        );
        const res = await axios.post("/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data[0].url;
      }
      throw new Error(
        "Une erreur est survenue lors de la génération de l’image"
      );
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue lors de la génération de l’image");
      throw new Error(
        "Une erreur est survenue lors de la génération de l’image"
      );
    }
  };
  return { generateImage, createImage };
}
