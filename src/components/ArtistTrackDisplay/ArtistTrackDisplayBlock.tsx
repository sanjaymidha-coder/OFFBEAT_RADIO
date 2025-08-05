import { FC } from 'react';

interface Props {
  ncmazVideoUrl: string | null | undefined;
  className?: string;
}

interface ArtistTrackData {
	artistName: string
	trackTitle: string
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

const ArtistTrackDisplayBlock: FC<Props> = ({ ncmazVideoUrl, className = '' }) => {
  if (!ncmazVideoUrl) return null;
  let artistTrack: ArtistTrackData | null = null;
  try {
    const parsed = JSON.parse(ncmazVideoUrl);
    artistTrack = parsed.artistTrack;
  } catch {
    return null;
  }
  if (!artistTrack) return null;

  return (
    <div className={`bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 mb-6 ${className}`}>
      <h2 className="text-xl font-bold mb-2">Track Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {artistTrack.artistName && (
          <div><span className="font-semibold">Artist Name:</span> {artistTrack.artistName}</div>
        )}
        {artistTrack.trackTitle && (
          <div className="mb-3">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Track Title:</span>
            <span className="ml-2 text-neutral-600 dark:text-neutral-400">{artistTrack.trackTitle}</span>
          </div>
        )}
        {artistTrack.trackFileUrl && (
          <div className="mb-3">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Track File:</span>
            <a 
              href={artistTrack.trackFileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline"
            >
              {artistTrack.trackFileName || 'Listen'}
            </a>
          </div>
        )}
        {artistTrack.isrc && (
          <div className="mb-3">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">ISRC:</span>
            <span className="ml-2 text-neutral-600 dark:text-neutral-400">{artistTrack.isrc}</span>
          </div>
        )}
        {artistTrack.proAffiliation && (
          <div className="mb-3">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">PRO Affiliation:</span>
            <span className="ml-2 text-neutral-600 dark:text-neutral-400">{artistTrack.proAffiliation}</span>
          </div>
        )}
        <div className="mb-3">
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">SoundExchange:</span>
          <span className="ml-2 text-neutral-600 dark:text-neutral-400">
            {artistTrack.soundExchangeRegistered ? 'Registered' : 'Not Registered'}
          </span>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">Status:</span>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
            artistTrack.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            artistTrack.status === 'live' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
            artistTrack.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {artistTrack.status.charAt(0).toUpperCase() + artistTrack.status.slice(1)}
          </span>
        </div>
        <div className="grid grid-cols-12 gap-4 mb-3">
          <div className="col-span-6">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Airplay Count:</span>
            <span className="ml-2 text-neutral-600 dark:text-neutral-400">{artistTrack.airplayCount}</span>
          </div>
          <div className="col-span-6">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Spin Count:</span>
            <span className="ml-2 text-neutral-600 dark:text-neutral-400">{artistTrack.spinCount}</span>
          </div>
        </div>
        {artistTrack.targetChannel && (
          <div className="mb-3">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Target Channel:</span>
            <span className="ml-2 text-neutral-600 dark:text-neutral-400">{artistTrack.targetChannel}</span>
          </div>
        )}
        {artistTrack.targetPlaylist && (
          <div className="mb-3">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Target Playlist:</span>
            <span className="ml-2 text-neutral-600 dark:text-neutral-400">{artistTrack.targetPlaylist}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistTrackDisplayBlock; 