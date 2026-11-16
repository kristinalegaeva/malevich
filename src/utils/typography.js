import Typograf from 'typograf';

const typograf = new Typograf({ locale: ['ru'] });

// Preserve wording and punctuation; apply only non-breaking spaces.
typograf.disableRule('*');
typograf.enableRule('common/nbsp/afterShortWordByList');
typograf.enableRule('common/nbsp/beforeShortLastWord');
typograf.enableRule('ru/nbsp/beforeParticle');

export function formatTypography(text) {
  return typograf.execute(text);
}
