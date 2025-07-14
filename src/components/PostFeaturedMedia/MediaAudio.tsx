import { FC } from 'react'
import { PostDataFragmentType } from '@/data/types'
import ButtonPlayMusicPlayer from '@/components/ButtonPlayMusicPlayer'

export interface MediaAudioProps {
	post: PostDataFragmentType
	hidePlayButton?: boolean
}

const MediaAudio: FC<MediaAudioProps> = ({ post, hidePlayButton = false }) => {
	if (hidePlayButton) return null;
	return (
		<>
			<ButtonPlayMusicPlayer
				className="absolute inset-0 flex items-center justify-center"
				post={post}
			/>
		</>
	)
}

export default MediaAudio
