export function parseYoutubeUrl(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

export function getEmbedUrl(videoId: string) {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}
