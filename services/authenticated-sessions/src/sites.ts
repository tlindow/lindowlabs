import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const secretRef = z.string().refine(
  (value) => value.startsWith("op://") && value.trim() === value && value.length > "op://".length,
  "must be a 1Password secret reference (op://vault/item/field)",
);

const label = z
  .string()
  .min(1)
  .refine((value) => !value.includes("%"), "field labels cannot contain %");

export const siteSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9][a-z0-9-]{0,62}$/),
    label: z.string().min(1),
    loginUrl: z.string().url(),
    usernameField: label,
    passwordField: label,
    submitButton: label,
    beforePassword: label.optional(),
    otpField: label.optional(),
    loggedInUrlIncludes: z.string().min(1),
    loggedInSelector: z.string().min(1).optional(),
    secrets: z.object({
      username: secretRef,
      password: secretRef,
      otp: secretRef.optional(),
    }),
  })
  .superRefine((site, ctx) => {
    if (site.otpField && !site.secrets.otp) {
      ctx.addIssue({
        code: "custom",
        path: ["secrets", "otp"],
        message: "otpField is set, so secrets.otp must be an op:// reference",
      });
    }
    if (site.secrets.otp && !site.otpField) {
      ctx.addIssue({
        code: "custom",
        path: ["otpField"],
        message: "secrets.otp is set, so otpField must name the code field",
      });
    }
  });

export const catalogSchema = z.object({
  sites: z.array(siteSchema).min(1),
});

export type Site = z.infer<typeof siteSchema>;

const PROTECTED_HOST_SUFFIXES = [
  "linkedin.com",
  "yelp.com",
  "instagram.com",
  "facebook.com",
  "tiktok.com",
  "x.com",
  "twitter.com",
];

export function hostIsBotProtected(loginUrl: string): boolean {
  const host = new URL(loginUrl).hostname.toLowerCase().replace(/^www\./, "");
  return PROTECTED_HOST_SUFFIXES.some(
    (suffix) => host === suffix || host.endsWith(`.${suffix}`),
  );
}

export function signedInByUrl(url: string, loggedInUrlIncludes: string): boolean {
  return url.includes(loggedInUrlIncludes);
}

export async function loadCatalog(filePath: string): Promise<Site[]> {
  const raw = await readFile(filePath, "utf8");
  const parsed = catalogSchema.parse(JSON.parse(raw));
  const ids = new Set<string>();
  for (const site of parsed.sites) {
    if (ids.has(site.id)) {
      throw new Error(`Duplicate site id "${site.id}" in ${filePath}`);
    }
    ids.add(site.id);
  }
  return parsed.sites;
}

export function resolveSitesFile(cwd = process.cwd()): string {
  if (process.env.SITES_FILE) return path.resolve(cwd, process.env.SITES_FILE);
  return path.resolve(cwd, "sites.json");
}

export function publicSite(site: Site) {
  return {
    id: site.id,
    label: site.label,
    loginUrl: site.loginUrl,
    botProtected: hostIsBotProtected(site.loginUrl),
    secrets: site.secrets,
  };
}
