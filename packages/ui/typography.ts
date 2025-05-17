const round = (x: number): string =>
  x
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '');
const rem = (px: number): string => `${round(px / 16)}rem`;
const em = (px: number, base: number): string => `${round(px / base)}em`;

interface TypographyOptions {
  fontSize: number;
  lineHeight: number;
}

export const typography = ({ fontSize, lineHeight }: TypographyOptions) => {
  const marginY = lineHeight / 3;

  const base = {
    fontSize: rem(fontSize),
    lineHeight: round(lineHeight / fontSize),
    marginTop: em(marginY, fontSize),
    marginBottom: em(marginY, fontSize),
  };

  const heading = (scale: number) => ({
    fontSize: em(fontSize * scale, fontSize),
    lineHeight: round(lineHeight / (fontSize * scale)),
    marginTop: em(marginY, fontSize),
    marginBottom: em(marginY, fontSize),
  });

  return {
    css: {
      ...base,
      p: base,
      blockquote: {
        ...base,
        fontStyle: 'italic',
        borderLeft: `${rem(4)} solid #ddd`,
        paddingLeft: em(12, fontSize),
      },
      h1: heading(2.5),
      h2: heading(2),
      h3: heading(1.5),
      h4: heading(1.25),
      h5: heading(1.125),
      h6: heading(1),
      ul: base,
      ol: base,
      li: base,
      'li > *:first-child': {
        marginTop: '0',
        marginBottom: '0',
      },
      pre: base,
      code: base,
      img: {
        ...base,
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
      },
      table: {
        ...base,
        borderCollapse: 'collapse',
        width: '100%',
      },
      'th, td': {
        padding: em(8, fontSize),
      },
      figure: base,
      figcaption: {
        fontSize: em(fontSize * 0.875, fontSize),
        lineHeight: round(lineHeight / fontSize),
        marginTop: em(8, fontSize),
      },
      '> :first-child': { marginTop: '0' },
      '> :last-child': { marginBottom: '0' },
    },
  };
};
