import { gql } from '@/__generated__'
import {
	NcgeneralSettingsFieldsFragmentFragment,
	PageCategoryGetCategoryQuery,
} from '@/__generated__/graphql'
import { TCategoryCardFull } from '@/components/CardCategory1/CardCategory1'
import MyImage from '@/components/MyImage'
import SocialsShareDropdown from '@/components/SocialsShareDropdown/SocialsShareDropdown'
import PageLayout from '@/container/PageLayout'
import ArchiveLayout from '@/container/archives/ArchiveLayout'
import { GET_POSTS_FIRST_COMMON } from '@/contains/contants'
import { FOOTER_LOCATION, PRIMARY_LOCATION } from '@/contains/menu'
import { PostDataFragmentType } from '@/data/types'
import { getCatgoryDataFromCategoryFragment } from '@/utils/getCatgoryDataFromCategoryFragment'
import { getImageDataFromImageFragment } from '@/utils/getImageDataFromImageFragment'
import { FaustTemplate } from '@faustwp/core'
import { FireIcon, FolderIcon } from '@heroicons/react/24/outline'

const Category: FaustTemplate<PageCategoryGetCategoryQuery> = (props) => {
	// LOADING ----------
	if (props.loading) {
		return <>Loading...</>
	}

	if (!props?.data || !props.data.category) {
		return null
	}

	// START ----------
	const {
		databaseId,
		count,
		description,
		name,
		ncTaxonomyMeta,
		featuredImageMeta,
	} = getCatgoryDataFromCategoryFragment(props.data.category)
	const initPostsPageInfo = props.data?.category?.posts?.pageInfo
	const posts = props.data?.category?.posts
	const _top10Categories =
		(props.data?.categories?.nodes as TCategoryCardFull[]) || []

	return (
		<PageLayout
			headerMenuItems={props.data?.primaryMenuItems?.nodes || []}
			footerMenuItems={props.data?.footerMenuItems?.nodes || []}
			pageFeaturedImageUrl={featuredImageMeta?.sourceUrl}
			pageTitle={'Category ' + name}
			pageDescription={description || ''}
			generalSettings={
				props.data?.generalSettings as NcgeneralSettingsFieldsFragmentFragment
			}
		>
			<ArchiveLayout
				name={name}
				initPosts={posts?.nodes as PostDataFragmentType[] | null}
				initPostsPageInfo={initPostsPageInfo}
				categoryDatabaseId={databaseId}
				taxonomyType="category"
				top10Categories={_top10Categories} children={undefined}			>
				{/* HEADER */}
			</ArchiveLayout>
		</PageLayout>
	)
}

Category.variables = ({ id }) => ({
	id,
	first: GET_POSTS_FIRST_COMMON,
	headerLocation: PRIMARY_LOCATION,
	footerLocation: FOOTER_LOCATION,
})

Category.query = gql(`
query PageCategoryGetCategory($id: ID!, $first: Int, $headerLocation: MenuLocationEnum!, $footerLocation: MenuLocationEnum!)  {
    category(id: $id) {
       ...NcmazFcCategoryFullFieldsFragment
      posts(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
        nodes {
          ...NcmazFcPostCardFields
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
    categories(first:10, where: { orderby: COUNT, order: DESC }) {
      nodes {
        ...NcmazFcCategoryFullFieldsFragment
      }
    }
    # common query for all page 
    generalSettings {
      ...NcgeneralSettingsFieldsFragment
    }
    primaryMenuItems: menuItems(where: { location:  $headerLocation  }, first: 80) {
      nodes {
        ...NcPrimaryMenuFieldsFragment
      }
    }
    footerMenuItems: menuItems(where: { location:  $footerLocation  }, first: 40) {
      nodes {
        ...NcFooterMenuFieldsFragment
      }
    }
 }`)

export default Category
