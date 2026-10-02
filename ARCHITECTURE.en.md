# DeskTools architecture and behavior

The same text in Turkish: [ARCHITECTURE.md](ARCHITECTURE.md)

This file is for a person or a model opening the project on another computer. It explains what the app is, what it does, how the layers connect, and where a change belongs. The code is in English. The interface text is in Turkish and English.

The current behavior is in this file and in the Turkish copy. Some installation and release sentences in `README.md` are old. When they disagree, these files and the source code win.

When the behavior or the architecture changes, update this file and the Turkish copy in the same change. Add or remove a tool, route, permission, storage file, or a step that starts or stops working. A wording or test-only edit does not require these files.

## What it is

DeskTools is an offline-capable desktop toolbox for Windows 10/11 x64. One window holds file, image, PDF, developer, internet, system, text, and calculator tools. Tools do not share each other's state. A new tool is added in its own folder and in one registry.

The product name is DeskTools. The package name is `desktools`. The Tauri identifier is `com.desktools.desktop`. The source repository is `https://github.com/claireass/desktools`, branch `main`. The version at the time of this writing is **0.6.2**.

The installed app is DeskTools in the Start menu. The window opened by `npm run tauri dev` is the development window. Test an update from the installed app. The development window already runs the version in the source tree, so it does not see an update for itself.

## Technology

- Interface: React 19, TypeScript, Vite, Tailwind CSS 4, React Router, Zustand, Lucide
- Desktop shell: Tauri 2, Rust
- Persistent data: `@tauri-apps/plugin-store`
- Logging: `@tauri-apps/plugin-log`
- Updates: `@tauri-apps/plugin-updater` and restart from `@tauri-apps/plugin-process`
- External link: `@tauri-apps/plugin-opener`, only to open the repository address
- Tests: Vitest. Format: Prettier, double quotes, print width 90. Lint: ESLint

In the browser, `npm run dev` serves `http://localhost:1420`. That session is not Tauri. Settings stay in that tab's memory and disappear on refresh.

## Folders

- `src/app`: `App`, providers, and routes
- `src/components`: shell, sidebar, search, theme, buttons, and empty states
- `src/pages`: Home, category, tool, favorites, recent, settings, about
- `src/features/<tool-id>`: a tool's view, pure logic, and the `index.ts` default export
- `src/services`: tool registry, search, persistence, updates, platform check
- `src/stores`: Zustand stores
- `src/i18n/messages.ts`: the single list of Turkish and English text
- `src/constants/appConfig.ts`: name, repository owner, repository name, update channel
- `src-tauri`: Rust shell, window, capabilities, NSIS installer, updater settings
- `tests`: Vitest unit tests
- `scripts/check-version.mjs`: checks that the three version files match

The version must match in three places: `package.json`, `src-tauri/tauri.conf.json`, and `src-tauri/Cargo.toml`. Vite injects the `package.json` version into the interface as `__APP_VERSION__`. `npm run check:version` fails when they differ. The `desktools` entry in `package-lock.json` and `src-tauri/Cargo.lock` is moved to the same version. Other packages are left alone.

## Startup

1. `src/main.tsx` mounts the React tree.
2. On first run, `AppProviders` calls `requestHydrate()` and opens `BrowserRouter`.
3. `ThemeSync` applies the theme preference to the window. On the desktop this uses the Tauri window theme permission.
4. `AppShell` shows the sidebar, header, and page content through `Outlet`.
5. The first launch shows a welcome dialog. "Start" saves `hasCompletedOnboarding`.

Routes live in `src/app/routes.tsx`:

- `/` home
- `/favorites` favorites
- `/recent` recent tools
- `/category/:categoryId` category
- `/tool/:toolId` tool
- `/settings` settings
- `/about` about

On first run the language is Turkish when the browser language starts with `tr`, otherwise English. The theme can be `system`, `light`, or `dark`.

## How tools work

