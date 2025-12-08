import axios from "@/lib/axios";
import { tokenCounter } from "@/lib/token-counter";
import { BlockSchema } from "@/schemas/block";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import z from "zod";

export const maxDuration = 300;

const SiteSchema = z.object({
  blocks: z.array(BlockSchema).describe("Les pages du site"),
});

export async function POST(request: Request) {
  try {
    const { site, page, token } = await request.json();
    const systemMessage = `
    <context_gathering>
      Website data: ${JSON.stringify(site)}
      Page data: ${JSON.stringify(page)}
    </context_gathering>
    <task>
      You are an expert web designer.
      Always structure the page with multiple sections, not a single block containing children.
      Page should contain multiple blocks, and each block can have multiple child blocks.
      Use CSS Grid for all layouts and make it responsive, verify the design of all the custom components and ensure that all content will be responsive on the screen.
      Apply shadows, rounded corners and spacings to create an attractive design.
      Add hover effects for buttons and links.
      Use the Image component to display images without src props.
      Use the className prop to apply Tailwind CSS classes to components.
      You can nest components as needed to create a visually appealing layout.
      Don't add header or footer, only generate the page content.
      Ensure the website is responsive and mobile-friendly.
    </task>
    `;
    const taskPrompt = `
      Generate the page content for the website based on the provided page data.
    `;
    const promptToken = tokenCounter(systemMessage, "gpt-5");
    const tokenCount = tokenCounter(taskPrompt, "gpt-5");
    console.log("Prompt token", promptToken);
    console.log("Token count", tokenCount);
    const totalInputToken = promptToken + tokenCount;
    console.log("Total token", totalInputToken);

    try {
      const response = await axios.post(
        "/token-histories",
        {
          data: {
            token_amount: totalInputToken,
            model: "openai/gpt5",
            type: "input_token",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (e) {
      return NextResponse.json(
        {
          message: "Not enough balance" + JSON.stringify(e),
        },
        {
          status: 403,
        }
      );
    }
    const result = await generateObject({
      model: openai("gpt-5"),
      system: systemMessage,
      prompt: taskPrompt,
      schema: SiteSchema,
    });

    const totalOutputToken = tokenCounter(JSON.stringify(result), "gpt-5");
    console.log("Total output token", totalOutputToken);

    try {
      const response = await axios.post(
        "/token-histories",
        {
          data: {
            token_amount: totalOutputToken,
            model: "openai/gpt5",
            type: "output_token",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (e) {
      console.log(e);
      return NextResponse.json(
        {
          message: "Not enough balance:" + JSON.stringify(e),
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
