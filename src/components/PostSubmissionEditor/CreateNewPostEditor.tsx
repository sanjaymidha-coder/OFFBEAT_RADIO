'use client'

import { FC, useEffect, useState } from 'react'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import TitleEditor from './TitleEditor'
import { debounce } from 'lodash'
import TagsInput, { TagNodeShort } from './TagsInput'
import CategoriesInput from './CategoriesInput'
import PostOptionsBtn, { PostOptionsData } from './PostOptionsBtn'
import TiptapEditor from './TiptapEditor'
import { Editor } from '@tiptap/react'
import { useMutation } from '@apollo/client'
import Alert from '@/components/Alert'
import toast from 'react-hot-toast'
import {
	NcmazFcCategoryFullFieldsFragmentFragment,
	PostStatusEnum,
} from '@/__generated__/graphql'
import ButtonInsertImage, { ImageState } from './ButtonInsertImage'
import { getApolloAuthClient } from '@faustwp/core'
import Button from '../Button/Button'
import { useRouter } from 'next/router'
import {
	NC_MUTATION_CREATE_POST,
	NC_MUTATION_UPDATE_POST,
} from '@/fragments/mutations'
import Label from '../Label/Label'
import { IS_CHISNGHIAX_DEMO_SITE } from '@/contains/site-settings'
import NcModal from '../NcModal/NcModal'
import Link from 'next/link'
import errorHandling from '@/utils/errorHandling'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/store'
import getTrans from '@/utils/getTrans'
import { useRef } from 'react';

interface Props {
	isEditingPage?: boolean
	isEditingPostId?: string
	isSubmittingPage?: boolean
	//
	defaultTitle?: string
	defaultContent?: string
	defaultFeaturedImage?: ImageState
	defaultTags?: TagNodeShort[]
	defaultCategories?: NcmazFcCategoryFullFieldsFragmentFragment[]
	defaultPostOptionsData?: PostOptionsData
	//
	labels?: {
		title?: string
		image?: string
		tags?: string
		description?: string
	}
	// New custom fields as props
	defaultArtistName?: string
	defaultTrackTitle?: string
	defaultShortDescription?: string
	defaultIsrc?: string
	defaultProAffiliation?: string
	defaultIpiNumber?: string
	defaultLegalChecked?: boolean
	defaultAudioFile?: File | null
	defaultCoverArt?: File | null
	defaultGenre?: string
}

