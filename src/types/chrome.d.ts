// Minimal typings for the extension APIs used here (avoids pulling in @types/chrome).
// Firefox exposes the same subset under `chrome` for compatibility.
declare const chrome:
  | {
      runtime?: {
        id?: string;
        getURL: (path: string) => string;
      };
      tabs?: {
        create: (properties: { url: string }) => void;
      };
    }
  | undefined;
