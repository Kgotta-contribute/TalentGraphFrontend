import React from 'react';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline Text Formatter
// ─────────────────────────────────────────────────────────────────────────────

export function renderInlineTokens(text: string): React.ReactNode {
  if (!text) return null;

  // Clean common wrapping like **GET** or `GET`
  const cleanUpper = text.replace(/[*`_]/g, '').trim().toUpperCase();
  if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'].includes(cleanUpper)) {
    const methodColors: Record<string, string> = {
      GET: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      POST: 'bg-indigo-50 text-indigo-700 border-indigo-300',
      PUT: 'bg-amber-50 text-amber-700 border-amber-300',
      DELETE: 'bg-rose-50 text-rose-700 border-rose-300',
      PATCH: 'bg-purple-50 text-purple-700 border-purple-300',
      OPTIONS: 'bg-gray-100 text-gray-700 border-gray-300',
      HEAD: 'bg-sky-50 text-sky-700 border-sky-300',
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded font-mono font-bold text-[10px] border shadow-2xs ${
          methodColors[cleanUpper] || 'bg-gray-100 text-gray-800 border-gray-300'
        }`}
      >
        {cleanUpper}
      </span>
    );
  }

  // Pure API Path like `/health` or `/v1/create`
  const trimmed = text.trim();
  if (/^`?\/[a-zA-Z0-9_\-\/{}]*`?$/.test(trimmed)) {
    const pathClean = trimmed.replace(/`/g, '');
    return (
      <span className="inline-flex items-center font-mono font-bold text-indigo-700 bg-indigo-50/70 border border-indigo-200/80 px-2 py-0.5 rounded text-[11px] shadow-2xs">
        {pathClean}
      </span>
    );
  }

  // Pure File Path like `path/to/file.py`
  if (/^`?[a-zA-Z0-9_.\-\/]+\.(py|ts|tsx|js|jsx|json|md|yml|yaml|toml|sql|go|rs)`?$/.test(trimmed)) {
    const fileClean = trimmed.replace(/`/g, '');
    return (
      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-gray-700 bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-2xs">
        <span className="text-gray-400">📄</span>
        <span>{fileClean}</span>
      </span>
    );
  }

  // Regex tokenizer for inline bold, italic, code, links
  const tokens: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|https?:\/\/[^\s)]+)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      const code = token.slice(1, -1);
      tokens.push(
        <code
          key={match.index}
          className="font-mono text-[11px] bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded border border-gray-200/80"
        >
          {code}
        </code>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      const boldText = token.slice(2, -2);
      tokens.push(
        <strong key={match.index} className="font-bold text-gray-900">
          {boldText}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const italicText = token.slice(1, -1);
      tokens.push(
        <em key={match.index} className="italic text-gray-700">
          {italicText}
        </em>
      );
    } else if (token.startsWith('http')) {
      tokens.push(
        <a
          key={match.index}
          href={token}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-600 underline hover:text-indigo-800"
        >
          {token}
        </a>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return <>{tokens}</>;
}

export function renderInlineText(text: string): React.ReactNode {
  if (!text) return null;

  // If the cell contains sub-bullets or multiple items (e.g. • topic ...)
  if (text.includes('•') || text.includes(' - ') || text.includes('<br>')) {
    const parts = text
      .split(/(?:<br\s*\/?>|\s*[•\u2022]\s+|\s+-\s+)/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length > 1) {
      return (
        <div className="space-y-1">
          {parts.map((p, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-800 leading-snug">
              {idx > 0 && <span className="text-indigo-500 font-bold mt-0.5">•</span>}
              <div className="flex-1">{renderInlineTokens(p)}</div>
            </div>
          ))}
        </div>
      );
    }
  }

  return renderInlineTokens(text);
}

// ─────────────────────────────────────────────────────────────────────────────
// Block Types & Parser
// ─────────────────────────────────────────────────────────────────────────────

type Block =
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'heading'; level: number; text: string }
  | { type: 'code_block'; language: string; code: string }
  | { type: 'list'; items: string[] }
  | { type: 'hr' }
  | { type: 'paragraph'; text: string };

function parseMarkdownBlocks(markdown: string): Block[] {
  const lines = markdown.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 2. Code blocks (```lang ... ```)
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({
        type: 'code_block',
        language: lang,
        code: codeLines.join('\n'),
      });
      continue;
    }

    // 3. Tables (detect table header followed by separator |---|)
    if (trimmed.startsWith('|')) {
      if (i + 1 < lines.length) {
        const nextTrimmed = lines[i + 1].trim();
        if (/^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(nextTrimmed)) {
          const parseRowCells = (r: string) =>
            r
              .replace(/^\s*\|/, '')
              .replace(/\|\s*$/, '')
              .split('|')
              .map((c) => c.trim());

          const headers = parseRowCells(trimmed);
          const colCount = headers.length;
          i += 2; // skip header & separator

          const rows: string[][] = [];
          let currentRowStr = '';

          while (i < lines.length) {
            const rowLine = lines[i].trim();
            if (!rowLine) {
              i++;
              break;
            }

            // If a heading or hr appears, the table is over
            if (/^#{1,4}\s+/.test(rowLine) || /^(\*{3,}|-{3,}|_{3,})$/.test(rowLine)) {
              break;
            }

            // Check if this line starts a NEW table row
            // It starts with '|' AND the accumulated row already has all columns
            const currentPipes = (currentRowStr.match(/\|/g) || []).length;
            const isNewRow = rowLine.startsWith('|') && currentRowStr !== '' && currentPipes >= colCount;

            if (isNewRow) {
              const cells = parseRowCells(currentRowStr);
              while (cells.length < colCount) cells.push('');
              rows.push(cells.slice(0, colCount));
              currentRowStr = rowLine;
            } else {
              if (currentRowStr) {
                // If it looks like a bullet item in a cell, append with bullet character
                if (/^[•\-\*]\s+/.test(rowLine)) {
                  currentRowStr += ' • ' + rowLine.replace(/^[•\-\*]\s+/, '');
                } else {
                  currentRowStr += ' ' + rowLine;
                }
              } else {
                currentRowStr = rowLine;
              }
            }
            i++;
          }

          if (currentRowStr) {
            const cells = parseRowCells(currentRowStr);
            while (cells.length < colCount) cells.push('');
            rows.push(cells.slice(0, colCount));
          }

          blocks.push({ type: 'table', headers, rows });
          continue;
        }
      }
    }

    // 4. Horizontal rules (--- or ***)
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // 5. Headings (# Title, ## Title, etc.)
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      i++;
      continue;
    }

    // 6. Bullet lists (- item or * item)
    if (/^[-*•]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*•]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    // 7. Regular paragraph
    const paraLines: string[] = [trimmed];
    i++;
    while (i < lines.length) {
      const nextLine = lines[i].trim();
      if (
        !nextLine ||
        nextLine.startsWith('```') ||
        (nextLine.startsWith('|') && nextLine.endsWith('|')) ||
        /^#{1,4}\s+/.test(nextLine) ||
        /^[-*•]\s+/.test(nextLine) ||
        /^(\*{3,}|-{3,}|_{3,})$/.test(nextLine)
      ) {
        break;
      }
      paraLines.push(nextLine);
      i++;
    }

    blocks.push({
      type: 'paragraph',
      text: paraLines.join(' '),
    });
  }

  return blocks;
}

