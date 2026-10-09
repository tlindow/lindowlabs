import { resumeContact } from "@/data/resumeData";

type PreferLinkedInProps = {
  /** Match the adjacent email control (inline text link or button CTA). */
  className?: string;
  title?: string;
};

/**
 * Equal-weight LinkedIn alternative shown next to email contact.
 * Whole line is the link so it reads as a peer option, not a fallback.
 */
export default function PreferLinkedIn({
  className,
  title = "Message Tyler Lindow on LinkedIn",
}: PreferLinkedInProps) {
  return (
    <a
      href={resumeContact.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={title}
    >
      Prefer LinkedIn? Message me there.
    </a>
  );
}
