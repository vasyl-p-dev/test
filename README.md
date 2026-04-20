# RN Pre-Interview Test Task

Expo Go app with three screens — **Onboarding → Sign Up → My Account** — wired to `https://artjoms-spole.fly.dev`. Built with TypeScript, React Navigation, react-hook-form + zod, and a data-driven `BlockRenderer` for the account screen.

## Run it

```
yarn install
yarn start     # scan the QR with Expo Go on iOS/Android
```

The project is set up for **Yarn (Berry) with the `node-modules` linker** (`.yarnrc.yml`). PnP is intentionally disabled — Expo's toolchain expects a real `node_modules` tree.

Other scripts:

| Command | What it does |
|---|---|
| `yarn test` | Jest — all unit tests (6 suites, 31 tests) |
| `yarn typecheck` | `tsc --noEmit` |
| `yarn ios` / `yarn android` | Launch a specific simulator |

## Architecture

```
App.tsx                                 SafeAreaProvider + AuthProvider + RootNavigator
src/
  api/
    client.ts        fetch wrapper with AbortController timeout + typed ApiError
    signup.ts        signup() + fetchAccount() (Basic Auth)
    types.ts         API + AccountBlock union
  components/        Button · TextField · Checkbox · BackButton · ErrorBanner ·
                     PagerDots · BlockRenderer · Screen · Typography · Spinner ·
                     Card · OnboardingIllustration
  hooks/
    useOnboarding.ts AsyncStorage flag @app/hasLaunched
  navigation/
    RootNavigator.tsx native-stack, onboarding gate
    types.ts
  screens/           OnboardingScreen · SignUpScreen · MyAccountScreen
  state/
    AuthContext.tsx  reducer — status/credentials/error
  theme/
    index.ts         colors, spacing, radii, typography (tokens from Figma)
  utils/
    validation.ts    zod signupSchema
    openUrl.ts       Linking wrapper for stub links
__tests__/           validation + client tests
```

## Decisions log

- **Language: TypeScript** — bonus points + catches API shape drift early.
- **State: Context + useReducer** — only auth status/credentials cross screens; no need for Redux/Zustand at this scale.
- **Forms: `react-hook-form` + `zod`** — minimal re-renders, schema-driven validation, the same schema powers the test suite.
- **HTTP: native `fetch`** wrapped in `src/api/client.ts` — `AbortController` for 15s timeout, JSON handling, typed `ApiError`. No axios dependency.
- **Onboarding persistence: `@react-native-async-storage/async-storage`** under key `@app/hasLaunched`. Flag is written only when the user finishes onboarding (Skip or final slide CTA) — killing the app mid-onboarding re-shows it.
- **Pager: `react-native-pager-view`** — first-party, Expo Go compatible, native-feel swipe. Four slides matching the Figma indicator dots. Animated dots use RN's `Animated` API (no extra deps).
- **Navigation: `@react-navigation/native-stack`** — lighter than JS stack, native transitions. `MyAccount` has `gestureEnabled: false` so stack back-swipe can't bounce back to SignUp; the back icon triggers logout instead.
- **Two-step API flow:** `POST /signup` returns `{message, nextStep, basicAuthCredentials}`; `MyAccountScreen` then `GET /interview/account` with Basic Auth on mount (retry on failure via `ErrorBanner`). Credentials are passed as route params rather than stored in AsyncStorage since the task doesn't require session persistence.
- **My Account is data-driven** via `AccountBlock` union (`profile | infoCard | transactionsCard | text | button | divider | spacer`). `MyAccountScreen.toBlocks()` maps the API response into blocks; `BlockRenderer` switches on `type` and renders each one. Adding a new block type (e.g. `image`) requires only the union entry + one `case` in the renderer. Unknown types render a dev-only fallback (nothing in release).
- **Styling — theme tokens:** Colors are namespaced by color family, each broken down by named hue levels. `.color` is the canonical ("true") value of the family; `extraLight | light | dark | extraDark` describe variations from that canonical, lightest to darkest. Families only include the levels present in the palette (e.g. `grey` has no canonical `.color`, only the four-stop scale). All values come from the Figma UI-lib ("Colours light mode" doc, node `5:562`).
  - `white`   → `color` (#FFFFFF) · `light` (#F5F7FF)
  - `grey`    → `extraLight` (#BBBBBB) · `light` (#8F94A3) · `dark` (#6C727F) · `extraDark` (#131313)
  - `tertiary` → `color` (#2C14DD — brand accent) · `light` (10% alpha)
  - `success` → `color` (#009218)
  - `error`   → `color` (#D22C2C) · `light` (#FDECEC) — app extension, not in Figma
- **Shared components follow the open-closed principle.** Components with a single visual variant expose only a `variant` prop and resolve their styles through `getStyles(variant)` — a `switch` that adds new cases without touching existing ones (e.g. `Button`: `'primary' | 'secondary' | 'disabled'`, with `disabled` derived internally from `loading`/`disabled`). Typography has two orthogonal dimensions and so exposes `variant` (feature-agnostic: `h1 | h2 | h3 | body | bodySmall | caption | captionBig | input | inputCaption | button`) + `color` (the same dotted palette paths used in the theme, e.g. `"grey.dark"`, `"tertiary.color"`). Each dimension has its own `get<Axis>Styles` switch.
- **Screens never import `colors` or `typography`.** They compose shared components (`Screen`, `Typography`, `Card`, `Button`, `TextField`, `Checkbox`, `ErrorBanner`, `BackButton`, `Spinner`, `PagerDots`, `BlockRenderer`) and choose variants. `grep 'from .*theme' src/screens` returns nothing. Inter font is still system-fallback — `expo-font` is installed for an easy upgrade.
- **Testing:** `jest-expo/node` preset for pure-logic tests — no Metro, no native modules, no rendering. **31 tests across 6 suites**, all unit-level with mocks where needed:
  - `validation.test.ts` — every zod rule (trim, email, password complexity, TOS)
  - `client.test.ts` — `fetch` mocked via `jest.spyOn`: 2xx / non-2xx / timeout / network error / header defaults
  - `signup.test.ts` — `request` mocked: asserts POST path + body and Basic-Auth base64 header
  - `auth-context.test.tsx` — pure `authReducer` transitions (state extracted from the hook for exactly this purpose)
  - `use-onboarding.test.ts` — `AsyncStorage` mocked via `jest.mock`: read/write semantics and storage key
  - `account-blocks.test.ts` — pure `toBlocks` transformer + currency formatting edge cases

## Known gaps / future work

- Inter font not loaded — falls back to system sans-serif. Add `expo-font` + `@expo-google-fonts/inter` in `App.tsx` to match Figma exactly.
- Only slide 1 copy is verbatim from Figma; slides 2–4 are placeholders flagged in `src/screens/OnboardingScreen.tsx`.
- All four onboarding slides share the same illustration (`assets/onboarding/slide-1.png`, pulled from the Figma asset export). Swap in per-slide art when available.
- The Figma didn't show a logout affordance on My Account — the back chevron currently logs out and returns to Sign Up; a dedicated `button` block labeled "Log out" also renders below transactions.
- No offline detection — retry is manual via the error banner. `@react-native-community/netinfo` could flip the Submit button when offline (bonus, skipped for now).
