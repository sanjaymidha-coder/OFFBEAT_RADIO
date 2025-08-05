'use client'

import { FC, useEffect, useState, Fragment } from 'react'
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
import {
	encodeCustomPostMeta,
	decodeCustomPostMeta,
	getArtistTrackData,
	updateArtistTrackData,
	ArtistTrackData
} from '@/utils/artistTrackUtils'
import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
	Transition,
} from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid'

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
		artistTrackData: {
			artistName: '',
			trackTitle: '',
			albumName: '',
			releaseYear: '',
			genre: '',
			recordLabel: '',
			producer: '',
			featuredArtists: [],
			spotifyUrl: '',
			appleMusicUrl: '',
			youtubeUrl: '',
			soundcloudUrl: '',
			bandcampUrl: '',
		},
	},
	labels = {},
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
	// Add state for artist track fields
	const [artistName, setArtistName] = useState('')
	const [trackTitle, setTrackTitle] = useState('')
	// Remove albumTitle state
	const [trackFileUrl, setTrackFileUrl] = useState('')
	const [trackFileName, setTrackFileName] = useState('')
	const [isrc, setIsrc] = useState('')
	const [proAffiliation, setProAffiliation] = useState('')
	const [soundExchangeRegistered, setSoundExchangeRegistered] = useState(false)
	const [status, setStatus] = useState('pending')
	const [airplayCount, setAirplayCount] = useState(0)
	const [spinCount, setSpinCount] = useState(0)
	const [targetChannel, setTargetChannel] = useState('')
	const [targetPlaylist, setTargetPlaylist] = useState('')
	//
	const [newUpdatedUri, setNewUpdatedUri] = useState('')
	const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)

	//

	// all keys of states
	const stateKeys = [
		'titleContent',
		'contentHTML',
		'featuredImage',
		'tags',
		'categories',
		'postOptionsData',
		'artistName',
		'trackTitle',
		'trackFileUrl',
		'trackFileName',
		'isrc',
		'proAffiliation',
		'soundExchangeRegistered',
		'status',
		'airplayCount',
		'spinCount',
		'targetChannel',
		'targetPlaylist',
	] as const

	const updateToLocalStorage = (
		name: (typeof stateKeys)[number],
		value: unknown,
	) => {
		const currentData = JSON.parse(localStorage.getItem(localStoragePath) || '{}')
		currentData[name] = value
		localStorage.setItem(localStoragePath, JSON.stringify(currentData))
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
			setArtistName(data.artistName || '')
			setTrackTitle(data.trackTitle || '')
			setTrackFileUrl(data.trackFileUrl || '')
			setTrackFileName(data.trackFileName || '')
			setIsrc(data.isrc || '')
			setProAffiliation(data.proAffiliation || '')
			setSoundExchangeRegistered(data.soundExchangeRegistered || false)
			setStatus(data.status || 'pending')
			setAirplayCount(data.airplayCount || 0)
			setSpinCount(data.spinCount || 0)
			setTargetChannel(data.targetChannel || '')
			setTargetPlaylist(data.targetPlaylist || '')
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

	const onSubmmitMutation = (status: PostStatusEnum) => {
		// for site chisnghiax demo - please delete this code on your site
		if (IS_CHISNGHIAX_DEMO_SITE) {
			toast.error('Sorry, post submission is disabled on the demo site!')
			return
		}

		if (isSubmittingPage) {
			// Encode artist track data into ncmazVideoUrl
			const artistTrackData = {
				artistName,
				trackTitle,
				trackFileUrl,
				trackFileName,
				isrc,
				proAffiliation,
				soundExchangeRegistered,
				status,
				airplayCount,
				spinCount,
				targetChannel,
				targetPlaylist,
			}
			const encodedVideoUrl = JSON.stringify({ artistTrack: artistTrackData })
			mutationCreatePost({
				variables: {
					status,
					title: titleContent,
					content: contentHTML,
					categoryNodes: categories.map((item) => ({
						id: item.databaseId.toString(),
					})),
					ncTags: tags.map((item) => item.name).join(','),
					featuredImg_alt: featuredImage?.altText ?? null,
					featuredImg_url: featuredImage?.sourceUrl ?? null,
					date: postOptionsData.timeSchedulePublication || null,
					//
					img_1_alt:
						postOptionsData.objGalleryImgs?.['image1']?.altText ?? null,
					img_2_alt:
						postOptionsData.objGalleryImgs?.['image2']?.altText ?? null,
					img_3_alt:
						postOptionsData.objGalleryImgs?.['image3']?.altText ?? null,
					img_4_alt:
						postOptionsData.objGalleryImgs?.['image4']?.altText ?? null,
					img_5_alt:
						postOptionsData.objGalleryImgs?.['image5']?.altText ?? null,
					img_6_alt:
						postOptionsData.objGalleryImgs?.['image6']?.altText ?? null,
					img_7_alt:
						postOptionsData.objGalleryImgs?.['image7']?.altText ?? null,
					img_8_alt:
						postOptionsData.objGalleryImgs?.['image8']?.altText ?? null,
					//
					img_1_url:
						postOptionsData.objGalleryImgs?.['image1']?.sourceUrl ?? null,
					img_2_url:
						postOptionsData.objGalleryImgs?.['image2']?.sourceUrl ?? null,
					img_3_url:
						postOptionsData.objGalleryImgs?.['image3']?.sourceUrl ?? null,
					img_4_url:
						postOptionsData.objGalleryImgs?.['image4']?.sourceUrl ?? null,
					img_5_url:
						postOptionsData.objGalleryImgs?.['image5']?.sourceUrl ?? null,
					img_6_url:
						postOptionsData.objGalleryImgs?.['image6']?.sourceUrl ?? null,
					img_7_url:
						postOptionsData.objGalleryImgs?.['image7']?.sourceUrl ?? null,
					img_8_url:
						postOptionsData.objGalleryImgs?.['image8']?.sourceUrl ?? null,
					//
					commentStatus: postOptionsData.isAllowComments ? 'open' : 'closed',
					excerpt: postOptionsData.excerptText ?? null,
					ncmazAudioUrl: postOptionsData.audioUrl ?? null,
					ncmazVideoUrl: encodedVideoUrl,
					postFormatName:
						postOptionsData.postFormatsSelected !== ''
							? postOptionsData.postFormatsSelected
							: null,
					//
					showRightSidebar: postOptionsData.showRightSidebar ? '1' : '0',
					postStyle: postOptionsData.postStyleSelected,
					//
				},
			})
		} else if (isEditingPage) {
			// Encode artist track data into ncmazVideoUrl
			const artistTrackData = {
				artistName,
				trackTitle,
				trackFileUrl,
				trackFileName,
				isrc,
				proAffiliation,
				soundExchangeRegistered,
				status,
				airplayCount,
				spinCount,
				targetChannel,
				targetPlaylist,
			}
			const encodedVideoUrl = JSON.stringify({ artistTrack: artistTrackData })
			mutationUpdatePost({
				variables: {
					id: isEditingPostId || '',
					status,
					title: titleContent,
					content: contentHTML,
					categoryNodes: categories.map((item) => ({
						id: item.databaseId.toString(),
					})),
					ncTags: tags.map((item) => item.name).join(','),
					featuredImg_alt: featuredImage?.altText ?? null,
					featuredImg_url: featuredImage?.sourceUrl ?? null,
					date: postOptionsData.timeSchedulePublication || null,
					//
					img_1_alt:
						postOptionsData.objGalleryImgs?.['image1']?.altText ?? null,
					img_2_alt:
						postOptionsData.objGalleryImgs?.['image2']?.altText ?? null,
					img_3_alt:
						postOptionsData.objGalleryImgs?.['image3']?.altText ?? null,
					img_4_alt:
						postOptionsData.objGalleryImgs?.['image4']?.altText ?? null,
					img_5_alt:
						postOptionsData.objGalleryImgs?.['image5']?.altText ?? null,
					img_6_alt:
						postOptionsData.objGalleryImgs?.['image6']?.altText ?? null,
					img_7_alt:
						postOptionsData.objGalleryImgs?.['image7']?.altText ?? null,
					img_8_alt:
						postOptionsData.objGalleryImgs?.['image8']?.altText ?? null,
					//
					img_1_url:
						postOptionsData.objGalleryImgs?.['image1']?.sourceUrl ?? null,
					img_2_url:
						postOptionsData.objGalleryImgs?.['image2']?.sourceUrl ?? null,
					img_3_url:
						postOptionsData.objGalleryImgs?.['image3']?.sourceUrl ?? null,
					img_4_url:
						postOptionsData.objGalleryImgs?.['image4']?.sourceUrl ?? null,
					img_5_url:
						postOptionsData.objGalleryImgs?.['image5']?.sourceUrl ?? null,
					img_6_url:
						postOptionsData.objGalleryImgs?.['image6']?.sourceUrl ?? null,
					img_7_url:
						postOptionsData.objGalleryImgs?.['image7']?.sourceUrl ?? null,
					img_8_url:
						postOptionsData.objGalleryImgs?.['image8']?.sourceUrl ?? null,
					//
					commentStatus: postOptionsData.isAllowComments ? 'open' : 'closed',
					excerpt: postOptionsData.excerptText ?? null,
					ncmazAudioUrl: postOptionsData.audioUrl ?? null,
					ncmazVideoUrl: encodedVideoUrl,
					postFormatName:
						postOptionsData.postFormatsSelected !== ''
							? postOptionsData.postFormatsSelected
							: null,
					//
					showRightSidebar: postOptionsData.showRightSidebar ? '1' : '0',
					postStyle: postOptionsData.postStyleSelected,
					//
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


					<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
						<div className="md:col-span-6">
							{labels.title && <Label className="block text-sm mb-1">{labels.title}</Label>}
							<TitleEditor
								defaultTitle={titleContent}
								onUpdate={debounceGetTitle}
							/>
						</div>
						<div className="md:col-span-6">
							<Label className="block text-sm mb-1">Artist Name</Label>
							<input
								type="text"
								className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
								value={artistName}
								onChange={e => {
									setArtistName(e.target.value)
									updateToLocalStorage('artistName', e.target.value)
								}}
								placeholder="Enter artist name..."
							/>
						</div>
					</div>
					<Label className="block text-sm mb-1">
						{labels.image || T.pageSubmission['Featured image']}
					</Label>
					<ButtonInsertImage
						defaultImage={featuredImage}
						onChangeImage={handleChangeFeaturedImage}
					/>
					<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
						<div className="md:col-span-6">
							<Label className="block text-sm mb-1">Track Title</Label>
							<input
								type="text"
								className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
								value={trackTitle}
								onChange={e => {
									setTrackTitle(e.target.value)
									updateToLocalStorage('trackTitle', e.target.value)
								}}
								placeholder="Enter track title..."
							/>
						</div>

						<div className="md:col-span-6">
							<Label className="block text-sm mb-1">Track File URL</Label>
							<input
								type="text"
								className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
								value={trackFileUrl}
								onChange={e => {
									setTrackFileUrl(e.target.value)
									updateToLocalStorage('trackFileUrl', e.target.value)
								}}
								placeholder="Enter track file URL..."
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
						<div className="md:col-span-6">
							<Label className="block text-sm mb-1">Track File Name</Label>
							<input
								type="text"
								className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
								value={trackFileName}
								onChange={e => {
									setTrackFileName(e.target.value)
									updateToLocalStorage('trackFileName', e.target.value)
								}}
								placeholder="Enter track file name..."
							/>
						</div>
						<div className="md:col-span-6">
							<Label className="block text-sm mb-1">ISRC</Label>
							<input
								type="text"
								className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
								value={isrc}
								onChange={e => {
									setIsrc(e.target.value)
									updateToLocalStorage('isrc', e.target.value)
								}}
								placeholder="Enter ISRC..."
							/>
						</div>
					</div>
					<Label className="block text-sm mb-1">
						{labels.tags || T.pageSubmission['Add tags']}
					</Label>
					<TagsInput defaultValue={tags} onChange={handleChangeTags} />

					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-6">
							<Label className="block text-sm mb-1">PRO Affiliation</Label>
							<Listbox value={proAffiliation} onChange={(value) => {
								setProAffiliation(value)
								updateToLocalStorage('proAffiliation', value)
							}}>
								<div className="relative mt-1">
									<ListboxButton as="div">
										<Button pattern="third" fontSize="text-sm font-medium" className="w-full rounded-md justify-between">
											<span className="">
												{proAffiliation || 'Select PRO Affiliation'}
											</span>
											<ChevronDownIcon
												className="-me-1 ms-2 h-4 w-4"
												aria-hidden="true"
											/>
										</Button>
									</ListboxButton>
									<Transition
										as={Fragment}
										leave="transition ease-in duration-100"
										leaveFrom="opacity-100"
										leaveTo="opacity-0"
									>
										<ListboxOptions
											className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-auto rounded-md bg-white py-1 text-sm text-neutral-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700"
										>
											{[
												{ value: '', label: 'Select PRO...' },
												{ value: 'ASCAP', label: 'ASCAP' },
												{ value: 'BMI', label: 'BMI' },
												{ value: 'SESAC', label: 'SESAC' },
												{ value: 'GMR', label: 'GMR' },
												{ value: 'Other', label: 'Other' }
											].map((option, optionIdx) => (
												<ListboxOption
													key={optionIdx}
													className="relative cursor-default select-none py-2 pe-4 ps-10 data-[focus]:bg-primary-50 data-[focus]:text-primary-700 dark:data-[focus]:bg-neutral-700 dark:data-[focus]:text-neutral-200"
													value={option.value}
												>
													{({ selected }) => (
														<>
															<span
																className={`block truncate ${
																	selected ? 'font-medium' : 'font-normal'
																}`}
															>
																{option.label}
															</span>
															{selected ? (
																<span className="absolute inset-y-0 start-0 flex items-center ps-3 text-primary-700 dark:text-neutral-200">
																	<CheckIcon
																		className="h-5 w-5"
																		aria-hidden="true"
																	/>
																</span>
															) : null}
														</>
													)}
												</ListboxOption>
											))}
										</ListboxOptions>
									</Transition>
								</div>
							</Listbox>
						</div>
						<div className="col-span-6">
							<Label className="block text-sm mb-1">SoundExchange Registration</Label>
							<Listbox value={soundExchangeRegistered ? 'registered' : 'not-registered'} onChange={(value) => {
								const boolValue = value === 'registered'
								setSoundExchangeRegistered(boolValue)
								updateToLocalStorage('soundExchangeRegistered', boolValue)
							}}>
								<div className="relative mt-1">
									<ListboxButton as="div">
										<Button pattern="third" fontSize="text-sm font-medium" className="w-full rounded-md justify-between">
											<span className="block truncate">
												{soundExchangeRegistered ? 'Registered' : 'Not Registered'}
											</span>
											<ChevronDownIcon
												className="-me-1 ms-2 h-4 w-4"
												aria-hidden="true"
											/>
										</Button>
									</ListboxButton>
									<Transition
										as={Fragment}
										leave="transition ease-in duration-100"
										leaveFrom="opacity-100"
										leaveTo="opacity-0"
									>
										<ListboxOptions
											className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-auto rounded-md bg-white py-1 text-sm text-neutral-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700"
										>
											{[
												{ value: 'not-registered', label: 'Not Registered' },
												{ value: 'registered', label: 'Registered' }
											].map((option, optionIdx) => (
												<ListboxOption
													key={optionIdx}
													className="relative cursor-default select-none py-2 pe-4 ps-10 data-[focus]:bg-primary-50 data-[focus]:text-primary-700 dark:data-[focus]:bg-neutral-700 dark:data-[focus]:text-neutral-200"
													value={option.value}
												>
													{({ selected }) => (
														<>
															<span
																className={`block truncate ${
																	selected ? 'font-medium' : 'font-normal'
																}`}
															>
																{option.label}
															</span>
															{selected ? (
																<span className="absolute inset-y-0 start-0 flex items-center ps-3 text-primary-700 dark:text-neutral-200">
																	<CheckIcon
																		className="h-5 w-5"
																		aria-hidden="true"
																	/>
																</span>
															) : null}
														</>
													)}
												</ListboxOption>
											))}
										</ListboxOptions>
									</Transition>
								</div>
							</Listbox>
						</div>
					</div>
					<div>
						<Label className="block text-sm mb-1">Status</Label>
						<Listbox value={status} onChange={(value) => {
							setStatus(value as 'pending' | 'approved' | 'live' | 'rejected')
							updateToLocalStorage('status', value)
						}}>
							<div className="relative mt-1">
								<ListboxButton as="div">
									<Button pattern="third" fontSize="text-sm font-medium" className="w-full rounded-md justify-between">
										<span className="block truncate capitalize">
											{status}
										</span>
										<ChevronDownIcon
											className="-me-1 ms-2 h-4 w-4"
											aria-hidden="true"
										/>
									</Button>
								</ListboxButton>
								<Transition
									as={Fragment}
									leave="transition ease-in duration-100"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<ListboxOptions
										className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-auto rounded-md bg-white py-1 text-sm text-neutral-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700"
									>
										{[
											{ value: 'pending', label: 'Pending' },
											{ value: 'approved', label: 'Approved' },
											{ value: 'live', label: 'Live' },
											{ value: 'rejected', label: 'Rejected' }
										].map((option, optionIdx) => (
											<ListboxOption
												key={optionIdx}
												className="relative cursor-default select-none py-2 pe-4 ps-10 data-[focus]:bg-primary-50 data-[focus]:text-primary-700 dark:data-[focus]:bg-neutral-700 dark:data-[focus]:text-neutral-200"
												value={option.value}
											>
												{({ selected }) => (
													<>
														<span
															className={`block truncate capitalize ${
																selected ? 'font-medium' : 'font-normal'
															}`}
														>
															{option.label}
														</span>
														{selected ? (
															<span className="absolute inset-y-0 start-0 flex items-center ps-3 text-primary-700 dark:text-neutral-200">
																<CheckIcon
																	className="h-5 w-5"
																	aria-hidden="true"
																/>
															</span>
														) : null}
													</>
												)}
											</ListboxOption>
										))}
									</ListboxOptions>
								</Transition>
							</div>
						</Listbox>
					</div>
					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-6">
							<Label className="block text-sm mb-1">Airplay Count</Label>
							<input
								type="number"
								className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
								value={airplayCount}
								onChange={e => {
									setAirplayCount(parseInt(e.target.value) || 0)
									updateToLocalStorage('airplayCount', parseInt(e.target.value) || 0)
								}}
								placeholder="0"
							/>
						</div>
						<div className="col-span-6">
							<Label className="block text-sm mb-1">Spin Count</Label>
							<input
								type="number"
								className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
								value={spinCount}
								onChange={e => {
									setSpinCount(parseInt(e.target.value) || 0)
									updateToLocalStorage('spinCount', parseInt(e.target.value) || 0)
								}}
								placeholder="0"
							/>
						</div>
					</div>
					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-6">
							<Label className="block text-sm mb-1">Target Channel</Label>
							<input
								type="text"
								className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
								value={targetChannel}
								onChange={e => {
									setTargetChannel(e.target.value)
									updateToLocalStorage('targetChannel', e.target.value)
								}}
								placeholder="Enter target channel..."
							/>
						</div>
						<div className="col-span-6">
							<Label className="block text-sm mb-1">Target Playlist</Label>
							<input
								type="text"
								className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
								value={targetPlaylist}
								onChange={e => {
									setTargetPlaylist(e.target.value)
									updateToLocalStorage('targetPlaylist', e.target.value)
								}}
								placeholder="Enter target playlist..."
							/>
						</div>
					</div>
					<div className="hidden">
						<CategoriesInput
							defaultValue={categories}
							onChange={handleChangeCategories}
						/>
					</div>
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

