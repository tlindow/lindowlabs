/** Build a Cursor deeplink that opens a GitHub file or folder. */
export function openInCursorUrl(githubUrl: string): string {
  return `cursor://anysphere.cursor-deeplink/open?url=${encodeURIComponent(githubUrl)}`;
}

/** GitHub tree URL for a folder under tlindow/lindowlabs. */
export function lindowlabsTreeUrl(pathInRepo: string): string {
  const cleaned = pathInRepo.replace(/^\/+/, "").replace(/\/+$/, "");
  return `https://github.com/tlindow/lindowlabs/tree/main/${cleaned}`;
}

/** GitHub blob URL for a file under tlindow/lindowlabs. */
export function lindowlabsBlobUrl(pathInRepo: string): string {
  const cleaned = pathInRepo.replace(/^\/+/, "");
  return `https://github.com/tlindow/lindowlabs/blob/main/${cleaned}`;
}

export const FASTIFY_PAYMENTS_PATH = "exercises/api-design";

export function fastifyPaymentsExercise() {
  const githubUrl = lindowlabsTreeUrl(FASTIFY_PAYMENTS_PATH);
  return {
    id: "ex_fastify_payments_api",
    name: "OpenAPI by hand (then Fastify payments)",
    description:
      "Numbered OpenAPI YAML steps, then an optional Fastify payments API using the payments team's ubiquitous language.",
    path: FASTIFY_PAYMENTS_PATH,
    githubUrl,
    openInCursorUrl: openInCursorUrl(githubUrl),
  };
}
