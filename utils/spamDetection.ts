export function isSpam(text: string): { isSpam: boolean; reason?: string } {
  // Check for repeated characters
  const repeatedCharsRegex = /(.)\1{4,}/;
  if (repeatedCharsRegex.test(text)) {
    return { isSpam: true, reason: "Too many repeated characters" };
  }

  // Check for all caps
  if (text.length > 10 && text === text.toUpperCase()) {
    return { isSpam: true, reason: "Too many capital letters" };
  }

  // Check for repeated words
  const words = text.toLowerCase().split(/\s+/);
  const wordFrequency = words.reduce((acc: { [key: string]: number }, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  const maxRepeatedWord = Math.max(...Object.values(wordFrequency));
  if (maxRepeatedWord > 3) {
    return { isSpam: true, reason: "Too many repeated words" };
  }

  // Check for suspicious URLs
  const urlCount = (text.match(/http[s]?:\/\//g) || []).length;
  if (urlCount > 2) {
    return { isSpam: true, reason: "Too many URLs" };
  }

  return { isSpam: false };
} 