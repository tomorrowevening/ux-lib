export function capitalize(value: string): string {
  return value.substring(0, 1).toUpperCase() + value.substring(1);
}

export function copyToClipboard(data: unknown): string {
  const content = JSON.stringify(data);
  navigator.clipboard.writeText(content);
  return content;
}

export function randomID(): string {
  return Math.round(Math.random() * 1000000).toString();
}
