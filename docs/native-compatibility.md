# React Native Compatibility

This library is still in development. This document helps track what classes are currently supported, but is not a complete list

| Icon               | Legend                |
| ------------------ | --------------------- |
| :heavy_check_mark: | Supported             |
| :white_check_mark: | Partial support       |
| :x:                | Not supported         |
| :construction:     | Needs development     |
| :boom:             | Not handled correctly |

## Table of contents

### Layout

- [Aspect Ratio :heavy_check_mark:](#aspect-ratio)
- [Container :heavy_check_mark:](#container)
- [Columns :x:](#columns)
- [Break After :x:](#break-after)
- [Break Before :x:](#break-before)
- [Break Inside :x:](#break-inside)
- [Box Decoration Break :x:](#box-decoration-break)
- [Box Sizing :x:](#box-sizing)
- [Display :white_check_mark:](#display)
- [Floats](#float)
- [Clear](#clear)
- [Isolation](#isolation)
- [Object Fit](#object-fit)
- [Object Position](#object-position)
- [Overflow](#overflow)
- [Overscroll Behavior](#overscroll-behavior)
- [Position](#position)
- [Top / Right / Bottom / Left](#top-right-bottom-left)
- [Visibility](#visibility)
- [Z-Index](#z-index)

### Flexbox & Grid

- [Flex Basis](#flex-basis)
- [Flex Direction](#flex-direction)
- [Flex Wrap](#flex-wrap)
- [Flex](#flex)
- [Flex Grow](#flex-grow)
- [Flex Shrink](#flex-shrink)
- [Order](#order)
- [Grid Template Columns](#grid-template-columns)
- [Grid Column Start / End](#grid-column)
- [Grid Template Rows](#grid-template-rows)
- [Grid Row Start / End](#grid-row)
- [Grid Auto Flow](#grid-auto-flow)
- [Grid Auto Columns](#grid-auto-columns)
- [Grid Auto Rows](#grid-auto-rows)
- [Gap](#gap)
- [Justify Content](#justify-content)
- [Justify Items](#justify-items)
- [Justify Self](#justify-self)
- [Align Content](#align-content)
- [Align Items](#align-items)
- [Align Self](#align-self)
- [Place Content](#place-content)
- [Place Items](#place-items)
- [Place Self](#place-self)

### Spacing

- [Padding](#padding)
- [Margin](#margin)
- [Space Between](#space)

### Sizing

- [Width](#width)
- [Min-Width](#min-width)
- [Max-Width](#max-width)
- [Height](#height)
- [Min-Height](#min-height)
- [Max-Height](#max-height)

### Typography

- [Font Family](#font-family)
- [Font Size](#font-size)
- [Font Smoothing](#font-smoothing)
- [Font Style](#font-style)
- [Font Weight](#font-weight)
- [Font Variant Numeric](#font-variant-numeric)
- [Letter Spacing](#letter-spacing)
- [Line Height](#line-height)
- [List Style Type](#list-style-type)
- [List Style Position](#list-style-position)
- [Text Align](#text-align)
- [Text Color](#text-color)
- [Text Decoration](#text-decoration)
- [Text Decoration Color](#text-decoration-color)
- [Text Decoration Style](#text-decoration-style)
- [Text Decoration Thickness](#text-decoration-thickness)
- [Text Underline Offset](#text-underline-offset)
- [Text Transform](#text-transform)
- [Text Overflow](#text-overflow)
- [Text Indent](#text-indent)
- [Vertical Align](#vertical-align)
- [Whitespace](#whitespace)
- [Word Break](#word-break)
- [Content](#content)

### Backgrounds

- [Background Attachment](#background-attachment)
- [Background Clip](#background-clip)
- [Background Color](#background-color)
- [Background Origin](#background-origin)
- [Background Position](#background-position)
- [Background Repeat](#background-repeat)
- [Background Size](#background-size)
- [Background Image](#background-image)
- [Gradient Color Stops](#gradient-color-stops)

### Borders

- [Border Radius](#border-radius)
- [Border Width](#border-width)
- [Border Color](#border-color)
- [Border Style](#border-style)
- [Divide Width](#divide-width)
- [Divide Color](#divide-color)
- [Divide Style](#divide-style)
- [Outline Width](#outline-width)
- [Outline Color](#outline-color)
- [Outline Style](#outline-style)
- [Outline Offset](#outline-offset)
- [Ring Width](#ring-width)
- [Ring Color](#ring-color)
- [Ring Offset Width](#ring-offset-width)
- [Ring Offset Color](#ring-offset-color)

### Effects

- [Box Shadow](#box-shadow)
- [Box Shadow Color](#box-shadow-color)
- [Opacity](#opacity)
- [Mix Blend Mode](#mix-blend-mode)
- [Background Blend Mode](#background-blend-mode)

### Filters

- [Blur](#blur)
- [Brightness](#brightness)
- [Contrast](#contrast)
- [Drop Shadow](#drop-shadow)
- [Grayscale](#grayscale)
- [Hue Rotate](#hue-rotate)
- [Invert](#invert)
- [Saturate](#saturate)
- [Sepia](#sepia)
- [Backdrop Blur](#backdrop-blur)
- [Backdrop Brightness](#backdrop-brightness)
- [Backdrop Contrast](#backdrop-contrast)
- [Backdrop Grayscale](#backdrop-grayscale)
- [Backdrop Hue Rotate](#backdrop-hue-rotate)
- [Backdrop Invert](#backdrop-invert)
- [Backdrop Opacity](#backdrop-opacity)
- [Backdrop Saturate](#backdrop-saturate)
- [Backdrop Sepia](#backdrop-sepia)

### Tables

- [Border Collapse](#border-collapse)
- [Table Layout](#table-layout)

### Transitions & Animation

- [Transition Property](#transition-property)
- [Transition Duration](#transition-duration)
- [Transition Timing Function](#transition-timing-function)
- [Transition Delay](#transition-delay)
- [Animation](#animation)

### Transforms

- [Scale](#scale)
- [Rotate](#rotate)
- [Translate](#translate)
- [Skew](#skew)
- [Transform Origin](#transform-origin)

### Interactivity

- [Accent Color](#accent-color)
- [Appearance](#appearance)
- [Cursor](#cursor)
- [Caret Color](#caret-color)
- [Pointer Events](#pointer-events)
- [Resize](#resize)
- [Scroll Behavior](#scroll-behavior)
- [Scroll Margin](#scroll-margin)
- [Scroll Padding](#scroll-padding)
- [Scroll Snap Align](#scroll-snap-align)
- [Scroll Snap Stop](#scroll-snap-stop)
- [Scroll Snap Type](#scroll-snap-type)
- [Touch Action](#touch-action)
- [User Select](#user-select)
- [Will Change](#will-change)

### SVG

- [Fill](#fill)
- [Stroke](#stroke)
- [Stroke Width](#stroke-width)

### Accessibility

- [Screen Readers](#screen-readers)

### Aspect Ratio

| Class          | Supported          |
| -------------- | ------------------ |
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

### Box Sizing

React Native does not support changing the box sizing

| Class       | Supported |
| ----------- | --------- |
| box-border  | :x:       |
| box-content | :x:       |

### Display

React Native only supports `flex` or `none`

| Class              | Supported          |
| ------------------ | ------------------ |
| flex               | :heavy_check_mark: |
| none               | :heavy_check_mark: |
| block              | :x:                |
| inline-block       | :x:                |
| inline             | :x:                |
| inline-flex        | :x:                |
| table              | :x:                |
| inline-table       | :x:                |
| table-caption      | :x:                |
| table-cell         | :x:                |
| table-column       | :x:                |
| table-column-group | :x:                |
| table-footer-group | :x:                |
| table-header-group | :x:                |
| table-row-group    | :x:                |
| table-row          | :x:                |
| flow-root          | :x:                |
| grid               | :x:                |
| inline-grid        | :x:                |
| contents           | :x:                |
| list-item          | :x:                |

### Floats

React Native does not support floats. Use Flexbox instead

| Class       | Supported |
| ----------- | --------- |
| float-right | :x:       |
| float-left  | :x:       |
| float-none  | :x:       |

### Clear

React Native does not support clearning floats. Use Flexbox instead

| Class       | Supported |
| ----------- | --------- |
| clear-right | :x:       |
| clear-left  | :x:       |
| clear-both  | :x:       |
| clear-none  | :x:       |

### Isolation

| Class        | Supported |
| ------------ | --------- |
| isolate      | :x:       |
| isolate-auto | :x:       |

### Object Fit

| Class             | Supported |
| ----------------- | --------- |
| object-contain    | :x:       |
| object-cover      | :x:       |
| object-fill       | :x:       |
| object-none       | :x:       |
| object-scale-down | :x:       |

### Object Position

| Class               | Supported |
| ------------------- | --------- |
| object-bottom       | :x:       |
| object-center       | :x:       |
| object-left         | :x:       |
| object-left-bottom  | :x:       |
| object-left-top     | :x:       |
| object-right        | :x:       |
| object-right-bottom | :x:       |
| object-right-top    | :x:       |
| object-top          | :x:       |

### Overflow

| Class              | Supported          |
| ------------------ | ------------------ |
| overflow-visible   | :heavy_check_mark: |
| overflow-hidden    | :heavy_check_mark: |
| overflow-scroll    | :heavy_check_mark: |
| overflow-auto      | :x:                |
| overflow-clip      | :x:                |
| overflow-x-auto    | :x:                |
| overflow-y-auto    | :x:                |
| overflow-x-hidden  | :x:                |
| overflow-y-hidden  | :x:                |
| overflow-x-clip    | :x:                |
| overflow-y-clip    | :x:                |
| overflow-x-visible | :x:                |
| overflow-y-visible | :x:                |
| overflow-x-scroll  | :x:                |
| overflow-y-scroll  | :x:                |

### Overscroll Behavior

| Class                | Supported |
| -------------------- | --------- |
| overscroll-auto      | :x:       |
| overscroll-contain   | :x:       |
| overscroll-none      | :x:       |
| overscroll-y-auto    | :x:       |
| overscroll-y-contain | :x:       |
| overscroll-y-none    | :x:       |
| overscroll-x-auto    | :x:       |
| overscroll-x-contain | :x:       |
| overscroll-x-none    | :x:       |

### Position

| Class    | Supported          |
| -------- | ------------------ |
| absolute | :heavy_check_mark: |
| relative | :heavy_check_mark: |
| static   | :x:                |
| fixed    | :x:                |
| stick    | :x:                |