const CreateNewPostEditor: FC<Props> = ({
	isEditingPostId,
	isEditingPage,
	isSubmittingPage,
	defaultTitle: defaultTitleProp = '',
	defaultContent: defaultContentProp = '',
	defaultFeaturedImage: defaultFeaturedImageProp = {
		sourceUrl: '',
		altText: '',
	},
	defaultTags: defaultTagsProp = [],
	defaultCategories: defaultCategoriesProp = [],
	defaultPostOptionsData: defaultPostOptionsDataProp = {
		audioUrl: '',
		videoUrl: '',
		excerptText: '',
		postFormatsSelected: '',
		objGalleryImgs: undefined,
		isAllowComments: true,
		timeSchedulePublication: undefined,
		showRightSidebar: true,
	},
	labels = {},
	// New custom fields as props
	defaultArtistName = '',
	defaultTrackTitle = '',
	defaultShortDescription = '',
	defaultIsrc = '',
	defaultProAffiliation = '',
	defaultIpiNumber = '',
	defaultLegalChecked = false,
	defaultAudioFile = null,
	defaultCoverArt = null,
	defaultGenre = '',
}) => {
	const { isReady, isAuthenticated } = useSelector(
		(state: RootState) => state.viewer.authorizedUser,
	)
	const client = getApolloAuthClient()
	//
	const router = useRouter()
	const T = getTrans()
	const localStoragePath = isSubmittingPage
		? 'submission_page__new'
		: 'submission_page__edit__' + (isEditingPostId || 'none')

	//
	const [titleContent, setTitleContent] = useState<string>(
		() =>
			JSON.parse(localStorage.getItem(localStoragePath) || '{}').titleContent ||
			defaultTitleProp,
	)
	const [contentHTML, setContentHTML] = useState<string>(
		() =>
			JSON.parse(localStorage.getItem(localStoragePath) || '{}').contentHTML ||
			defaultContentProp,
	)
	const [featuredImage, setFeaturedImage] = useState<ImageState>(
		() =>
			JSON.parse(localStorage.getItem(localStoragePath) || '{}')
				.featuredImage || defaultFeaturedImageProp,
	)
	const [tags, setTags] = useState<TagNodeShort[]>(
		() =>
			JSON.parse(localStorage.getItem(localStoragePath) || '{}').tags ||
			defaultTagsProp,
	)
	const [categories, setCategories] = useState<
		NcmazFcCategoryFullFieldsFragmentFragment[]
	>(
		() =>
			JSON.parse(localStorage.getItem(localStoragePath) || '{}').categories ||
			defaultCategoriesProp,
	)
	const [postOptionsData, setPostOptionsData] = useState<PostOptionsData>(
		() =>
			JSON.parse(localStorage.getItem(localStoragePath) || '{}')
				.postOptionsData || defaultPostOptionsDataProp,
	)
	// Add at the top, after other imports
	const [artistName, setArtistName] = useState<string>(
		() => JSON.parse(localStorage.getItem(localStoragePath) || '{}').artistName || defaultArtistName
	);
	const [trackTitle, setTrackTitle] = useState<string>(
		() => JSON.parse(localStorage.getItem(localStoragePath) || '{}').trackTitle || defaultTrackTitle
	);
	const [genre, setGenre] = useState<string>(
		() => JSON.parse(localStorage.getItem(localStoragePath) || '{}').genre || defaultGenre
	);
	const [shortDescription, setShortDescription] = useState<string>(
		() => JSON.parse(localStorage.getItem(localStoragePath) || '{}').shortDescription || defaultShortDescription
	);
	const [audioFile, setAudioFile] = useState<File | null>(
		() => JSON.parse(localStorage.getItem(localStoragePath) || '{}').audioFile || defaultAudioFile
	);
	const [coverArt, setCoverArt] = useState<File | null>(
		() => JSON.parse(localStorage.getItem(localStoragePath) || '{}').coverArt || defaultCoverArt
	);
	const [isrc, setIsrc] = useState<string>(
		() => JSON.parse(localStorage.getItem(localStoragePath) || '{}').isrc || defaultIsrc
	);
	const [proAffiliation, setProAffiliation] = useState<string>(
		() => JSON.parse(localStorage.getItem(localStoragePath) || '{}').proAffiliation || defaultProAffiliation
	);
	const [ipiNumber, setIpiNumber] = useState<string>(
		() => JSON.parse(localStorage.getItem(localStoragePath) || '{}').ipiNumber || defaultIpiNumber
	);
	const [legalChecked, setLegalChecked] = useState<boolean>(
		() => JSON.parse(localStorage.getItem(localStoragePath) || '{}').legalChecked || defaultLegalChecked
	);
	const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
	const [newUpdatedUri, setNewUpdatedUri] = useState('');

	// Predefined genres/channels
	const GENRES = [
		'Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'Country', 'Other'
	];

	// Update localStorage to include new fields
	const updateToLocalStorageExtended = () => {
		localStorage.setItem(
			localStoragePath,
			JSON.stringify({
				titleContent,
				contentHTML,
				featuredImage,
				tags,
				categories,
				postOptionsData,
				artistName,
				trackTitle,
				shortDescription,
				isrc,
				proAffiliation,
				ipiNumber,
				legalChecked,
				audioFile,
				coverArt,
				genre,
			})
		);
	};

	// all keys of states
	const stateKeys = [
		'titleContent',
		'contentHTML',
		'featuredImage',
		'tags',
		'categories',
		'postOptionsData',
	] as const

	const updateToLocalStorage = (
		name: (typeof stateKeys)[number],
		value: unknown,
	) => {
		localStorage.setItem(
			localStoragePath,
			JSON.stringify({
				titleContent,
				contentHTML,
				featuredImage,
				tags,
				categories,
				postOptionsData,
				...{ [name]: value },
			}),
		)
	}
	//

	const handleRevertToDefault = () => {
		localStorage.removeItem(localStoragePath)
		router.reload()
	}

	useEffect(() => {
		if (localStorage.getItem(localStoragePath)) {
			const data = JSON.parse(localStorage?.getItem?.(localStoragePath) || '')
			if (!data) {
				return
			}
			setTitleContent(data.titleContent || defaultTitleProp)
			setContentHTML(data.contentHTML || defaultContentProp)
			setFeaturedImage(data.featuredImage || defaultFeaturedImageProp)
			setTags(data.tags || defaultTagsProp)
			setCategories(data.categories || defaultCategoriesProp)
			setPostOptionsData(data.postOptionsData || defaultPostOptionsDataProp)
			setAudioFile(data.audioFile || defaultAudioFile)
			setCoverArt(data.coverArt || defaultCoverArt)
			setArtistName(data.artistName || defaultArtistName)
			setTrackTitle(data.trackTitle || defaultTrackTitle)
			setShortDescription(data.shortDescription || defaultShortDescription)
			setIsrc(data.isrc || defaultIsrc)
			setProAffiliation(data.proAffiliation || defaultProAffiliation)
			setIpiNumber(data.ipiNumber || defaultIpiNumber)
			setLegalChecked(data.legalChecked || defaultLegalChecked)
		}
	}, [])
	//

	// MUTATION_CREATE_POST GQL
	// status: PENDING | PRIVATE | PUBLISH | DRAFT | TRASH
	// Lưu ý có biến ncTags - Biến này được tạo ra để Contributor và Author có thể thêm Tags mới vào Post (Được xử lý trong ncmaz-custom-wpgraphql)
	const [mutationCreatePost, { error, data, loading }] = useMutation(
		NC_MUTATION_CREATE_POST,
		{
			client,
			onCompleted: (data) => {
				setIsSubmitSuccess(true)
				toast.success(T.pageSubmission['Created new post successfully'])

				if (data.createPost?.post?.status !== 'publish') {
					router.push(
						`/preview${data?.createPost?.post?.uri}&preview=true&previewPathname=post`,
					)
					return
				}
				router.replace(data?.createPost?.post?.uri || '')
			},
			onError: (error) => {
				errorHandling(error)
			},
		},
	)
	const [
		mutationUpdatePost,
		{
			error: updatePostError,
			data: updatePostData,
			loading: updatePostLoading,
		},
	] = useMutation(NC_MUTATION_UPDATE_POST, {
		client,
		onCompleted: (data) => {
			setIsSubmitSuccess(true)
			toast.success(T.pageSubmission['Update post successfully'])
			setNewUpdatedUri(`/?p=${data?.updatePost?.post?.databaseId}`)
		},
		onError: (error) => {
			errorHandling(error)
		},
	})

	//
	const debounceGetTitle = debounce(function (e: Editor) {
		setTitleContent(e.getText())
		//
		updateToLocalStorage('titleContent', e.getText())
	}, 300)

	const debounceGetContentHtml = debounce(function (e: Editor) {
		setContentHTML(e.getHTML())
		//
		updateToLocalStorage('contentHTML', e.getHTML())
	}, 400)
	//

	useEffect(() => {
		if (isSubmitSuccess) {
			// remove localstorage
			localStorage.removeItem(localStoragePath)
		}
	}, [isSubmitSuccess])

	useEffect(() => {
		//   Kiểm tra xem có bao nhiêu key trong localStorage có chứa submission_page__edit__
		//  Nếu có nhiều hơn 1 key thì xóa hết các key đó đi và chỉ giữ lại key hiện tại là localStoragePath

		const keys = Object.keys(localStorage)
		const keysWithEdit = keys.filter((key) =>
			key.startsWith('submission_page__edit__'),
		)
		if (keysWithEdit.length > 2) {
			keysWithEdit.forEach((key) => {
				if (key !== localStoragePath) {
					localStorage.removeItem(key)
				}
			})
		}
	}, [])

	//
	const handleChangeFeaturedImage = (image: ImageState) => {
		setFeaturedImage(image)
		updateToLocalStorage('featuredImage', image)
		return
	}

	const handleChangeCategories = (
		data: NcmazFcCategoryFullFieldsFragmentFragment[],
	) => {
		// Thực hiện điều này để tránh việc gọi updateToLocalStorage ngay lần mount đầu tiên.
		if (data.length === categories.length) {
			return
		}
		setCategories(data)
		updateToLocalStorage('categories', data)
	}

	const handleChangeTags = (data: TagNodeShort[]) => {
		if (data.length === tags.length) {
			return
		}
		setTags(data)
		updateToLocalStorage('tags', data)
	}

	const handleApplyPostOptions = (data: PostOptionsData) => {
		setPostOptionsData(data)
		updateToLocalStorage('postOptionsData', data)
	}

	const onSubmmitMutation = async (status: PostStatusEnum) => {
		// for site chisnghiax demo - please delete this code on your site
		if (IS_CHISNGHIAX_DEMO_SITE) {
			toast.error('Sorry, post submission is disabled on the demo site!')
			return
		}

		// Validation
		if (!artistName.trim()) {
			toast.error('Artist Name is required')
			return
		}
		if (!trackTitle.trim()) {
			toast.error('Track Title is required')
			return
		}
		if (tags.length === 0) {
			toast.error('At least one genre is required')
			return
		}
		if (!shortDescription.trim()) {
			toast.error('Short Description is required')
			return
		}
		if (!isrc.trim()) {
			toast.error('ISRC is required')
			return
		}
		if (!proAffiliation.trim()) {
			toast.error('PRO Affiliation is required')
			return
		}
		if (!legalChecked) {
			toast.error('You must agree to the legal terms')
			return
		}

		// Cover art dimension check (min 1400x1400)
		if (coverArt) {
			const coverArtUrl = URL.createObjectURL(coverArt);
			const img = new window.Image();
			const imgLoaded = await new Promise((resolve) => {
				img.onload = () => resolve(true);
				img.onerror = () => resolve(false);
				img.src = coverArtUrl;
			});
			if (imgLoaded && (img.width < 1400 || img.height < 1400)) {
				toast.error('Cover art must be at least 1400x1400px');
				return;
			}
		}

		// Upload audio file
		let audioUrl = ''
		if (audioFile) {
			audioUrl = await uploadFileToWordPress(audioFile)
			if (!audioUrl) {
				toast.error('Audio upload failed')
				return
			}
		}

		// Upload cover art
		let coverArtUploadedUrl = ''
		if (coverArt) {
			coverArtUploadedUrl = await uploadFileToWordPress(coverArt)
			if (!coverArtUploadedUrl) {
				toast.error('Cover art upload failed')
				return
			}
		}

		// Proceed with mutation
		if (isSubmittingPage) {
			mutationCreatePost({
				variables: {
					status,
					title: trackTitle, // Use track title as post title
					content: contentHTML,
					categoryNodes: categories.map((item) => ({ id: item.databaseId.toString() })),
					ncTags: tags.map((item) => item.name).join(','),
					featuredImg_alt: coverArt?.name ?? null,
					featuredImg_url: coverArtUploadedUrl,
					date: postOptionsData.timeSchedulePublication || null,
					commentStatus: postOptionsData.isAllowComments ? 'open' : 'closed',
					excerpt: shortDescription,
					ncmazAudioUrl: audioUrl,
					// New fields as meta
					artistSubmissionFields: {
						artistName,
						trackTitle,
						isrc,
						proAffiliation,
						ipiNumber,
					},
					// Existing fields
					ncmazVideoUrl: postOptionsData.videoUrl ?? null,
					postFormatName:
						postOptionsData.postFormatsSelected !== ''
							? postOptionsData.postFormatsSelected
							: null,
					showRightSidebar: postOptionsData.showRightSidebar ? '1' : '0',
					postStyle: postOptionsData.postStyleSelected,
				},
			})
		} else if (isEditingPage) {
			mutationUpdatePost({
				variables: {
					id: isEditingPostId || '',
					status,
					title: trackTitle,
					content: contentHTML,
					categoryNodes: categories.map((item) => ({ id: item.databaseId.toString() })),
					ncTags: tags.map((item) => item.name).join(','),
					featuredImg_alt: coverArt?.name ?? null,
					featuredImg_url: coverArtUploadedUrl,
					date: postOptionsData.timeSchedulePublication || null,
					commentStatus: postOptionsData.isAllowComments ? 'open' : 'closed',
					excerpt: shortDescription,
					ncmazAudioUrl: audioUrl,
					// New fields as meta
					artistSubmissionFields: {
						artistName,
						trackTitle,
						isrc,
						proAffiliation,
						ipiNumber,
					},
					// Existing fields
					ncmazVideoUrl: postOptionsData.videoUrl ?? null,
					postFormatName:
						postOptionsData.postFormatsSelected !== ''
							? postOptionsData.postFormatsSelected
							: null,
					showRightSidebar: postOptionsData.showRightSidebar ? '1' : '0',
					postStyle: postOptionsData.postStyleSelected,
				},
			})
		}
	}

	const handleClickPublish = () => {
		if (!isAuthenticated && !isReady) return

		if (!!postOptionsData.timeSchedulePublication) {
			onSubmmitMutation(PostStatusEnum.Future)
			return
		}

		onSubmmitMutation(PostStatusEnum.Publish)
	}

	const handleClickSaveDraft = () => {
		if (!isAuthenticated && !isReady) return
		onSubmmitMutation(PostStatusEnum.Draft)
	}

	const LOADING = loading || updatePostLoading
	const ERROR = error || updatePostError

	const renderPostTitle = () => {
		return (
			<div className="w-full px-2.5 pb-10 pt-2.5 lg:py-10">
				<div className="mx-auto w-full max-w-screen-md space-y-3">
					{/* New fields start */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label className="block text-sm mb-1">Artist Name</Label>
							<input
								type="text"
								className="block w-full rounded-md border border-neutral-300 dark:border-neutral-600 px-3 py-2 bg-white dark:bg-neutral-900"
								value={artistName}
								onChange={e => { setArtistName(e.target.value); updateToLocalStorageExtended(); }}
							/>
						</div>
						<div>
							<Label className="block text-sm mb-1">Track Title</Label>
							<input
								type="text"
								className="block w-full rounded-md border border-neutral-300 dark:border-neutral-600 px-3 py-2 bg-white dark:bg-neutral-900"
								value={trackTitle}
								onChange={e => { setTrackTitle(e.target.value); updateToLocalStorageExtended(); }}
							/>
						</div>
					</div>
					<div>
						<Label className="block text-sm mb-1">
							{labels.tags || T.pageSubmission['Add tags']}
						</Label>
						<TagsInput defaultValue={tags} onChange={handleChangeTags} />
					</div>
					<div>
					<Label className="block text-sm mb-1">Short Description</Label>
					<textarea
						className="block w-full rounded-md border border-neutral-300 dark:border-neutral-600 px-3 py-2 bg-white dark:bg-neutral-900"
						value={shortDescription}
						onChange={e => { setShortDescription(e.target.value); updateToLocalStorageExtended(); }}
					/>
					</div>
					<Label className="block text-sm mb-1">Upload Audio File (MP3/WAV)</Label>
					<div className="w-full bg-white border border-dashed border-neutral-300 rounded-xl bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center py-8 mb-4">
						<input
							type="file"
							accept=".mp3,.wav"
							className="hidden"
							id="audio-upload-input"
							onChange={e => {
								const file = e.target.files?.[0] || null;
								if (file && !['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/x-wav'].includes(file.type)) {
									toast.error('Only MP3 or WAV files are allowed');
									return;
								}
								setAudioFile(file);
								updateToLocalStorageExtended();
							}}
						/>
						{!audioFile ? (
							<label htmlFor="audio-upload-input" className="cursor-pointer flex flex-col items-center">
								<svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 48 48" aria-hidden="true">
									<path d="M24 4v40M4 24h40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								<span className="mt-3 text-primary-600 font-medium">Upload audio file</span>
								<span className="text-xs text-neutral-500">MP3, WAV only</span>
							</label>
						) : (
							<div className="flex flex-col items-center">
								<span className="text-sm text-neutral-700">{audioFile.name}</span>
								<button
									type="button"
									className="mt-2 text-xs text-red-500 underline"
									onClick={() => {
										setAudioFile(null);
										updateToLocalStorageExtended();
									}}
								>
									Remove
								</button>
							</div>
						)}
					</div>
					<Label className="block text-sm mb-1">Upload Cover Art (JPG/PNG)</Label>
					<ButtonInsertImage
						defaultImage={coverArt ? { sourceUrl: URL.createObjectURL(coverArt), altText: coverArt.name, id: '' } : { sourceUrl: '', altText: '', id: '' }}
						onChangeImage={img => {
							setCoverArt(img.sourceUrl ? { name: img.altText, sourceUrl: img.sourceUrl } as any : null);
							updateToLocalStorageExtended();
						}}
						contentClassName="px-3 py-8"
					/>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<Label className="block text-sm mb-1">ISRC</Label>
							<input
								type="text"
								className="block w-full rounded-md border border-neutral-300 dark:border-neutral-600 px-3 py-2 bg-white dark:bg-neutral-900"
								value={isrc}
								onChange={e => { setIsrc(e.target.value); updateToLocalStorageExtended(); }}
							/>
						</div>
						<div>
							<Label className="block text-sm mb-1">PRO Affiliation</Label>
							<input
								type="text"
								className="block w-full rounded-md border border-neutral-300 dark:border-neutral-600 px-3 py-2 bg-white dark:bg-neutral-900"
								value={proAffiliation}
								onChange={e => { setProAffiliation(e.target.value); updateToLocalStorageExtended(); }}
							/>
						</div>
					</div>
					<Label className="block text-sm mb-1">IPI Number (optional)</Label>
					<input
						type="text"
						className="block w-full rounded-md border border-neutral-300 dark:border-neutral-600 px-3 py-2 bg-white dark:bg-neutral-900"
						value={ipiNumber}
						onChange={e => { setIpiNumber(e.target.value); updateToLocalStorageExtended(); }}
					/>

					<div className="flex items-center mt-4">
						<input
							type="checkbox"
							checked={legalChecked}
							onChange={e => { setLegalChecked(e.target.checked); updateToLocalStorageExtended(); }}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded"
						/>
						<span className="ml-2 text-sm">I agree to the legal terms</span>
					</div>
					{/* New fields end */}
					{ERROR && (
						<Alert containerClassName="text-sm" type="error">
							{ERROR.message}
						</Alert>
					)}
				</div>
			</div>
		)
	}

	const enableRevertBtn =
		localStoragePath.startsWith('submission_page__edit__') &&
		!!localStorage.getItem(localStoragePath)?.length

	return (
		<>
			<div className="nc-CreateNewPostEditor relative flex-1">
				<div className="absolute inset-0 flex h-full flex-col">
					<div className="hiddenScrollbar flex-1 overflow-y-auto">
						{renderPostTitle()}

						<Label className="block text-sm mt-4 mx-auto w-full max-w-screen-md my-4">
							{labels.description || T.pageSubmission['Write your post content here…']}
						</Label>
						<TiptapEditor
							defaultContent={contentHTML}
							onUpdate={debounceGetContentHtml}
						/>
					</div>

					<div className="w-full flex-shrink-0 border-t border-neutral-200 px-2.5 dark:border-neutral-600">
						<div className="mx-auto flex w-full max-w-screen-md flex-wrap gap-2 py-4 pt-[18px] sm:gap-3">
							<ButtonPrimary
								fontSize="text-base font-medium"
								onClick={handleClickPublish}
								loading={LOADING}
								disabled={LOADING}
							>
								{!!postOptionsData.timeSchedulePublication
									? T.pageSubmission['Schedule']
									: T.pageSubmission['Publish']}
							</ButtonPrimary>
							<Button
								fontSize="text-base font-medium"
								onClick={handleClickSaveDraft}
								loading={LOADING}
								disabled={LOADING}
								pattern="third"
							>
								{isEditingPage
									? T.pageSubmission['Move to draft']
									: T.pageSubmission['Save draft']}
							</Button>
							<PostOptionsBtn
								defaultData={postOptionsData}
								onSubmit={handleApplyPostOptions}
							/>
							{enableRevertBtn ? (
								<Button
									fontSize="text-sm font-medium"
									onClick={() => {
										// open window confirm to confirm revert
										let result = confirm(
											'Are you sure you want to revert new changes?',
										)
										if (result) {
											handleRevertToDefault()
										}
									}}
									loading={LOADING}
									disabled={LOADING}
									pattern="link"
									sizeClass="py-3 px-4"
								>
									{T.pageSubmission['Revert new changes']}
								</Button>
							) : null}
						</div>
					</div>
				</div>
			</div>

			{!!isEditingPage && (
				<NcModal
					renderTrigger={() => null}
					isOpenProp={!!newUpdatedUri}
					renderContent={() => (
						<div className="py-5">
							<div className="font-medium">
								{
									T.pageSubmission[
										'Congratulations! You have successfully updated the post!'
									]
								}
							</div>
							<div className="mt-2.5 text-sm text-neutral-700">
								{
									T.pageSubmission[
										'These changes will be applied to the post in about 15 minutes.'
									]
								}{' '}
								<br />
								{T.pageSubmission['You can']}{' '}
								<Link
									href={`/preview${newUpdatedUri}&preview=true&previewPathname=post`}
									className="font-medium underline"
								>
									{T.pageSubmission['preview the post']}
								</Link>{' '}
								{T.pageSubmission['by clicking the button below.']}
							</div>
						</div>
					)}
					onCloseModal={() => setNewUpdatedUri('')}
					contentExtraClass="max-w-screen-sm"
					modalTitle="Update post successfully"
					renderFooter={() => (
						<div className="flex justify-end">
							<ButtonPrimary
								href={`/preview${newUpdatedUri}&preview=true&previewPathname=post`}
								onClick={() => {
									setNewUpdatedUri('')
								}}
							>
								{T.pageSubmission['Preview post']}
							</ButtonPrimary>
						</div>
					)}
				/>
			)}
		</>
	)
}

export default CreateNewPostEditor

// Helper function for file upload
async function uploadFileToWordPress(file: File): Promise<string> {
	try {
		const response = await fetch('/api/faust/auth/token', { method: 'GET' })
		const { accessToken } = await response.json()
		if (!accessToken) return ''
		const formData = new FormData()
		formData.append('file', file)
		const wordPressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, '')
		const uploadFile = await fetch(`${wordPressUrl}/wp-json/wp/v2/media`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${accessToken}` },
			body: formData,
		})
		const uploadFileRes = await uploadFile.json()
		return uploadFileRes.source_url || ''
	} catch {
		return ''
	}
}

