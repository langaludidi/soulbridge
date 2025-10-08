/**
 * Theme Upload Utility
 * Handles custom background image uploads
 */

export async function uploadThemeImage(file: File): Promise<string> {
  // Create a local URL for preview (in production, this would upload to storage)
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

// In production, you would upload to Supabase Storage:
/*
export async function uploadThemeToSupabase(file: File, memorialId: string) {
  const supabase = createClientComponentClient();

  const fileExt = file.name.split('.').pop();
  const fileName = `${memorialId}/theme-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('memorial-themes')
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('memorial-themes')
    .getPublicUrl(fileName);

  return publicUrl;
}
*/
