![Medusa Plugin Summary made by SpearDevs](https://github.com/SpearDevs/medusa-plugin-summary/assets/)

## Caution is advised when deploying this plugin in production, as it is in the MVP stage. While stable, ongoing improvements may be in progress.

# Plugin Summary

See your sales at a glance.

[SpearDevs Website](https://speardevs.com)

## Features

-
-
-

---

## Planned Features

-
-
-

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

```bash
npm install medusa-plugin-summary
```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

```js
const plugins = [
  // ...
  {
    resolve: `medusa-plugin-summary`,
    options: {
      enableUI: true,
    },
  },
]
```
