# Tool modules

Add a tool as its own folder, for example `src/features/json-formatter/`, with:

- `index.ts` exporting the lazy component
- the React view
- pure logic and types

Register it once in `src/services/toolRegistry.ts`. Home, search, categories, favorites, and recent read that registry.

Category folders:

- `file-tools`
- `image-tools`
- `pdf-tools`
- `developer-tools`
- `internet-tools`
- `system-tools`
- `text-tools`
- `calculator-tools`
