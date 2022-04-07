import { MediaRecord, StyleRecord } from "../../src/babel/types";
import { processStyles } from "../../src/babel/utils/process-styles";

export type Case = [string, Array<Test>];
export type Test = [string, Expected];

export interface Expected {
  styles: StyleRecord;
  media?: MediaRecord;
}

export function tailwindRunner(cases: Case[]) {
  describe.each(cases)("%s", (_, testCases) => {
    test.each(testCases)(
      "%s",
      (css, { styles: expectedStyles, media: expectedMedia }) => {
        const { styles, media } = processStyles({
          theme: {},
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
