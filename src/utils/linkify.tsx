import React from 'react';

// Matches bare URLs (http/https), scheme-less www. hosts, and email addresses.
// Trailing punctuation is deliberately excluded so "see https://x.com/a." doesn't
// swallow the sentence's full stop into the href.
const URL_PATTERN =
  /((?:https?:\/\/|www\.)[^\s<>()[\]{}"']+[^\s<>()[\]{}"'.,!?;:]|[^\s<>()[\]{}"',;:]+@[^\s<>()[\]{}"',;:]+\.[a-z]{2,})/gi;

/**
 * Splits plain message text into React nodes, turning URLs and email addresses
 * into anchors. Chat bodies are user-authored, so this deliberately builds React
 * elements rather than an HTML string — there is no dangerouslySetInnerHTML
 * anywhere in the path, which makes markup injection impossible by construction.
 * Text and links only: no markdown, no images, no embeds.
 */
export function linkify(text: string, linkClassName?: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Fresh regex per call — a shared /g regex carries lastIndex between calls.
  const pattern = new RegExp(URL_PATTERN.source, 'gi');

  while ((match = pattern.exec(text)) !== null) {
    const raw = match[0];
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));

    const isEmail = raw.includes('@') && !/^https?:\/\//i.test(raw) && !/^www\./i.test(raw);
    const href = isEmail
      ? `mailto:${raw}`
      : /^https?:\/\//i.test(raw)
        ? raw
        : `https://${raw}`;

    nodes.push(
      <a
        key={`${match.index}-${raw}`}
        href={href}
        target={isEmail ? undefined : '_blank'}
        // noopener/noreferrer: these URLs come from the other party in the chat.
        rel="noopener noreferrer nofollow"
        className={linkClassName ?? 'underline break-all hover:opacity-80'}
      >
        {raw}
      </a>
    );

    lastIndex = match.index + raw.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}