Every tool is in the `tools` array in `src/services/toolRegistry.ts`. Each entry has an `id`, translation keys, a category, an icon name, search tags, and a `load` function. `load` imports that tool's default React component with `import("@/features/<id>")`.

The `/tool/:toolId` page finds the tool in the registry, translates the title and description, loads the component once and keeps it in memory, and records it as recent. An id that is not registered shows an empty state.

Search opens with Ctrl+K. The query is scored against the translated name, description, category, and tags. There is no network call.

Order for adding a tool:

1. Under `src/features/<tool-id>/`, add pure logic (`logic.ts`), the view, and `export { View as default }` in `index.ts`.
2. One entry in the `toolRegistry.ts` array.
3. The same keys in `src/i18n/messages.ts`, Turkish first and English second. The English object must contain every Turkish key. TypeScript fails the build when a key is missing.
4. The new id in the sorted id list in `tests/toolSearch.test.ts`.
5. A unit test for the logic.

Tools do not read each other's stores. Shared needs go in `src/utils` or a shared folder under `src/features`. Examples: `image-shared`, `pdf-shared`.

## Tools

The ids are the names in the registry.

Files:

- `file-info`: name, extension, and size of a selected file
- `size-analyzer`: sizes of selected files and which one is largest
- `file-renamer`: preview of new names. Valid copies can be downloaded. The original file stays unchanged

Images:

- `image-converter`, `image-resizer`, `image-compressor`: produce a copy on a canvas and download it. The original file stays where it is

PDF:

- `pdf-merge`, `pdf-split`, `pdf-extract`: build a new PDF in memory with `pdf-lib` and download it. The original file stays unchanged

Developer:

- `json-formatter`: formats JSON or minifies it onto one line
- `url-codec`: `encodeURIComponent` and `decodeURIComponent`
- `timestamp`: Unix time and a UTC date, in seconds or milliseconds
- `regex-tester`: tests a pattern in a separate Worker. The Worker is stopped if it runs longer than one second. A pattern may be at most 200 characters and the sample at most 10000. At most 50 matches are shown
- `jwt-decoder`: reads the header and payload locally. It does not verify the signature. It warns when the algorithm is `none` or the signature is empty. A token longer than 8192 characters is rejected
- `cron`: walks minute by minute, up to one year ahead, for the next UTC runs of a five-field cron expression. When both the day of the month and the weekday are restricted, either one is enough. In the weekday field, 0 is Sunday
- `base64`: encode and decode text
- `uuid-generator`: a random UUID
- `password-generator`: creates a password with `crypto.getRandomValues`. The password is not saved and is not written to the log. Length is from 8 to 128. Entropy is the approximate size of the selected alphabet in bits
- `hash-generator`: MD5, SHA-1, SHA-256, SHA-512

The internet category does not contact the network. The calculations stay local:

- `url-parser`: scheme, host, path, query, and fragment of an address
- `subnet-calculator`: IPv4 subnet
- `http-status`: explanations of known status codes

System:

- `clipboard`: the clipboard is read only when the button is pressed
- `system-info`: session details. On the desktop, the operating system and architecture are added

Text:

- `text-counter`, `case-converter`, `line-tools`
- Turkish uppercase uses `toLocaleUpperCase("tr")`

Calculators:

- `calculator`, `percentage`, `unit-converter`, `date-calculator`
- Date differences are UTC calendar days

## Persistent data

On the desktop, three files are written to the app data directory through the Tauri store:

- `settings.json`
- `favorites.json`
- `recent.json`

Favorites are an array of tool ids. Recent tools keep at most 30 entries.

Settings fields: `theme`, `locale`, `sidebarCollapsed`, `hasCompletedOnboarding`, `launchAtStartup`, `closeToTray`, `checkForUpdates`. The last three default to off.

