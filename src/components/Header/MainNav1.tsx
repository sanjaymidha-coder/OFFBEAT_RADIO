import React from 'react'
import { FC } from 'react'
import Navigation from '@/components/Navigation/Navigation'
import MenuBar from '@/components/MenuBar/MenuBar'
import { NC_PRIMARY_MENU_QUERY_FRAGMENT } from '@/fragments/menu'
import { FragmentType } from '@/__generated__'
import AvatarDropdown from './AvatarDropdown'
import Brand from './Brand'
import CreateBtn from './CreateBtn'
import { SearchIconBtn } from './HeaderSearch'
import { NC_SITE_SETTINGS } from '@/contains/site-settings'

export interface MainNav1Props {
	menuItems: FragmentType<typeof NC_PRIMARY_MENU_QUERY_FRAGMENT>[]
	title?: string | null
	description?: string | null
}

const MainNav1: FC<MainNav1Props> = ({ menuItems, title, description }) => {
	return (
		<div className="nc-MainNav1 relative z-10 border-b border-neutral-200/70 bg-white dark:bg-white">
			<div className="container">
				<div className="flex h-16 items-center py-3 sm:h-20 sm:py-4">
					{/* Left: Logo */}
					<div className="flex flex-1 items-center min-w-[140px]">
						<Brand title={title} description={description} />
					</div>

					{/* Center: Navigation (perfectly centered) */}
					<div className="flex flex-none items-center justify-center">
						<Navigation menuItems={menuItems} className="flex justify-center" />
					</div>

					{/* Right: Actions */}
					<div className="flex flex-1 items-center justify-end space-x-1 text-neutral-700 rtl:space-x-reverse dark:text-neutral-100 min-w-[140px]">
						<div className="hidden items-center lg:flex">
							{!NC_SITE_SETTINGS.site_header?.desktop_header?.hide_create_button && <CreateBtn />}
							<SearchIconBtn className="flex" />
							<AvatarDropdown />
						</div>
						<div className="flex items-center lg:hidden">
							<SearchIconBtn className="flex" />
							<AvatarDropdown />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default MainNav1
