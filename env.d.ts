/// <reference types="vite/client" />
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_BASE_API?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_NODE_ENV: string;
}
// eslint-disable-next-line no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
