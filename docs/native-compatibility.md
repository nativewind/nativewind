# React Native Compatibility

This library is still in development. This document helps track what classes are currently supported, but is not a complete list

| Icon               | Legend                |
| ------------------ | --------------------- |
| :heavy_check_mark: | Supported             |
| :x:                | Not supported         |
| :construction:     | Under development     |
| :boom:             | Not handled correctly |

### Aspect Ratio

| Class          | Supported            |
| -------------- | -------------------- |
| aspect-auto    | :heavy_check_mark: |
| aspect-square  | :heavy_check_mark: |
| aspect-video   | :heavy_check_mark: |
| aspect-{ratio} | :heavy_check_mark: |
| aspect-[ratio] | :heavy_check_mark: |

### Container

| Class     | Supported          |
| --------- | ------------------ |
| container | :heavy_check_mark: |

### Columns

Use a `FlatList` with `numColumns` set instead.

| Class      | Supported |
| ---------- | --------- |
| column-{n} | :x:       |
| column-[n] | :x:       |

### Break After/Before/Inside

| Class                 | Supported |
| --------------------- | --------- |
| break-after-{option}  | :x:       |
| break-before-{option} | :x:       |
| break-inside-{option} | :x:       |

### Box Decoration Break

| Class                | Supported |
| -------------------- | --------- |
| box-decoration-clone | :x:       |
| box-decoration-slice | :x:       |

### Box Decoration Break

React Native only supports `border-box`.

| Class       | Supported          |
| ----------- | ------------------ |
| box-border  | :heavy_check_mark: |
| box-content | :x:                |
