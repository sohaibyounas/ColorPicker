/** Copies text to the clipboard. Resolves false instead of throwing (e.g. when the page lost focus). */
export const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
