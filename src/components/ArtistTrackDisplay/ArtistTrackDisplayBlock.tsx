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
    <div className={`bg-white rounded-lg p-5 mb-6 ${className}`}>
      <h3 className="text-xl font-bold mb-2 !mt-0">Track Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {artistTrack.artistName && (
         <div className="mb-3"><span className="font-semibold text-sm">Artist Name:</span> 
         <span className="ml-2 text-sm">{artistTrack.artistName}</span>

         </div>
        )}
        {artistTrack.trackTitle && (
          <div className="mb-3">
            <span className="font-semibold text-sm">Track Title:</span>
            <span className="ml-2 text-sm">{artistTrack.trackTitle}</span>
          </div>
        )}
        {artistTrack.trackFileUrl && (
          <div className="mb-3">
            <span className="font-semibold text-sm">Track File:</span>
            <a 
              href={artistTrack.trackFileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-sm"
            >
              {artistTrack.trackFileName || 'Listen'}
            </a>
          </div>
        )}
        {artistTrack.isrc && (
          <div className="mb-3">
            <span className="font-semibold text-sm">ISRC:</span>
            <span className="ml-2 text-sm">{artistTrack.isrc}</span>
          </div>
        )}
        {artistTrack.proAffiliation && (
          <div className="mb-3">
            <span className="font-semibold text-sm">PRO Affiliation:</span>
            <span className="ml-2 text-sm">{artistTrack.proAffiliation}</span>
          </div>
        )}
        <div className="mb-3">
          <span className="font-semibold text-sm">SoundExchange:</span>
          <span className="ml-2 text-sm">
            {artistTrack.soundExchangeRegistered ? 'Registered' : 'Not Registered'}
          </span>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-sm">Status:</span>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
            artistTrack.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            artistTrack.status === 'live' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
            artistTrack.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {artistTrack.status.charAt(0).toUpperCase() + artistTrack.status.slice(1)}
          </span>
        </div>
        <div className="mb-3">
            <span className="font-semibold text-sm">Airplay Count:</span>
            <span className="ml-2 text-sm">{artistTrack.airplayCount}</span>
          </div>
          <div className="mb-3">
            <span className="font-semibold text-sm">Spin Count:</span>
            <span className="ml-2 text-sm">{artistTrack.spinCount}</span>
          </div>
  
        {artistTrack.targetChannel && (
          <div className="mb-3">
            <span className="font-semibold text-sm">Target Channel:</span>
            <span className="ml-2 text-sm">{artistTrack.targetChannel}</span>
          </div>
        )}
        {artistTrack.targetPlaylist && (
          <div className="mb-3">
            <span className="font-semibold text-sm">Target Playlist:</span>
            <span className="ml-2 text-sm">{artistTrack.targetPlaylist}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistTrackDisplayBlock; 