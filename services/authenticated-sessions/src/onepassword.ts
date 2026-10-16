import { createClient } from "@1password/sdk";
import { ServiceError } from "./errors.js";

export type ResolvedLogin = {
  username: string;
  password: string;
  otp?: string;
};

type SecretRefs = {
  username: string;
  password: string;
  otp?: string;
};

export async function resolveLoginSecrets(refs: SecretRefs): Promise<ResolvedLogin> {
  const token = process.env.OP_SERVICE_ACCOUNT_TOKEN?.trim();
  if (!token) {
    throw new ServiceError(
      "OP_SERVICE_ACCOUNT_TOKEN is not set. Create a 1Password service account for the vault that holds these logins, then export the token. No password was typed.",
      "missing_onepassword_token",
    );
  }

  const client = await createClient({
    auth: token,
    integrationName: "Authenticated Sessions",
    integrationVersion: "1.0.0",
  });

  return {
    username: await resolveOne(client, refs.username),
    password: await resolveOne(client, refs.password),
    otp: refs.otp ? await resolveOne(client, refs.otp) : undefined,
  };
}

async function resolveOne(
  client: Awaited<ReturnType<typeof createClient>>,
  reference: string,
): Promise<string> {
  try {
    return await client.secrets.resolve(reference);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown error";
    throw new ServiceError(
      `Could not resolve ${reference}. ${detail}`,
      "onepassword_resolve_failed",
    );
  }
}
