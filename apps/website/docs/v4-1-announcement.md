# NativeWind 4.1

Version 4 of NativeWind, particularly NativeWind 4.1, is officially ready for production. With the release of 4.1, we've expanded upon the major updates from v4.0, focusing on performance improvements, enhanced features, and better developer experience. Give it a shot:
```bash
npm install nativewind@latest
```

## What's New Since v4.0

This document highlights the changes and improvements introduced in NativeWind 4.1, compared to v4.0. If you're upgrading from v2 or earlier and want to see the major changes introduced in v4.0, please refer to our [v4 announcement page](./v4-announcement.md).

## What's New in NativeWind 4.1

- **Consistent Fast Refresh:** Style changes are now consistent across all build types.
- **Drastically Fast(er) Refresh:** Reduced output size and improved Fast Refresh performance.
- **Enhanced Animations and Transitions:** More robust and consistent animation and transition support.
- **tvOS Support:** Styling capabilities for `react-native-tvos` projects.
- **Media Query Support:** New support for `dpi`/`dpcm`/`dppx` media queries.
- **Automatically Configured TypeScript Types:** Improved TypeScript integration.
- **Dot Notation Support:** Enhanced `cssInterop` config targeting.
- **Parenthesis Support in `calc()` Functions:** Improved calculation capabilities.
- **Improved Development and Debugging:** Better developer experience for NativeWind contributors.

## Consistent Fast Refresh

NativeWind 4.1 introduces a significant improvement to Fast Refresh consistency:

- Styles are now always written to disk if virtual modules are not possible (e.g., Radon IDE) or when building for production (e.g., expo-updates).
- This change allows for Fast Refresh on both development and production builds.

## Drastically Fast(er) Refresh

We've made numerous improvements to enhance the development experience:

- Reduced costly Metro transforms while maintaining and improving the development experience.
- These optimizations result in faster refresh times without compromising functionality.
- More performance improvements are planned for future releases.

## Enhanced Animations and Transitions

NativeWind 4.1 brings more stability and features to animations and transitions:

- Added robust tests to ensure a consistent and stable experience.
- Improved compatibility with different React Native versions to prevent unexpected crashes.
- Expanded animation capabilities, including support for `%` based `transform` and complex animations.

## tvOS Support

NativeWind now extends its styling capabilities to tvOS:

- You can now use NativeWind to style your `react-native-tvos` projects.
- Use `Platform.isTVOS` to add platform-specific code for tvOS.

## Media Query Support

NativeWind 4.1 introduces new media query capabilities:

- Support for `dpi`, `dpcm`, and `dppx` media queries.
- While there are no set media queries on mobile devices, you can now define your own based on these units.
- Future updates aim to include default values for these breakpoints.

## Automatically Configured TypeScript Types

Improved TypeScript integration in NativeWind 4.1:

- The development server now automatically creates and configures NativeWind types.
- This enhancement streamlines the setup process and improves type checking in NativeWind projects.

## Dot Notation Support

NativeWind 4.1 adds support for dot notation in `cssInterop` config targeting:

- This feature provides more flexibility in how you configure component interoperability.

## Parenthesis Support in `calc()` Functions

Improved calculation capabilities in NativeWind 4.1:

- Support for logical parenthesis in `calc()` functions, e.g., `calc(a - (b + c))`.

## Improved Development and Debugging

NativeWind 4.1 focuses on improving the developer experience for contributors:

- Added more logs and debugging tools to support developers working on NativeWind itself.
- Included a contribution guide to make it easier for interested developers to contribute to the project.
- Join the [NativeWind Discord](https://nativewind.dev/discord) to participate in discussions about these changes.

## Contributors

In addition to the work of the core team, NativeWind is the result of the combined work of many individual developers. We want to thank the following developers for their help in making NativeWind 4.1 possible:

- [Mark Lawlor](https://github.com/marklawlor)
- [Dan Stepanov](https://github.com/danstepanov)
- [Bradley Ayers](https://github.com/bradleyayers)
- [John F](https://github.com/johnf)
- [Doug Lowder](https://github.com/douglowder)
- [cxa](https://github.com/cxa)
- [Nishan Bende](https://github.com/intergalacticspacehighway)
- [Tobias Harth](https://github.com/tobiasharth)
- [Viraj Joshi](https://github.com/viraj-10)
- [Jakob Rössner](https://github.com/fleetadmiraljakob)
- [Himanshu Kumar Dutt](https://github.com/himanshukumardutt094)
- [Karl Horky](https://github.com/karlhorky)

Your continued support, both in terms of code and community participation, is instrumental to the future of NativeWind. We're incredibly grateful and hope to see even more folks contributing for the next release!
