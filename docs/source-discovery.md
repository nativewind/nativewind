# Mapping utilities and source discovery

Nativewind v5 receives utility candidates from Tailwind's source scanner. A mapping must be discoverable from the application's source before Nativewind can compile it.

Use bracketed syntax for mapping paths containing `&`:

| Input | Use in application source |
| :--- | :--- |
| `@map/&.test:color-black` | `@map-[&.test]:color-black` |
| `@map/&.test.nested:color-black` | `@map-[&.test.nested]:color-black` |

The bracketed forms retain the same destination and value. Mappings to ordinary props, such as `@map/test:color-black`, remain valid. Mappings selecting a particular style field also use brackets, for example `@map-[&.test]/fontSize:text-base`.

Tailwind 4.1.12, 4.1.13, and 4.3.3 omit the two unbracketed ampersand candidates when scanning TSX. Explicit inline source declarations can force those candidates through the compiler, so a passing compiler test alone does not establish application source discovery. Automatic discovery of these two legacy spellings is outside the proposed RC contract; migrate to their bracketed equivalents. This is an existing preview limitation and has not been established as an Expo upgrade regression.

Tests in `src/__tests__/mapping-source.test.tsx` write actual TSX files, process them with optimization enabled and disabled, and check the rendered prop destinations and values. A control verifies that a class absent from the file does not get generated. Separate tests preserve the observed omissions without labeling them successful discovery.

Keep complete utility strings in application source. Tailwind's [source detection documentation](https://tailwindcss.com/docs/detecting-classes-in-source-files) explains discovery and explicitly registered sources. Adding inline declarations for these omitted aliases does not verify automatic discovery.
