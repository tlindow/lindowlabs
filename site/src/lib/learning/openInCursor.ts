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

export const API_DESIGN_PATH = "exercises/api-design";

/** The one curriculum exercise: OpenAPI by hand for payments. */
export function apiDesignExercise() {
  const githubUrl = lindowlabsTreeUrl(API_DESIGN_PATH);
  return {
    id: "ex_api_design_openapi",
    name: "OpenAPI by hand (payments)",
    description:
      "Numbered OpenAPI YAML steps for PaymentIntent, Capture, Refund, and WebhookEvent in the payments domain.",
    path: API_DESIGN_PATH,
    githubUrl,
    openInCursorUrl: openInCursorUrl(githubUrl),
  };
}

/** @deprecated Use apiDesignExercise. */
export const FASTIFY_PAYMENTS_PATH = API_DESIGN_PATH;

/** @deprecated Use apiDesignExercise. */
export function fastifyPaymentsExercise() {
  return apiDesignExercise();
}
