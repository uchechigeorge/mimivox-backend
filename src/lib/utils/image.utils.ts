import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import sharp from "sharp";

GlobalFonts.registerFromPath(
  process.cwd() + "/public/fonts/Inter-Bold.ttf",
  "Inter",
);

export async function generateTextImage(
  text: string,
  bgColor: string = "#3498db",
  textColor: string = "#ffffff",
  width: number = 200,
  height: number = 200,
) {
  // Create a canvas for text rendering
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Set background color
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Set text properties
  ctx.fillStyle = textColor;
  ctx.font = `bold ${Math.floor(width * 0.4)}px Inter`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Draw text in the center
  ctx.fillText(text.slice(0, 2).toUpperCase(), width / 2, height / 2);

  // Convert canvas to a buffer
  const buffer = canvas.toBuffer("image/png");

  // Use Sharp to process the image
  return sharp(buffer).toFormat("png").toBuffer();
}
