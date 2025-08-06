export interface ArtistTrackData {
	artistName: string
	trackTitle: string
	albumName: string
	trackFileUrl: string
	trackFileName: string
	isrc: string
	proAffiliation: string
	soundExchangeRegistered: boolean
	status: 'pending' | 'approved' | 'live' | 'rejected'
	airplayCount: number
	spinCount: number
	targetChannel: string
	targetPlaylist: string
}

export interface CustomPostMeta {
	artistTrack: ArtistTrackData
}

/**
 * Encodes custom post meta data into a JSON string
 */
export function encodeCustomPostMeta(data: CustomPostMeta): string {
	return JSON.stringify(data)
}

/**
 * Decodes custom post meta data from a JSON string
 */
export function decodeCustomPostMeta(jsonString: string): CustomPostMeta | null {
	try {
		return JSON.parse(jsonString)
	} catch (error) {
		console.error('Error decoding custom post meta:', error)
		return null
	}
}

/**
 * Extracts artist track data from a video URL field
 */
export function getArtistTrackData(videoUrl: string): ArtistTrackData | null {
	const meta = decodeCustomPostMeta(videoUrl)
	return meta?.artistTrack || null
}

/**
 * Updates artist track data while preserving other custom meta fields
 */
export function updateArtistTrackData(videoUrl: string, artistTrackData: Partial<ArtistTrackData>): string {
	const existingMeta = decodeCustomPostMeta(videoUrl) || { artistTrack: {} as ArtistTrackData }
	const updatedArtistTrack = { ...existingMeta.artistTrack, ...artistTrackData }
	const updatedMeta = { ...existingMeta, artistTrack: updatedArtistTrack }
	return encodeCustomPostMeta(updatedMeta)
}

/**
 * Checks if a field contains custom meta data (JSON) vs a regular URL
 */
export function isCustomMetaField(videoUrl: string): boolean {
	if (!videoUrl) return false
	try {
		const parsed = JSON.parse(videoUrl)
		return typeof parsed === 'object' && parsed !== null && 'artistTrack' in parsed
	} catch {
		return false
	}
}

/**
 * Gets the regular video URL from a field that might contain custom meta
 */
export function getVideoUrl(videoUrl: string): string | null {
	if (isCustomMetaField(videoUrl)) {
		return null // This field contains custom meta, not a video URL
	}
	return videoUrl || null
}

/**
 * Creates a default artist track data object
 */
export function createDefaultArtistTrackData(): ArtistTrackData {
	return {
		artistName: '',
		trackTitle: '',
		albumName: '',
		trackFileUrl: '',
		trackFileName: '',
		isrc: '',
		proAffiliation: '',
		soundExchangeRegistered: false,
		status: 'pending',
		airplayCount: 0,
		spinCount: 0,
		targetChannel: '',
		targetPlaylist: '',
	}
} 