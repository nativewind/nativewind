## [1.5.3](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.2...v1.5.3) (2022-05-29)

### Bug Fixes

- **deps:** update dependency @babel/types to v7.18.4 ([16e94d4](https://github.com/marklawlor/tailwindcss-react-native/commit/16e94d450b653646073c28407ac5d88c6985c201))

## [1.5.1](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0...v1.5.1) (2022-05-28)

- forwarding refs of styled components ([c89e314](https://github.com/marklawlor/tailwindcss-react-native/commit/c89e3146ae831ebf2b801a93011ef5afa5a55886))

## [1.5.2](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.1...v1.5.2) (2022-05-29)

### Bug Fixes

- ensure StyledProps are exported ([93ab927](https://github.com/marklawlor/tailwindcss-react-native/commit/93ab9271df86312add43c1c3fe3819b8a0aabe54))

## [1.5.2-next.1](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.1...v1.5.2-next.1) (2022-05-30)

### Bug Fixes

- **deps:** update dependency @babel/types to v7.18.4 ([16e94d4](https://github.com/marklawlor/tailwindcss-react-native/commit/16e94d450b653646073c28407ac5d88c6985c201))

## [1.5.1](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0...v1.5.1) (2022-05-28)

### Bug Fixes

- path matching on windows ([2ec7363](https://github.com/marklawlor/tailwindcss-react-native/commit/2ec7363d072b10f5c85924a59b11b7d7e9d93297)), closes [#64](https://github.com/marklawlor/tailwindcss-react-native/issues/64)

# [1.5.0](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.4.6...v1.5.0) (2022-05-28)

### Bug Fixes

- [#54](https://github.com/marklawlor/tailwindcss-react-native/issues/54) ([c639511](https://github.com/marklawlor/tailwindcss-react-native/commit/c63951127d9a1f242eeacf93011f0d2a5a089208))
- allow absolute paths to tailwind config ([0421a91](https://github.com/marklawlor/tailwindcss-react-native/commit/0421a9110ebc68ee4087c416630ce97dfd136675))
- better matching with relative content paths in tailwind.config.js ([f99bc1f](https://github.com/marklawlor/tailwindcss-react-native/commit/f99bc1fd2e3647c5a0319133d25f969d47300b45)), closes [#57](https://github.com/marklawlor/tailwindcss-react-native/issues/57)
- cssProps working in preview mode ([73cd4b6](https://github.com/marklawlor/tailwindcss-react-native/commit/73cd4b6e32a66030aed4e6b9deac73f472c0efbf))
- **deps:** update docusaurus monorepo to v2.0.0-beta.21 ([a25a8da](https://github.com/marklawlor/tailwindcss-react-native/commit/a25a8da2243822ae9aeb01e84a3942ff6781321f))
- ensure spreadProps use flat styles on preview ([7c2cc8b](https://github.com/marklawlor/tailwindcss-react-native/commit/7c2cc8b3fced2abe45f16482ee413af2103924db))
- ensure stroke is set to a valid value ([8970f65](https://github.com/marklawlor/tailwindcss-react-native/commit/8970f655a38ef1b3a63b1a3712657af234d98dc0))
- improve active: styles on web ([30fdfdd](https://github.com/marklawlor/tailwindcss-react-native/commit/30fdfdde6325ced776c6a8d40875188c12c53e45))
- improvements to spreadProps with preview mode ([3d4941a](https://github.com/marklawlor/tailwindcss-react-native/commit/3d4941ac9d55c46e11c2423416aefdfbb04c64f5))
- include optional props in useInteraction parsing ([0b6d0a6](https://github.com/marklawlor/tailwindcss-react-native/commit/0b6d0a62721843f8799fdc2e019b1bf8a9956cd4))
- prevent adding empty style arrays to parents ([61780d2](https://github.com/marklawlor/tailwindcss-react-native/commit/61780d2aff0a46e5c53abea2f0508af3d19a408a))
- prevent adding unnecessary event handlers to components ([04ce242](https://github.com/marklawlor/tailwindcss-react-native/commit/04ce24283fdf651dc5e910fdadfdc23bd9c39249))
- prevent passing undefined svg props ([244be39](https://github.com/marklawlor/tailwindcss-react-native/commit/244be3997ce55b7c089dc858ac8f1d9456a53e92))
- react import for classic JSX ([2e7bf03](https://github.com/marklawlor/tailwindcss-react-native/commit/2e7bf03e23dd72335a1aadf23985903910146ed4))
- remove empty line in generated styles ([20e6973](https://github.com/marklawlor/tailwindcss-react-native/commit/20e697321a4269efe095ca39a8da610717725ae5))
- rename valueProps to spreadProps. Add cssProps ([3ae8d94](https://github.com/marklawlor/tailwindcss-react-native/commit/3ae8d940612be59d0c2016497c75fdbebabc43e1))
- short circuit withStyledChildren when there are no child styles ([8de2e43](https://github.com/marklawlor/tailwindcss-react-native/commit/8de2e4351e13f9e3b681364a719b11e73a8fbb84))
- stop babel appending platform to TailwindProvider ([fc8fdc8](https://github.com/marklawlor/tailwindcss-react-native/commit/fc8fdc8b9243439a3a75fc8966739b615c8dc5aa))
- strokeWidth console warnings on native ([5ace7ff](https://github.com/marklawlor/tailwindcss-react-native/commit/5ace7ff9754e551f577faa067a393f006c21bbc0))
- transform components using fill and stroke ([f4161ef](https://github.com/marklawlor/tailwindcss-react-native/commit/f4161ef3b2a20c984feab76e1dd300dbbaaa5678))
- useInteraction not adding handlers ([f3c4127](https://github.com/marklawlor/tailwindcss-react-native/commit/f3c412789208430046834b4f6f294bb3bb49e8af))

### Features

- add parent variant ([a6d8023](https://github.com/marklawlor/tailwindcss-react-native/commit/a6d802314fa3452c554ae8b0656103dcf718f415))
- add preview support for flattened styles ([b5b8273](https://github.com/marklawlor/tailwindcss-react-native/commit/b5b8273f7d3f5c4b1a8b6906b2ac24e5227262d7))
- add SVG support ([05897c3](https://github.com/marklawlor/tailwindcss-react-native/commit/05897c3ab7e3564c69e965bfd2c86d01f47eea1d)), closes [#56](https://github.com/marklawlor/tailwindcss-react-native/issues/56)
- allow for styled to parse additional props ([1037027](https://github.com/marklawlor/tailwindcss-react-native/commit/1037027035187c2c67719e6880f3e5a4bd5ea778))
- export new context hooks ([1560afe](https://github.com/marklawlor/tailwindcss-react-native/commit/1560afe983b97c5c866a427dd1194a62ccb0adea))

# [1.5.0-next.21](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.20...v1.5.0-next.21) (2022-05-27)

### Bug Fixes

- improvements to spreadProps with preview mode ([3d4941a](https://github.com/marklawlor/tailwindcss-react-native/commit/3d4941ac9d55c46e11c2423416aefdfbb04c64f5))

# [1.5.0-next.20](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.19...v1.5.0-next.20) (2022-05-27)

### Bug Fixes

- define the global variable during babel transform ([1edda15](https://github.com/marklawlor/tailwindcss-react-native/commit/1edda15988e431341c125211b11da425980516db)), closes [#60](https://github.com/marklawlor/tailwindcss-react-native/issues/60)

## [1.4.6](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.4.5...v1.4.6) (2022-05-27)

### Bug Fixes

- define the global variable during babel transform ([1edda15](https://github.com/marklawlor/tailwindcss-react-native/commit/1edda15988e431341c125211b11da425980516db)), closes [#60](https://github.com/marklawlor/tailwindcss-react-native/issues/60)

## [1.4.5](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.4.4...v1.4.5) (2022-05-27)

- better matching with relative content paths in tailwind.config.js ([fd43261](https://github.com/marklawlor/tailwindcss-react-native/commit/fd43261ebaeaab1cad29a959ed3f2de338838d6f)), closes [#57](https://github.com/marklawlor/tailwindcss-react-native/issues/57)

# [1.5.0-next.18](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.17...v1.5.0-next.18) (2022-05-26)

### Bug Fixes

- ensure spreadProps use flat styles on preview ([7c2cc8b](https://github.com/marklawlor/tailwindcss-react-native/commit/7c2cc8b3fced2abe45f16482ee413af2103924db))

# [1.5.0-next.17](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.16...v1.5.0-next.17) (2022-05-26)

### Bug Fixes

- cssProps working in preview mode ([73cd4b6](https://github.com/marklawlor/tailwindcss-react-native/commit/73cd4b6e32a66030aed4e6b9deac73f472c0efbf))

# [1.5.0-next.16](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.15...v1.5.0-next.16) (2022-05-26)

### Bug Fixes

- improve active: styles on web ([30fdfdd](https://github.com/marklawlor/tailwindcss-react-native/commit/30fdfdde6325ced776c6a8d40875188c12c53e45))

# [1.5.0-next.15](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.14...v1.5.0-next.15) (2022-05-26)

### Bug Fixes

- include optional props in useInteraction parsing ([0b6d0a6](https://github.com/marklawlor/tailwindcss-react-native/commit/0b6d0a62721843f8799fdc2e019b1bf8a9956cd4))

# [1.5.0-next.14](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.13...v1.5.0-next.14) (2022-05-26)

### Bug Fixes

- react import for classic JSX ([2e7bf03](https://github.com/marklawlor/tailwindcss-react-native/commit/2e7bf03e23dd72335a1aadf23985903910146ed4))

# [1.5.0-next.13](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.12...v1.5.0-next.13) (2022-05-26)

### Bug Fixes

- add import React to component files ([467f7d2](https://github.com/marklawlor/tailwindcss-react-native/commit/467f7d2883d614e195a17231c565d75caa190cc5))
- add import React to component files ([1cbee33](https://github.com/marklawlor/tailwindcss-react-native/commit/1cbee331a7adb157856c2f00457fb7b7c0f0eb07))
- runtime error with RNW <=0.17 ([fe8c181](https://github.com/marklawlor/tailwindcss-react-native/commit/fe8c181a4b6a454a98d65d45bcda521c72f5ef81))
- runtime-styles parsing for RWN <=0.17 ([6dc1958](https://github.com/marklawlor/tailwindcss-react-native/commit/6dc195811a65b60fff7bf8abded759de2ad5c681))

<<<<<<< HEAD

# [1.5.0-next.12](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.11...v1.5.0-next.12) (2022-05-25)

=======

## [1.4.4](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.4.3...v1.4.4) (2022-05-26)

> > > > > > > main

### Bug Fixes

<<<<<<< HEAD

- allow absolute paths to tailwind config ([0421a91](https://github.com/marklawlor/tailwindcss-react-native/commit/0421a9110ebc68ee4087c416630ce97dfd136675))
- better matching with relative content paths in tailwind.config.js ([f99bc1f](https://github.com/marklawlor/tailwindcss-react-native/commit/f99bc1fd2e3647c5a0319133d25f969d47300b45)), closes [#57](https://github.com/marklawlor/tailwindcss-react-native/issues/57)

# [1.5.0-next.11](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.10...v1.5.0-next.11) (2022-05-25)

=======

- runtime error with RNW <=0.17 ([fe8c181](https://github.com/marklawlor/tailwindcss-react-native/commit/fe8c181a4b6a454a98d65d45bcda521c72f5ef81))

## [1.4.3](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.4.2...v1.4.3) (2022-05-26)

### Bug Fixes

- runtime-styles parsing for RWN <=0.17 ([6dc1958](https://github.com/marklawlor/tailwindcss-react-native/commit/6dc195811a65b60fff7bf8abded759de2ad5c681))

## [1.4.2](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.4.1...v1.4.2) (2022-05-25)

### Bug Fixes

- add import React to component files ([467f7d2](https://github.com/marklawlor/tailwindcss-react-native/commit/467f7d2883d614e195a17231c565d75caa190cc5))

## [1.4.1](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.4.0...v1.4.1) (2022-05-25)

### Bug Fixes

- add import React to component files ([1cbee33](https://github.com/marklawlor/tailwindcss-react-native/commit/1cbee331a7adb157856c2f00457fb7b7c0f0eb07))

# [1.4.0](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.3.3...v1.4.0) (2022-05-18)

> > > > > > > main

### Features

- add preview support for flattened styles ([b5b8273](https://github.com/marklawlor/tailwindcss-react-native/commit/b5b8273f7d3f5c4b1a8b6906b2ac24e5227262d7))

# [1.5.0-next.10](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.9...v1.5.0-next.10) (2022-05-25)

### Bug Fixes

- rename valueProps to spreadProps. Add cssProps ([3ae8d94](https://github.com/marklawlor/tailwindcss-react-native/commit/3ae8d940612be59d0c2016497c75fdbebabc43e1))

# [1.5.0-next.9](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.8...v1.5.0-next.9) (2022-05-23)

### Bug Fixes

- ensure stroke is set to a valid value ([8970f65](https://github.com/marklawlor/tailwindcss-react-native/commit/8970f655a38ef1b3a63b1a3712657af234d98dc0))
- prevent passing undefined svg props ([244be39](https://github.com/marklawlor/tailwindcss-react-native/commit/244be3997ce55b7c089dc858ac8f1d9456a53e92))
- remove empty line in generated styles ([20e6973](https://github.com/marklawlor/tailwindcss-react-native/commit/20e697321a4269efe095ca39a8da610717725ae5))

# [1.5.0-next.8](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.7...v1.5.0-next.8) (2022-05-23)

### Bug Fixes

- stop babel appending platform to TailwindProvider ([fc8fdc8](https://github.com/marklawlor/tailwindcss-react-native/commit/fc8fdc8b9243439a3a75fc8966739b615c8dc5aa))
- transform components using fill and stroke ([f4161ef](https://github.com/marklawlor/tailwindcss-react-native/commit/f4161ef3b2a20c984feab76e1dd300dbbaaa5678))
- useInteraction not adding handlers ([f3c4127](https://github.com/marklawlor/tailwindcss-react-native/commit/f3c412789208430046834b4f6f294bb3bb49e8af))

# [1.5.0-next.7](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.6...v1.5.0-next.7) (2022-05-20)

### Bug Fixes

- strokeWidth console warnings on native ([5ace7ff](https://github.com/marklawlor/tailwindcss-react-native/commit/5ace7ff9754e551f577faa067a393f006c21bbc0))

### Features

- export new context hooks ([1560afe](https://github.com/marklawlor/tailwindcss-react-native/commit/1560afe983b97c5c866a427dd1194a62ccb0adea))

# [1.5.0-next.6](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.5...v1.5.0-next.6) (2022-05-20)

### Features

- add SVG support ([05897c3](https://github.com/marklawlor/tailwindcss-react-native/commit/05897c3ab7e3564c69e965bfd2c86d01f47eea1d)), closes [#56](https://github.com/marklawlor/tailwindcss-react-native/issues/56)

# [1.5.0-next.5](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.4...v1.5.0-next.5) (2022-05-20)

### Bug Fixes

- short circuit withStyledChildren when there are no child styles ([8de2e43](https://github.com/marklawlor/tailwindcss-react-native/commit/8de2e4351e13f9e3b681364a719b11e73a8fbb84))

# [1.5.0-next.4](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.3...v1.5.0-next.4) (2022-05-19)

### Bug Fixes

- [#54](https://github.com/marklawlor/tailwindcss-react-native/issues/54) ([c639511](https://github.com/marklawlor/tailwindcss-react-native/commit/c63951127d9a1f242eeacf93011f0d2a5a089208))

### Features

- allow for styled to parse additional props ([1037027](https://github.com/marklawlor/tailwindcss-react-native/commit/1037027035187c2c67719e6880f3e5a4bd5ea778))

# [1.5.0-next.3](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.2...v1.5.0-next.3) (2022-05-18)

### Bug Fixes

- prevent adding empty style arrays to parents ([61780d2](https://github.com/marklawlor/tailwindcss-react-native/commit/61780d2aff0a46e5c53abea2f0508af3d19a408a))

# [1.5.0-next.2](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.5.0-next.1...v1.5.0-next.2) (2022-05-18)

### Bug Fixes

- prevent adding unnecessary event handlers to components ([04ce242](https://github.com/marklawlor/tailwindcss-react-native/commit/04ce24283fdf651dc5e910fdadfdc23bd9c39249))

# [1.5.0-next.1](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.4.0...v1.5.0-next.1) (2022-05-18)

### Features

- add parent variant ([a6d8023](https://github.com/marklawlor/tailwindcss-react-native/commit/a6d802314fa3452c554ae8b0656103dcf718f415))

# [1.4.0](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.3.3...v1.4.0) (2022-05-18)

### Features

- allow hairlineWidth as a theme value ([5cf20d0](https://github.com/marklawlor/tailwindcss-react-native/commit/5cf20d00e21a804ba91650f7d60e66293a61dce0))

## [1.3.3](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.3.2...v1.3.3) (2022-05-17)

### Bug Fixes

- better clarification between the native and css tailwind plugins ([b484b54](https://github.com/marklawlor/tailwindcss-react-native/commit/b484b54ed7a60c0d05da65c9d29787286302de18))

# [1.4.0-next.1](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.3.2...v1.4.0-next.1) (2022-05-17)

### Features

- allow hairlineWidth as a theme value ([5cf20d0](https://github.com/marklawlor/tailwindcss-react-native/commit/5cf20d00e21a804ba91650f7d60e66293a61dce0))

## [1.3.2](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.3.1...v1.3.2) (2022-05-17)

### Bug Fixes

- child styles not working with non-styled components ([ac9ccb9](https://github.com/marklawlor/tailwindcss-react-native/commit/ac9ccb9b9353e9fa858f8f42868e23e983ba5dcf))
- **deps:** update dependency prism-react-renderer to v1.3.3 ([6905b42](https://github.com/marklawlor/tailwindcss-react-native/commit/6905b42218ac5e14d2cbd62564c844932fb0d72f))
- divide borders on incorrect side ([df400cf](https://github.com/marklawlor/tailwindcss-react-native/commit/df400cf93d69329b234147fdd79216b779783425))
- double borders when using divide ([b56b483](https://github.com/marklawlor/tailwindcss-react-native/commit/b56b483467bc0ee51876969b9d0b67ea26d3adfe))
- vertical spacing for gap-[n] and gap-y-[n] ([8b27cae](https://github.com/marklawlor/tailwindcss-react-native/commit/8b27cae15284fc9928adfc01f6dda93734777b35))

## [1.3.2-next.4](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.3.2-next.3...v1.3.2-next.4) (2022-05-17)

### Bug Fixes

- vertical spacing for gap-[n] and gap-y-[n] ([8b27cae](https://github.com/marklawlor/tailwindcss-react-native/commit/8b27cae15284fc9928adfc01f6dda93734777b35))

## [1.3.2-next.3](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.3.2-next.2...v1.3.2-next.3) (2022-05-16)

### Bug Fixes

- divide borders on incorrect side ([df400cf](https://github.com/marklawlor/tailwindcss-react-native/commit/df400cf93d69329b234147fdd79216b779783425))

## [1.3.2-next.2](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.3.2-next.1...v1.3.2-next.2) (2022-05-16)

### Bug Fixes

- **deps:** update dependency prism-react-renderer to v1.3.3 ([6905b42](https://github.com/marklawlor/tailwindcss-react-native/commit/6905b42218ac5e14d2cbd62564c844932fb0d72f))
- double borders when using divide ([b56b483](https://github.com/marklawlor/tailwindcss-react-native/commit/b56b483467bc0ee51876969b9d0b67ea26d3adfe))

## [1.3.2-next.1](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.3.1...v1.3.2-next.1) (2022-05-16)

### Bug Fixes

- child styles not working with non-styled components ([ac9ccb9](https://github.com/marklawlor/tailwindcss-react-native/commit/ac9ccb9b9353e9fa858f8f42868e23e983ba5dcf))

## [1.3.1](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.3.0...v1.3.1) (2022-05-12)

### Bug Fixes

- incorrect export for web tailwind plugin ([4d67abb](https://github.com/marklawlor/tailwindcss-react-native/commit/4d67abb82916ccb2232dc73ec6184d7758257161))

# [1.3.0](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.2.0...v1.3.0) (2022-05-12)

### Features

- export pre-styled React Native components ([02527fc](https://github.com/marklawlor/tailwindcss-react-native/commit/02527fc870844529c507972382e9a5cc7f3a2c61))

# [1.2.0](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.1.1...v1.2.0) (2022-05-11)

### Bug Fixes

- component context not being created ([8709a9d](https://github.com/marklawlor/tailwindcss-react-native/commit/8709a9d825333bb374835df730b64049f1368f34))
- missing initializer for tailwindcss_react_native_media ([e8493ac](https://github.com/marklawlor/tailwindcss-react-native/commit/e8493ac2655476d61f1ad3771d2a8236ebeff8c5))
- simplified sibling plugins ([d8a0383](https://github.com/marklawlor/tailwindcss-react-native/commit/d8a038313fb11af89f7090523dbd32a886de477e))

### Features

- add component ([09c8698](https://github.com/marklawlor/tailwindcss-react-native/commit/09c86983ed0c73a99b01d69a6eaa207f43e2fb2b))
- add flatten option of useTailwind ([9565c29](https://github.com/marklawlor/tailwindcss-react-native/commit/9565c29cbc13d436e5d0017612ee3142a6937fbe))
- add hover, focus & active pseudo-classes ([da3c8f4](https://github.com/marklawlor/tailwindcss-react-native/commit/da3c8f4e2bc72b53f6c78ed286aba0a6aeef8f6f))
- support divide, space & gap ([3ce837e](https://github.com/marklawlor/tailwindcss-react-native/commit/3ce837eccec1c894783f8d230007169a5803267f))

# [1.2.0-next.6](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.2.0-next.5...v1.2.0-next.6) (2022-05-11)

### Features

- add flatten option of useTailwind ([9565c29](https://github.com/marklawlor/tailwindcss-react-native/commit/9565c29cbc13d436e5d0017612ee3142a6937fbe))

# [1.2.0-next.5](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.2.0-next.4...v1.2.0-next.5) (2022-05-11)

### Bug Fixes

- component context not being created ([8709a9d](https://github.com/marklawlor/tailwindcss-react-native/commit/8709a9d825333bb374835df730b64049f1368f34))

# [1.2.0-next.4](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.2.0-next.3...v1.2.0-next.4) (2022-05-11)

### Features

- add component ([09c8698](https://github.com/marklawlor/tailwindcss-react-native/commit/09c86983ed0c73a99b01d69a6eaa207f43e2fb2b))

# [1.2.0-next.3](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.2.0-next.2...v1.2.0-next.3) (2022-05-11)

### Bug Fixes

- missing initializer for tailwindcss_react_native_media ([e8493ac](https://github.com/marklawlor/tailwindcss-react-native/commit/e8493ac2655476d61f1ad3771d2a8236ebeff8c5))

# [1.2.0-next.2](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.2.0-next.1...v1.2.0-next.2) (2022-05-11)

### Features

- add hover, focus & active pseudo-classes ([da3c8f4](https://github.com/marklawlor/tailwindcss-react-native/commit/da3c8f4e2bc72b53f6c78ed286aba0a6aeef8f6f))

# [1.2.0-next.1](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.1.0...v1.2.0-next.1) (2022-05-10)

### Bug Fixes

- simplified sibling plugins ([d8a0383](https://github.com/marklawlor/tailwindcss-react-native/commit/d8a038313fb11af89f7090523dbd32a886de477e))

### Features

- support divide, space & gap ([3ce837e](https://github.com/marklawlor/tailwindcss-react-native/commit/3ce837eccec1c894783f8d230007169a5803267f))

# [1.1.0](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.6...v1.1.0) (2022-05-10)

### Bug Fixes

- transform merging ([9f41434](https://github.com/marklawlor/tailwindcss-react-native/commit/9f4143467e427bd18e37a7acdf8a74acd15498ca))

### Features

- elevation ([2c2a4ac](https://github.com/marklawlor/tailwindcss-react-native/commit/2c2a4ac91b7c63c18235a2a7d869c41190eac5db))
- support 'shadow' ([0839f3e](https://github.com/marklawlor/tailwindcss-react-native/commit/0839f3e4c6f8a0858057f5ba1d5652a22e41510e))
- support aspect ratio media queries ([94b9c48](https://github.com/marklawlor/tailwindcss-react-native/commit/94b9c487d8dfa342de5e818f58350a894d496f45))

# [1.1.0-next.4](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.1.0-next.3...v1.1.0-next.4) (2022-05-10)

### Features

- support aspect ratio media queries ([94b9c48](https://github.com/marklawlor/tailwindcss-react-native/commit/94b9c487d8dfa342de5e818f58350a894d496f45))

# [1.1.0-next.3](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.1.0-next.2...v1.1.0-next.3) (2022-05-10)

### Features

- support 'shadow' ([0839f3e](https://github.com/marklawlor/tailwindcss-react-native/commit/0839f3e4c6f8a0858057f5ba1d5652a22e41510e))

# [1.1.0-next.2](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.1.0-next.1...v1.1.0-next.2) (2022-05-10)

### Bug Fixes

- transform merging ([9f41434](https://github.com/marklawlor/tailwindcss-react-native/commit/9f4143467e427bd18e37a7acdf8a74acd15498ca))

# [1.1.0-next.1](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.6...v1.1.0-next.1) (2022-05-09)

### Features

- elevation ([2c2a4ac](https://github.com/marklawlor/tailwindcss-react-native/commit/2c2a4ac91b7c63c18235a2a7d869c41190eac5db))

## [1.0.6](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.5...v1.0.6) (2022-05-09)

### Bug Fixes

- passing tw output to external libraries ([2bc1afb](https://github.com/marklawlor/tailwindcss-react-native/commit/2bc1afb95dd9dd54a07a7ccd5c99b5abd25bb153))

## [1.0.5](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.4...v1.0.5) (2022-05-09)

### Bug Fixes

- tw getComputedStyle ([b322373](https://github.com/marklawlor/tailwindcss-react-native/commit/b322373a348aeead5a4f49c275e5dd9607eaae8a))
- tw getComputedStyle for web preview ([dbbc588](https://github.com/marklawlor/tailwindcss-react-native/commit/dbbc58811881993eaba1b4a3ec6bf3eb1195ea16))
- useTailwind types ([df7db9c](https://github.com/marklawlor/tailwindcss-react-native/commit/df7db9cc8916f2ef4b23710d9ef1e4e9c40c16cf))
- useTailwind types ([be362ec](https://github.com/marklawlor/tailwindcss-react-native/commit/be362ec33428c35512efcc809581c3c7a0a00457))

## [1.0.5-next.3](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.5-next.2...v1.0.5-next.3) (2022-05-09)

### Bug Fixes

- tw getComputedStyle for web preview ([dbbc588](https://github.com/marklawlor/tailwindcss-react-native/commit/dbbc58811881993eaba1b4a3ec6bf3eb1195ea16))

## [1.0.5-next.2](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.5-next.1...v1.0.5-next.2) (2022-05-09)

### Bug Fixes

- useTailwind types ([df7db9c](https://github.com/marklawlor/tailwindcss-react-native/commit/df7db9cc8916f2ef4b23710d9ef1e4e9c40c16cf))
- useTailwind types ([be362ec](https://github.com/marklawlor/tailwindcss-react-native/commit/be362ec33428c35512efcc809581c3c7a0a00457))

## [1.0.5-next.1](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.4...v1.0.5-next.1) (2022-05-09)

### Bug Fixes

- tw getComputedStyle ([b322373](https://github.com/marklawlor/tailwindcss-react-native/commit/b322373a348aeead5a4f49c275e5dd9607eaae8a))

## [1.0.4](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.3...v1.0.4) (2022-05-08)

### Bug Fixes

- rendering nested child styled components ([a69f600](https://github.com/marklawlor/tailwindcss-react-native/commit/a69f600787dc7ff080f7539f4dfc4b8be3b770dc))

## [1.0.3](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.2...v1.0.3) (2022-05-07)

### Bug Fixes

- move @babel/types to dependencies ([883b5f3](https://github.com/marklawlor/tailwindcss-react-native/commit/883b5f3558b4c3579219ec2c930de254b0588c76))
- move @babel/types to dependencies ([065f9a9](https://github.com/marklawlor/tailwindcss-react-native/commit/065f9a9cc17a47d68f3cf4395cd6fc9cca79d82a))

## [1.0.2](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.1...v1.0.2) (2022-05-06)

### Bug Fixes

- useTailwind should correctly respect preview for css styles ([6632160](https://github.com/marklawlor/tailwindcss-react-native/commit/6632160d07291657662fd224d73c8b87ee339ed1))

## [1.0.1](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.0...v1.0.1) (2022-05-05)

### Bug Fixes

- ci versioning ([f2374e3](https://github.com/marklawlor/tailwindcss-react-native/commit/f2374e3e30b51d2e9844ce0cec9eed0e2b37c18e))
- **deps:** update docusaurus monorepo to v2.0.0-beta.20 ([1d0e361](https://github.com/marklawlor/tailwindcss-react-native/commit/1d0e361c9689fdf873a5177fad3bbebb78acb7b4))

## [1.0.1-next.1](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.0...v1.0.1-next.1) (2022-05-05)

### Bug Fixes

- ci versioning ([f2374e3](https://github.com/marklawlor/tailwindcss-react-native/commit/f2374e3e30b51d2e9844ce0cec9eed0e2b37c18e))

# [1.0.0](https://github.com/marklawlor/tailwindcss-react-native/compare/v0.1.7...v1.0.0) (2022-05-05)

### Bug Fixes

- add output option to postcss plugin ([0a910de](https://github.com/marklawlor/tailwindcss-react-native/commit/0a910dee36cfba09dc6531d03330d52a65f236ed))
- add plugin.js to npm. lint fixes ([5c0c74d](https://github.com/marklawlor/tailwindcss-react-native/commit/5c0c74de6aad834bcf3f72fa65f743eac4a8db45))
- cli watch flag ([c972e06](https://github.com/marklawlor/tailwindcss-react-native/commit/c972e062c4ebfa27db5516dd5b1e97e75b526989))
- **deps:** pin dependencies ([58e090d](https://github.com/marklawlor/tailwindcss-react-native/commit/58e090dd56b707b96aba9f3163eac1acf6d3ecc2))
- **deps:** update docusaurus monorepo to v2.0.0-beta.19 ([3206a8a](https://github.com/marklawlor/tailwindcss-react-native/commit/3206a8a7a2dd145110694f9e8f12b784e0a8f2c4))
- expose postcss plugin ([ff7f0fc](https://github.com/marklawlor/tailwindcss-react-native/commit/ff7f0fc2d3fb1b2cfa880c9fcd25a727771130c1))
- hmr=false was processes all files ([9fda8ea](https://github.com/marklawlor/tailwindcss-react-native/commit/9fda8eab87f728bb57e23501856b175033dd3766))
- improvements to platform prefixes ([3496060](https://github.com/marklawlor/tailwindcss-react-native/commit/3496060bc0a2d7952ec2de3fb940a4e1a51cca56))
- postcss plugin not compiling variables ([4742d58](https://github.com/marklawlor/tailwindcss-react-native/commit/4742d5828ed2ac9e07073c2263f51790a0f3ec79))
- production dependencies ([683a7e9](https://github.com/marklawlor/tailwindcss-react-native/commit/683a7e96d115c3967e00e04fb5865118aa74d474))
- revert back to npm lockfile 1 for node 14 support ([f718884](https://github.com/marklawlor/tailwindcss-react-native/commit/f7188848a57779a051f1dd8bc31fca03eea23943))
- selector generation when using important ([b39125d](https://github.com/marklawlor/tailwindcss-react-native/commit/b39125d9a84d1190ec6628db01ad750e3b45dc13))
- updated dependencies ([e128db7](https://github.com/marklawlor/tailwindcss-react-native/commit/e128db763a5a6e9e79772d3940476c44b4f630b9))

### Features

- add feature preview flag ([9397e67](https://github.com/marklawlor/tailwindcss-react-native/commit/9397e67cffd9691a193ad8c8271099fc28a93548))
- basic platform variant matching ([22da605](https://github.com/marklawlor/tailwindcss-react-native/commit/22da605c245b8339b7a8b70424a3d7192a97fe92))
- change useTailwind to a factory function ([56b4a29](https://github.com/marklawlor/tailwindcss-react-native/commit/56b4a29941d82fb415977fdfbebd852060659982))
- new babel modes ([4c5741f](https://github.com/marklawlor/tailwindcss-react-native/commit/4c5741fff6321211339e1919a47ca414d0a1eaae))
- rename allowModules and blockModules ([cae86cf](https://github.com/marklawlor/tailwindcss-react-native/commit/cae86cf93edfb10133a0b89ee0c1dde907241001))
- rewrite extract native styles logic ([30c5b76](https://github.com/marklawlor/tailwindcss-react-native/commit/30c5b76a4a7f7fcc234375d1b5035dee2a41ee22))

### BREAKING CHANGES

- skipTransform: true has been changed to mode: "compileOnly"

# [1.0.0-next.10](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.0-next.9...v1.0.0-next.10) (2022-05-05)

### Features

- add feature preview flag ([06d3f46](https://github.com/marklawlor/tailwindcss-react-native/commit/06d3f46106fa91be08d3f87400cd87d21bc5bb98))

# [1.0.0-next.9](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.0-next.8...v1.0.0-next.9) (2022-05-05)

### Bug Fixes

- production dependencies ([675d00f](https://github.com/marklawlor/tailwindcss-react-native/commit/675d00f9174a701aed5a131daaff98df592d2389))

# [1.0.0-next.8](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.0-next.7...v1.0.0-next.8) (2022-05-05)

### Bug Fixes

- postcss plugin not compiling variables ([fdd14fe](https://github.com/marklawlor/tailwindcss-react-native/commit/fdd14fe4628a504342377ce7cd3e77555e5d41a9))
- updated dependencies ([06ee26b](https://github.com/marklawlor/tailwindcss-react-native/commit/06ee26b092793e11a40ebe62d90153823b60a3a2))

# [1.0.0-next.7](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.0-next.6...v1.0.0-next.7) (2022-05-05)

### Bug Fixes

- add output option to postcss plugin ([e11a066](https://github.com/marklawlor/tailwindcss-react-native/commit/e11a066c22a3f78955b6a2267fb27d2801b2d0b2))

# [1.0.0-next.6](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.0-next.5...v1.0.0-next.6) (2022-05-05)

### Bug Fixes

- expose postcss plugin ([e0a1c3c](https://github.com/marklawlor/tailwindcss-react-native/commit/e0a1c3cb8f933f34029fb678f672ae0b0dca71a9))

### Features

- new babel modes ([461f476](https://github.com/marklawlor/tailwindcss-react-native/commit/461f47697dfd27458c2da80230b3eca848f68040))

### BREAKING CHANGES

- skipTransform: true has been changed to mode: "compileOnly"

# [1.0.0-next.5](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.0-next.4...v1.0.0-next.5) (2022-05-05)

### Features

- rename allowModules and blockModules ([46d52bc](https://github.com/marklawlor/tailwindcss-react-native/commit/46d52bc160b700c65c691d08f7f5ef3af508cf5d))

# [1.0.0-next.4](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.0-next.3...v1.0.0-next.4) (2022-05-04)

### Bug Fixes

- **deps:** update docusaurus monorepo to v2.0.0-beta.19 ([a381ad2](https://github.com/marklawlor/tailwindcss-react-native/commit/a381ad25a9ee9b9dcb63a1d06b3ee02e76e1725e))

# [1.0.0-next.3](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.0-next.2...v1.0.0-next.3) (2022-05-03)

### Bug Fixes

- **deps:** pin dependencies ([f51b499](https://github.com/marklawlor/tailwindcss-react-native/commit/f51b4994f95cddb96c6db67d9969ec363ed761a5))

# [1.0.0-next.2](https://github.com/marklawlor/tailwindcss-react-native/compare/v1.0.0-next.1...v1.0.0-next.2) (2022-05-03)

### Bug Fixes

- auto publish ([e964d64](https://github.com/marklawlor/tailwindcss-react-native/commit/e964d64110ebc6f4fbc6844e9bc3c3b722379d9b))

# [1.0.0-next.1](https://github.com/marklawlor/tailwindcss-react-native/compare/v0.2.0-next.1...v1.0.0-next.1) (2022-05-03)

### Features

- v1 ([67ec4e0](https://github.com/marklawlor/tailwindcss-react-native/commit/67ec4e04e186c31a24f4a438f10ed0fc27b1a566))

### BREAKING CHANGES

- useTailwind is now a factory function

# [0.2.0-next.1](https://github.com/marklawlor/tailwindcss-react-native/compare/v0.1.7...v0.2.0-next.1) (2022-05-03)

### Bug Fixes

- add plugin.js to npm. lint fixes ([5c0c74d](https://github.com/marklawlor/tailwindcss-react-native/commit/5c0c74de6aad834bcf3f72fa65f743eac4a8db45))
- cli watch flag ([c972e06](https://github.com/marklawlor/tailwindcss-react-native/commit/c972e062c4ebfa27db5516dd5b1e97e75b526989))
- hmr=false was processes all files ([9fda8ea](https://github.com/marklawlor/tailwindcss-react-native/commit/9fda8eab87f728bb57e23501856b175033dd3766))
- improvements to platform prefixes ([3496060](https://github.com/marklawlor/tailwindcss-react-native/commit/3496060bc0a2d7952ec2de3fb940a4e1a51cca56))
- revert back to npm lockfile 1 for node 14 support ([f718884](https://github.com/marklawlor/tailwindcss-react-native/commit/f7188848a57779a051f1dd8bc31fca03eea23943))
- selector generation when using important ([b39125d](https://github.com/marklawlor/tailwindcss-react-native/commit/b39125d9a84d1190ec6628db01ad750e3b45dc13))

### Features

- basic platform variant matching ([22da605](https://github.com/marklawlor/tailwindcss-react-native/commit/22da605c245b8339b7a8b70424a3d7192a97fe92))
- change useTailwind to a factory function ([56b4a29](https://github.com/marklawlor/tailwindcss-react-native/commit/56b4a29941d82fb415977fdfbebd852060659982))
- rewrite extract native styles logic ([30c5b76](https://github.com/marklawlor/tailwindcss-react-native/commit/30c5b76a4a7f7fcc234375d1b5035dee2a41ee22))
