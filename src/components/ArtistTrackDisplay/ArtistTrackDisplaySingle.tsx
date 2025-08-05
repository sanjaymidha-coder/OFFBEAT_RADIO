import { FC } from 'react'
import { ArtistTrackData, getArtistTrackData } from '@/utils/artistTrackUtils'
import { 
	MusicalNoteIcon, 
	CalendarIcon, 
	BuildingLibraryIcon,
	UserIcon,
	GlobeAltIcon,
	PlayIcon
} from '@heroicons/react/24/outline'

interface ArtistTrackDisplaySingleProps {
	videoUrlField: string | null
	className?: string
}

const ArtistTrackDisplaySingle: FC<ArtistTrackDisplaySingleProps> = ({ 
	videoUrlField, 
	className = '' 
}) => {
	const artistTrackData = getArtistTrackData(videoUrlField)

	if (!artistTrackData || (!artistTrackData.artistName && !artistTrackData.trackTitle)) {
		return null
	}

	const hasPlatformLinks = false // Removed platform links

	return (
		<div className={`nc-ArtistTrackDisplaySingle ${className}`}>
			<div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-8 border border-primary-200 dark:border-primary-700">
				<div className="flex items-start space-x-6">
					<div className="flex-shrink-0">
						<div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
							<MusicalNoteIcon className="w-8 h-8 text-white" />
						</div>
					</div>
					
					<div className="flex-1 min-w-0">
						<div className="space-y-4">
							{/* Artist and Track Info */}
							<div>
								{artistTrackData.artistName && (
									<h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
										{artistTrackData.artistName}
									</h2>
								)}
								{artistTrackData.trackTitle && (
									<p className="text-xl text-neutral-600 dark:text-neutral-400 font-medium">
										{artistTrackData.trackTitle}
									</p>
								)}
								{artistTrackData.albumTitle && (
									<p className="text-lg text-neutral-500 dark:text-neutral-500">
										{artistTrackData.albumTitle}
									</p>
								)}
							</div>

							{/* Additional Details */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
								{artistTrackData.isrc && (
									<div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
										<span className="font-semibold">ISRC:</span>
										<span className="font-mono">{artistTrackData.isrc}</span>
									</div>
								)}
								{artistTrackData.proAffiliation && (
									<div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
										<span className="font-semibold">PRO:</span>
										<span>{artistTrackData.proAffiliation}</span>
									</div>
								)}
								{artistTrackData.soundExchangeRegistered !== undefined && (
									<div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
										<span className="font-semibold">SoundExchange:</span>
										<span className={`px-3 py-1 rounded-full text-sm font-medium ${
											artistTrackData.soundExchangeRegistered 
												? 'bg-green-100 text-green-800' 
												: 'bg-gray-100 text-gray-800'
										}`}>
											{artistTrackData.soundExchangeRegistered ? 'Registered' : 'Not Registered'}
										</span>
									</div>
								)}
								{artistTrackData.status && (
									<div className="flex items-center space-x-2">
										<span className="font-semibold">Status:</span>
										<span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
											<div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
												<span className="font-semibold">Airplay:</span>
												<span>{artistTrackData.airplayCount}</span>
											</div>
										)}
										{artistTrackData.spinCount && (
											<div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
												<span className="font-semibold">Spins:</span>
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

export default ArtistTrackDisplaySingle 