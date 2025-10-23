/**
 * Helper function to trigger OG image generation for a memorial
 * Can be called from memorial creation/update endpoints
 */
export async function triggerOGGeneration(memorialId: string): Promise<void> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/generate-og-image`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ memorialId }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[OG Helper] Generation failed:', error);
    } else {
      const result = await response.json();
      console.log('[OG Helper] Generation successful:', result.ogImageUrl);
    }
  } catch (error) {
    console.error('[OG Helper] Error triggering generation:', error);
    // Don't throw - OG generation is non-critical
  }
}
