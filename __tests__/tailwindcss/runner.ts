import { MediaRecord, StyleRecord } from "../../src/babel/types";
import { getNativeTailwindConfig } from "../../src/babel/tailwind/native-config";
import { extractStyles } from "../../src/babel/native-style-extraction";

export type Test = [string, Expected];

export interface Expected {
  styles: StyleRecord;
  media?: MediaRecord;
}

export function emptyResults(names: string[]): Test[] {
  return names.map((name) => [name, { styles: {}, media: {} }]);
}

export function tailwindRunner(name: string, testCases: Test[]) {
  describe(name, () => {
    test.each(testCases)(
      "%s",
      (css, { styles: expectedStyles, media: expectedMedia }) => {
        const { styles, media } = extractStyles({
          theme: {},
          ...getNativeTailwindConfig(),
          content: [{ raw: `<div class="${css}">`, extension: "html" } as any],
        });

        expect(styles).toEqual(expectedStyles);

        if (expectedMedia) {
          expect(media).toEqual(expectedMedia);
        }
      }
    );
  });
}
