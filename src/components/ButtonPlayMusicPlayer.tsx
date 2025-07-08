// ** Tat ca cac component nao goi truc tiep ButtonPlayMusicPlayer thi can phai co use client
import * as React from 'react'
import { FC, ReactNode } from 'react'
import PostTypeFeaturedIcon from './PostTypeFeaturedIcon/PostTypeFeaturedIcon'
import { useMusicPlayer } from '../hooks/useMusicPlayer'
import { PostDataFragmentType } from '../data/types'
import { getPostDataFromPostFragment } from '../utils/getPostDataFromPostFragment'
import MyImage from './MyImage'

export interface ButtonPlayMusicPlayerProps {
	className?: string
	post: PostDataFragmentType
	renderChildren?: (playing: boolean) => ReactNode
	renderDefaultBtn?: () => ReactNode
	renderPlayingBtn?: () => ReactNode
}

// ** Tat ca cac component nao goi truc tiep ButtonPlayMusicPlayer thi can phai co use client **

const ButtonPlayMusicPlayer: FC<ButtonPlayMusicPlayerProps> = ({
	className = '',
	post,
	renderChildren,
	renderDefaultBtn,
	renderPlayingBtn,
}) => {
	const {
		postData: currentPostData,
		setPostData,
		setPlaying,
		playing: currentPlayingAnyPost,
	} = useMusicPlayer()

	const playing =
		currentPlayingAnyPost && currentPostData?.databaseId === post?.databaseId

	const { databaseId, ncmazAudioUrl } = getPostDataFromPostFragment(post)

	const currentMediaPostData = getPostDataFromPostFragment(
		currentPostData || {},
	)

	// STATE
	const handleClickNewAudio = () => {
		setPostData(post)
		setPlaying(true)
	}

	const handleClickButton = () => {
		// IF NOT EXIST MEDIA
		if (
			!currentMediaPostData ||
			currentMediaPostData.databaseId !== databaseId ||
			currentMediaPostData.ncmazAudioUrl?.audioUrl !== ncmazAudioUrl?.audioUrl
		) {
			return handleClickNewAudio()
		}

		setPlaying(!playing)
	}

	const _renderDefaultBtn = () => {
		if (renderDefaultBtn) {
			return renderDefaultBtn()
		}
		return (
			<>
				<span
					className="absolute inset-0 transition-all duration-300 opacity-0 group-hover:opacity-100 bg-[rgba(0,0,0,0.5)] pointer-events-none rounded-none"
				/>
				<span
					className="z-20 flex h-16 w-16 items-center justify-center border-2 border-white transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer bg-[rgba(0,0,0,0.3)] rounded-full"
				>
					<svg
						className="w-10 h-10 text-white"
						fill="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M8 5v14l11-7z" />
					</svg>
				</span>
			</>
		)
	}

	const _renderPlayingBtn = () => {
		// RENDER DEFAULT IF IT NOT CURRENT
		if (currentMediaPostData?.databaseId !== databaseId) {
			return _renderDefaultBtn()
		}

		// RENDER WHEN IS CURRENT
		if (renderPlayingBtn) {
			return renderPlayingBtn()
		}

		return (
			<span className="z-20 flex h-16 w-16 items-center justify-center border-2 border-white rounded-full transition-all duration-300 cursor-pointer bg-[rgb(0,0,0,.8)]">
				<MyImage
					className="w-7 h-7"
					src={'/images/icon-playing.gif'}
					alt="paused"
					width={30}
					height={30}
				/>
			</span>
		)
	}

	return (
		<div
			className={`nc-ButtonPlayMusicPlayer select-none absolute inset-0 items-center justify-center group ${className} hidden md:flex`}
			onClick={handleClickButton}
			aria-hidden
		>
			{renderChildren ? (
				renderChildren(playing)
			) : (
				<>{playing ? _renderPlayingBtn() : _renderDefaultBtn()}</>
			)}
		</div>
	)
}

export default ButtonPlayMusicPlayer
