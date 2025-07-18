import { FC } from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import getTrans from '@/utils/getTrans'

interface Props {
	onUpdate: (editor: any) => void;
	defaultTitle?: string;
	placeholder?: string;
}

const TitleEditor: FC<Props> = ({ onUpdate, defaultTitle = '', placeholder }) => {
	const T = getTrans();
	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({
				placeholder: placeholder || T.pageSubmission['New post title here…'],
			}),
		],
		editorProps: {
			attributes: {
				class:
					'focus:outline-none max-w-screen-md mx-auto text-neutral-900 font-semibold text-2xl sm:text-3xl lg:text-4xl xl:leading-[115%] xl:text-[2.75rem] dark:text-neutral-100',
			},
		},
		immediatelyRender: false,
		content: defaultTitle,
		onUpdate: ({ editor }) => {
			// @ts-ignore
			onUpdate(editor);
		},
	});

	return <EditorContent className="focus:outline-none border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 font-semibold text-2xl sm:text-3xl lg:text-4xl xl:leading-[115%] xl:text-[2.75rem] dark:text-neutral-100" editor={editor} />;
};

export default TitleEditor
