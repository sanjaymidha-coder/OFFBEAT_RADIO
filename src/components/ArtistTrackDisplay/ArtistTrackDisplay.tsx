import { FC } from 'react'
import { ArtistTrackData, getArtistTrackData } from '@/utils/artistTrackUtils'
import { 
	MusicalNoteIcon, 
	CalendarIcon, 
	BuildingLibraryIcon,
	UserIcon,
	GlobeAltIcon
} from '@heroicons/react/24/outline'

interface ArtistTrackDisplayProps {
	videoUrlField: string | null
	className?: string
}

const ArtistTrackDisplay: FC<ArtistTrackDisplayProps> = ({ 
	videoUrlField, 
	className = '' 
}) => {
	const artistTrackData = getArtistTrackData(videoUrlField)

	if (!artistTrackData || (!artistTrackData.artistName && !artistTrackData.trackTitle)) {
		return null
	}

	const hasPlatformLinks = false // Removed platform links

	return (
		<div className={`nc-ArtistTrackDisplay ${className}`}>
			<div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6">
				<div className="flex items-start space-x-4">
					<div className="flex-shrink-0">
						<div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
							<MusicalNoteIcon className="w-6 h-6 text-white" />
						</div>
					</div>
					
					<div className="flex-1 min-w-0">
						<div className="space-y-3">
							{/* Artist and Track Info */}
							<div>
								{artistTrackData.artistName && (
									<h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
										{artistTrackData.artistName}
									</h3>
								)}
								{artistTrackData.trackTitle && (
									<p className="text-neutral-600 dark:text-neutral-400 font-medium">
										{artistTrackData.trackTitle}
									</p>
								)}
								{artistTrackData.albumTitle && (
									<p className="text-neutral-500 dark:text-neutral-500 text-sm">
										{artistTrackData.albumTitle}
									</p>
								)}
							</div>

							{/* Additional Details */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
								{artistTrackData.isrc && (
									<div className="flex items-center space-x-1 text-neutral-600 dark:text-neutral-400">
										<span className="font-medium">ISRC:</span>
										<span className="font-mono">{artistTrackData.isrc}</span>
									</div>
								)}
								{artistTrackData.proAffiliation && (
									<div className="flex items-center space-x-1 text-neutral-600 dark:text-neutral-400">
										<span className="font-medium">PRO:</span>
										<span>{artistTrackData.proAffiliation}</span>
									</div>
								)}
								{artistTrackData.soundExchangeRegistered !== undefined && (
									<div className="flex items-center space-x-1 text-neutral-600 dark:text-neutral-400">
										<span className="font-medium">SoundExchange:</span>
										<span className={`px-2 py-1 rounded-full text-xs font-medium ${
											artistTrackData.soundExchangeRegistered 
												? 'bg-green-100 text-green-800' 
												: 'bg-gray-100 text-gray-800'
										}`}>
											{artistTrackData.soundExchangeRegistered ? 'Registered' : 'Not Registered'}
										</span>
									</div>
								)}
								{artistTrackData.status && (
									<div className="flex items-center space-x-1">
										<span className="font-medium">Status:</span>
										<span className={`px-2 py-1 rounded-full text-xs font-medium ${
											artistTrackData.status === 'approved' ? 'bg-green-100 text-green-800' :
											artistTrackData.status === 'live' ? 'bg-blue-100 text-blue-800' :
											artistTrackData.status === 'rejected' ? 'bg-red-100 text-red-800' :
											'bg-yellow-100 text-yellow-800'
										}`}>
											{artistTrackData.status.charAt(0).toUpperCase() + artistTrackData.status.slice(1)}
										</span>
									</div>
								)}
								{(artistTrackData.airplayCount || artistTrackData.spinCount) && (
									<div className="flex items-center space-x-4">
										{artistTrackData.airplayCount && (
											<div className="flex items-center space-x-1 text-neutral-600 dark:text-neutral-400">
												<span className="font-medium">Airplay:</span>
												<span>{artistTrackData.airplayCount}</span>
											</div>
										)}
										{artistTrackData.spinCount && (
											<div className="flex items-center space-x-1 text-neutral-600 dark:text-neutral-400">
												<span className="font-medium">Spins:</span>
												<span>{artistTrackData.spinCount}</span>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ArtistTrackDisplay 