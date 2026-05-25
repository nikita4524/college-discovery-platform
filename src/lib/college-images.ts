/**
 * College image utilities - No more random Picsum images!
 */

// Fallback: Show college name instead of mountain/random image
export function getCollegeImageFallback(name: string): string {
  const shortName = name.split(' ').slice(0, 2).join(' ');
  return `https://placehold.co/800x450/3b82f6/white?text=${encodeURIComponent(shortName)}`;
}

// Get college image - uses DB image or fallback with college name
export function resolveCollegeImageUrl(
  name: string,
  imageUrl: string | null | undefined
): string {
  // ✅ Local images (/images/...) ko allow karo
  if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('/images/'))) {
    return imageUrl;
  }
  
 
  return getCollegeImageFallback(name);
}


export function withResolvedImage<T extends { name: string; imageUrl: string | null }>(
  college: T
): T {
  return {
    ...college,
    imageUrl: resolveCollegeImageUrl(college.name, college.imageUrl),
  };
}