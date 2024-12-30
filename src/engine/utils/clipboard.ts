class ClipboardManager {
  // 将文本写入剪切板
  static async copyToClipboard(text: any, callback?: () => void) {
    try {
      await navigator.clipboard.writeText(text);
      if (callback) { callback(); } 
    } catch (error) {
      throw error;
    }
  }

  // 从剪切板读取文本
  static async pasteFromClipboard(callback?: () => void) {
    try {
      const text = await navigator.clipboard.readText();
      if (callback) { callback(); } 
      return text;
    } catch (error) {
      throw error;
    }
  }
}
export default ClipboardManager;