When `launchAtStartup` is on, the desktop app writes the current user's Windows startup entry. Turning it off removes that entry. When `closeToTray` is on, the desktop app creates a tray icon. Once that icon exists, a close request hides the window. If the icon cannot be created, the window closes normally. The tray menu has Show and Quit. Quit removes the tray icon and exits this app's own process. Neither behavior runs in a browser session.

When `checkForUpdates` is on, the desktop app looks once after settings load. A newer release still asks before download. The "Check now" button on Settings uses the same question. The app does not look at startup while the preference is off.

In a browser session the same files are an in-memory map. They are not persistent.

## Update flow

A desktop check:

1. `check()` only reads the release record. It does not download.
2. When the record is newer, the source keeps the pending update in memory.
3. The window asks whether to download it.
4. "Download and install" calls `downloadAndInstall()` and then `relaunch()`.
5. "Not now", Esc, or the backdrop closes the update resource and clears the offer.

The record address is:

`https://github.com/claireass/desktools/releases/latest/download/latest.json`

The `version` field in `latest.json` has no `v` prefix, for example `0.6.2`. The platform key is `windows-x86_64`. `signature` is the contents of the installer's `.sig` file. `url` is the download address of that version's `DeskTools_<version>_x64-setup.exe`. GitHub "latest" is the most recently published release.

The signature is verified with the public key in `tauri.conf.json`. The private key is not in the repository, the chat, or GitHub. On the first machine it is in the `.tauri` folder of the user profile. If that key is lost, installed copies cannot move to a newer version. The key file is not committed.

The installer is NSIS, `perMachine`, with Turkish and English languages, and the Windows install mode is `passive`. It can ask for administrator approval. WiX is not produced.

A browser session reads the version through the GitHub API and does not download. The download button does not appear in the browser.

Installed copies still on 0.2.0 install the next version without asking, because the asking code is not in them yet. 0.2.1 and later ask.

## Desktop shell

`src-tauri/src/lib.rs` registers the plugins: opener, store, process, updater, autostart, and log. The only Rust command, `get_app_info`, returns the name, version, operating system, and architecture.

The window label is `main`, decorations are on, the minimum size is 960×640, and the default size is 1100×720.

Capabilities are in `src-tauri/capabilities/default.json`. There is no shell command and no broad filesystem permission. The app can exit its own process. It cannot terminate other processes. Hiding, showing, focusing, and destroying the window are allowed, as is the default window icon used for the tray. Opener can open only `https://github.com/claireass/desktools`. It cannot reveal a folder or start a local program.

The log level is info. On Windows, logs are under `LocalAppData\com.desktools.desktop\logs`. Passwords, JWTs, and file contents are not written to the log.

The content security policy allows the interface's own origin, the Tauri IPC addresses, and `https://api.github.com` for the update lookup.

## Security boundaries

- File, image, and PDF tools read the bytes the user selected. They do not write the original file to disk. A downloaded name has path separators and Windows device names (such as `con.txt`) removed.
- Internet tools do not contact a remote server.
- The clipboard is read only on request.
- The JWT reader does not decide trust. There is no signature verification.
- Regular expressions run in a Worker with a time limit so they do not lock the main thread.
- The password generator does not store its output.

## Build and release

Development: `npm install`, then `npm run tauri dev`. Rust, the Visual Studio C++ build tools, and WebView2 are required.

Checks: `npm run check:version`, `npm run lint`, `npm test`, `npm run build`.

The installer is produced by `npm run tauri build`. The output is:

`src-tauri/target/release/bundle/nsis/DeskTools_<version>_x64-setup.exe`

A `.sig` file with the same name is created beside it. `latest.json` is not part of that build. At publish time the `.sig` contents are read, `latest.json` is written, and both files plus the installer are uploaded with `gh release create` on the `vX.Y.Z` tag.

Published installers are at `https://github.com/claireass/desktools/releases`.

The license is the GNU General Public License v3.0. Secrets, `.env`, and `src-tauri/target` are not committed.
