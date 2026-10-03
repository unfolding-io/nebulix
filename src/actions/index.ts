import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import { sendContact } from "@src/lib/forms/contact";
import { subscribeMailchimp } from "@src/lib/forms/mailchimp";

const contactProvider = z.enum(["mailgun", "postmark", "slack"]);

export const server = {
  contact: defineAction({
    accept: "json",
    input: z.object({
      provider: contactProvider,
      email: z.string().email(),
      name: z.string().min(1),
      phone: z.string().optional().default(""),
      message: z.string().min(10),
      topic: z.string().min(1),
      topicEmail: z.union([z.string().email(), z.literal("")]).optional(),
      topicChannel: z.string().optional().default(""),
    }),
    handler: async (input) => {
      try {
        return await sendContact({
          provider: input.provider,
          email: input.email,
          name: input.name,
          phone: input.phone || undefined,
          message: input.message,
          topic: input.topic,
          topicEmail: input.topicEmail || undefined,
          topicChannel: input.topicChannel || undefined,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Contact form failed";
        throw new ActionError({
          code: message.startsWith("Missing ") ? "BAD_REQUEST" : "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    },
  }),

  subscribe: defineAction({
    accept: "json",
    input: z.object({
      email: z.string().email(),
      provider: z.enum(["mailchimp"]).default("mailchimp"),
    }),
    handler: async ({ email, provider }) => {
      if (provider !== "mailchimp") {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Only the mailchimp newsletter provider is supported.",
        });
      }

      try {
        return await subscribeMailchimp(email);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Newsletter subscribe failed";
        throw new ActionError({
          code: "BAD_REQUEST",
          message,
        });
      }
    },
  }),
};
