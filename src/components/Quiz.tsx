'use client';

import { useState } from 'react';
import type { QuizItem } from '@/content/lessons';

export default function Quiz({ items }: { items: QuizItem[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const done = Object.keys(answers).length;
  const right = items.filter((q, i) => answers[i] === q.answer).length;
  return (
    <div>
      {items.map((q, i) => {
        const a = answers[i];
        return (
          <fieldset key={i} className="panel" style={{ marginBottom: 12 }}>
            <legend className="legend" style={{ padding: '0 6px' }}>
              Câu {i + 1}. {q.q}
            </legend>
            {q.options.map((o, j) => (
              <label key={j} className="check" style={{ fontWeight: a !== undefined && j === q.answer ? 700 : 400 }}>
                <input type="radio" name={`q${i}`} disabled={a !== undefined} checked={a === j} onChange={() => setAnswers((x) => ({ ...x, [i]: j }))} />
                <span>
                  {o}
                  {a !== undefined && j === q.answer && ' ✓'}
                </span>
              </label>
            ))}
            {a !== undefined && (
              <p className={a === q.answer ? 'note' : 'alert'} style={{ margin: '8px 0 0' }} aria-live="polite">
                {a === q.answer ? 'Đúng. ' : 'Chưa đúng. '}
                {q.explain}
              </p>
            )}
          </fieldset>
        );
      })}
      {done === items.length && (
        <p className="note">
          Bạn trả lời đúng {right}/{items.length} câu.
        </p>
      )}
    </div>
  );
}