// ─────────────────────────────────────────────────────────────────────────────
// MarkdownViewer Component
// ─────────────────────────────────────────────────────────────────────────────

export default function MarkdownViewer({ content, className = '' }: MarkdownViewerProps) {
  if (!content) return null;

  const blocks = parseMarkdownBlocks(content);

  return (
    <div className={`space-y-3 text-xs leading-relaxed ${className}`}>
      {blocks.map((block, idx) => {
        // Table
        if (block.type === 'table') {
          return (
            <div
              key={idx}
              className="my-3 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-gray-100/90 border-b border-gray-200">
                    <tr>
                      {block.headers.map((header, hIdx) => (
                        <th
                          key={hIdx}
                          className="px-3.5 py-2.5 font-mono font-bold text-[11px] uppercase tracking-wider text-gray-700 whitespace-nowrap bg-gray-100/90"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-sans">
                    {block.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className={
                          rIdx % 2 === 0
                            ? 'bg-white hover:bg-indigo-50/20 transition-colors'
                            : 'bg-gray-50/50 hover:bg-indigo-50/20 transition-colors'
                        }
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="px-3.5 py-3 align-top text-gray-800 leading-normal"
                          >
                            {renderInlineText(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        // Headings
        if (block.type === 'heading') {
          if (block.level === 1) {
            return (
              <h2
                key={idx}
                className="text-base font-black text-gray-900 mt-4 mb-2 pb-1 border-b border-gray-100 flex items-center gap-1.5"
              >
                <span>📌</span>
                <span>{renderInlineText(block.text)}</span>
              </h2>
            );
          }
          if (block.level === 2) {
            return (
              <h3
                key={idx}
                className="text-sm font-bold text-gray-900 mt-3 mb-1.5 flex items-center gap-1.5"
              >
                <span>⚡</span>
                <span>{renderInlineText(block.text)}</span>
              </h3>
            );
          }
          return (
            <h4
              key={idx}
              className="text-xs font-bold text-indigo-900 uppercase tracking-wider mt-2.5 mb-1 flex items-center gap-1"
            >
              <span>•</span>
              <span>{renderInlineText(block.text)}</span>
            </h4>
          );
        }

        // Code block
        if (block.type === 'code_block') {
          return (
            <div
              key={idx}
              className="my-2.5 rounded-xl bg-gray-900 border border-gray-800 overflow-hidden shadow-xs"
            >
              {block.language && (
                <div className="bg-gray-800/80 px-3.5 py-1 text-[10px] font-mono text-gray-400 uppercase tracking-wider border-b border-gray-700/60 flex items-center justify-between">
                  <span>{block.language}</span>
                  <span className="text-gray-500">Source code</span>
                </div>
              )}
              <pre className="p-3.5 font-mono text-[11px] text-gray-100 overflow-x-auto leading-relaxed">
                <code>{block.code}</code>
              </pre>
            </div>
          );
        }

        // Lists
        if (block.type === 'list') {
          return (
            <ul key={idx} className="space-y-1.5 my-2 pl-1">
              {block.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className="flex items-start gap-2 text-xs text-gray-700 leading-normal"
                >
                  <span className="text-indigo-500 font-bold mt-0.5">•</span>
                  <div className="flex-1">{renderInlineText(item)}</div>
                </li>
              ))}
            </ul>
          );
        }

        // Horizontal rule
        if (block.type === 'hr') {
          return <hr key={idx} className="my-3 border-gray-200" />;
        }

        // Regular paragraph
        return (
          <p key={idx} className="text-xs text-gray-800 leading-relaxed my-1.5">
            {renderInlineText(block.text)}
          </p>
        );
      })}
    </div>
  );
}
