import { phoneHref } from "@/lib/format";

/** Renders text, turning any mention of the office phone number into a call link. */
export function PhoneText({ text, phone }: { text: string; phone: string }) {
  const parts = phone ? text.split(phone) : [text];
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <a className="text-link" href={phoneHref(phone)}>
              {phone}
            </a>
          )}
        </span>
      ))}
    </>
  );
}
