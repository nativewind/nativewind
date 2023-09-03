# Units

## Polyfilled Units

You can use these units within your `tailwind.config.js`

<table>
  <tbody style={{ display: "table", width: "100%" }}>
    <tr>
      <th>Unit</th>
      <th>Name</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>vw</td>
      <td>View Width</td>
      <td>Polyfilled using Dimensions.get('window')</td>
    </tr>
    <tr>
      <td>vh</td>
      <td>View height</td>
      <td>Polyfilled using Dimensions.get('window')</td>
    </tr>
  </tbody>
</table>

## New Units

These are new units that you available to use within your `tailwind.config.js`

<table>
  <tbody style={{ display: "table", width: "100%" }}>
    <tr>
      <th>Unit</th>
      <th>Name</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>cw</td>
      <td>Component width percentage</td>
      <td>Polyfills percentage values based on the component width, e.g `translateX` does not accept a percentage on native. Uses onLayout to measure the component. Non-fiber apps may see a flicker until the component is measured</td>
    </tr>
    <tr>
      <td>ch</td>
      <td>Component height percentage</td>
      <td>Polyfills percentage values based on the component height, e.g `translateY` does not accept a percentage on native. Uses onLayout to measure the component. Non-fiber apps may see a flicker until the component is measured</td>
    </tr>
  </tbody>
</table>
