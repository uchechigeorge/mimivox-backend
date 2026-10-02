import { emailConfig } from "@/lib/config/email.config";
import { env } from "@/lib/config/env.config";
import { sendEmail } from "@/lib/utils/email.util";
import GenerationFinished from "@/react-email/emails/generation-finished";

export const sendGenerationFinished = async (
  to: string,
  args: SendGenerationFinishedArgs,
) => {
  const { userName, succeeded, mediaLabel, prompt, startedAt, error, refunded } =
    args;

  return await sendEmail({
    to,
    subject: succeeded
      ? `Your ${mediaLabel} is ready`
      : `Your ${mediaLabel} could not be generated`,
    react: GenerationFinished({
      userName,
      succeeded,
      mediaLabel,
      prompt,
      startedAt: `${startedAt.toLocaleString("en-US", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "UTC",
      })} UTC`,
      error,
      refunded,
      // DASHBOARD_LINK is <site>/user/dashboard; the library sits beside it
      buttonLink: new URL("creative-library", env.DASHBOARD_LINK).toString(),
      ...emailConfig,
    }),
  });
};

type SendGenerationFinishedArgs = {
  userName: string;
  succeeded: boolean;
  mediaLabel: string;
  prompt: string;
  startedAt: Date;
  error?: string;
  refunded?: boolean;
};
