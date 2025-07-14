import { FaustPage, getNextServerSideProps } from '@faustwp/core'
import { gql } from '@/__generated__'
import {
  NcgeneralSettingsFieldsFragmentFragment,
  OrderEnum,
  PostObjectsConnectionOrderbyEnum,
  PostsFilterPageQueryGetPostsQuery,
} from '@/__generated__/graphql'
import { FILTERS_OPTIONS } from '@/contains/contants'
import React from 'react'
import { useRouter } from 'next/router'
import { FOOTER_LOCATION, PRIMARY_LOCATION } from '@/contains/menu'
import PageLayout from '@/container/PageLayout'
import GridPostsArchive from '@/components/GridPostsArchive'
import TabFilters from '@/components/TabFilters'
import ArchiveFilterListBox from '@/components/ArchiveFilterListBox/ArchiveFilterListBox'
import { GetServerSidePropsContext } from 'next'
import { PostDataFragmentType } from '@/data/types'
const UPCOMING_SHOWS_CATEGORY_ID = 222
const GET_POSTS_FIRST_COMMON = 24

interface ConTextQuery {
  search: string | null
  tagIn: number[]
  authorIn: number[]
  categoryIn: number[]
  field: string
  order: string
  first: number | null
  last: number | null
  after: string | null
  before: string | null
}

const Page: FaustPage<PostsFilterPageQueryGetPostsQuery> = (props) => {
  const { posts } = props.data || {}
  const router = useRouter()
  
	const initPosts = (posts?.nodes as PostDataFragmentType[]) || []
  const ctxQuery: ConTextQuery = props.__PAGE_VARIABLES__?.ctxQuery || {}

  const onTagsUpdated = (ids: number[]) => {
    router.push({
      query: removeEmptyKey({
        ...ctxQuery,
        tagIn: ids,
        first: null,
        last: null,
        after: null,
        before: null,
      }),
    })
  }

  const onAuthorsUpdated = (ids: number[]) => {
    router.push({
      query: removeEmptyKey({
        ...ctxQuery,
        authorIn: ids,
        first: null,
        last: null,
        after: null,
        before: null,
      }),
    })
  }

  const onKeywordUpdated = (keyword: string) => {
    router.push({
      query: removeEmptyKey({
        ...ctxQuery,
        search: keyword,
        first: null,
        last: null,
        after: null,
        before: null,
      }),
    })
  }

  const onClickNext = () => {
    router.push({
      query: removeEmptyKey({
        ...ctxQuery,
        after: posts?.pageInfo.endCursor,
        first: ctxQuery.first,
        before: null,
        last: null,
      }),
    })
  }

  const onClickPrev = () => {
    router.push({
      query: removeEmptyKey({
        ...ctxQuery,
        first: null,
        after: null,
        before: posts?.pageInfo.startCursor,
        last: ctxQuery.first,
      }),
    })
  }

  const removeEmptyKey = (obj: Record<string, any>) => {
    Object.keys(obj).forEach((key) => !obj[key] && delete obj[key])
    return obj
  }

  function checkRouterQueryFilter(
    routerQueryFilter: `${PostObjectsConnectionOrderbyEnum}/${OrderEnum}`,
  ) {
    if (!routerQueryFilter) {
      return false
    }
    const [field, order] = routerQueryFilter?.split('/')
    return {
      field: field as PostObjectsConnectionOrderbyEnum,
      order: order as OrderEnum,
    }
  }

  return (
    <PageLayout
      headerMenuItems={props.data?.primaryMenuItems?.nodes || []}
      footerMenuItems={props.data?.footerMenuItems?.nodes || []}
      pageFeaturedImageUrl={null}
      pageTitle={"Upcoming Shows"}
      pageDescription={"Discover our upcoming radio shows and events!"}
      generalSettings={props.data?.generalSettings as NcgeneralSettingsFieldsFragmentFragment}
    >
      <div className={`nc-PageCollection`}>
        <div className="container space-y-16 py-10 sm:space-y-20 lg:space-y-28 lg:pb-28 lg:pt-20">
          <div className="space-y-10">
            <header>
              <h1 className="block text-2xl font-semibold capitalize sm:text-3xl lg:text-4xl flex items-center gap-2">
                <span role="img" aria-label="calendar">📅</span> Upcoming Shows
              </h1>
              <div className="mt-2 flex items-center gap-2 text-sm font-medium text-neutral-500">
                <span>Discover our upcoming radio shows and events!</span>
              </div>
            </header>

            <hr className="border-slate-200 dark:border-slate-700" />

            <main>
              <div className="flex flex-col lg:flex-row lg:justify-between">
                <TabFilters
                  showCategories={false}
                  showAuthors={false}
                  initTagIds={ctxQuery.tagIn}
                  initAuthorIds={ctxQuery.authorIn || []}
                  initKeyword={ctxQuery.search || ''}
                  onTagsUpdated={onTagsUpdated}
                  onAuthorsUpdated={onAuthorsUpdated}
                  onKeywordUpdated={onKeywordUpdated}
                  onCategoriesUpdated={() => {}}
                  keywordLabel="Search Show"
                />
                <div className="my-4 block w-full border-b border-neutral-300 lg:hidden dark:border-neutral-500" />
                <div className="flex justify-end">
                  <ArchiveFilterListBox
                    defaultValue={FILTERS_OPTIONS[0]}
                    onChange={() => {}}
                    lists={FILTERS_OPTIONS}
                  />
                </div>
              </div>

              <GridPostsArchive
                posts={initPosts}
                showNextPagination={posts?.pageInfo.hasNextPage}
                showPrevPagination={posts?.pageInfo.hasPreviousPage}
                onClickNext={onClickNext}
                onClickPrev={onClickPrev}
                hideMeta={true}
                hidePlayButton={true}
              />
            </main>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

Page.variables = (context) => {
  const { params, query = {} } = context as GetServerSidePropsContext
  const search = typeof query.search === 'string' ? query.search || null : null
  const tagIn = (
    Array.isArray(query.tagIn) ? query.tagIn : query.tagIn ? [query.tagIn] : []
  ).map((id) => parseInt(id))
  const authorIn = (
    Array.isArray(query.authorIn)
      ? query.authorIn
      : query.authorIn
      ? [query.authorIn]
      : []
  ).map((id) => parseInt(id))
  const categoryIn = [UPCOMING_SHOWS_CATEGORY_ID]
  const field = typeof query.field === 'string' ? query.field : 'DATE'
  const order = typeof query.order === 'string' ? query.order : 'DESC'
  const after = typeof query.after === 'string' ? query.after || null : null
  const before = typeof query.before === 'string' ? query.before || null : null
  let first =
    typeof query.first === 'string' ? parseInt(query.first) || null : null
  let last =
    typeof query.last === 'string' ? parseInt(query.last) || null : null
  if (!after && !before) {
    first = GET_POSTS_FIRST_COMMON
    last = null
  }
  const ctxQuery: ConTextQuery = {
    ...query,
    search,
    tagIn,
    authorIn,
    categoryIn,
    field,
    order,
    first: last ? null : first || GET_POSTS_FIRST_COMMON,
    last,
    after,
    before,
  }
  return {
    ...ctxQuery,
    ctxQuery,
    headerLocation: PRIMARY_LOCATION,
    footerLocation: FOOTER_LOCATION,
  }
}

Page.query = gql(`
  query PostsFilterPageQueryGetPosts( 
  $in: [ID] = null
  $first: Int = 20
  $after: String = null
  $last: Int
  $before: String
  $author: Int = null
  $categoryId: Int = null
  $authorIn: [ID] = null
  $categoryIn: [ID] = null
  $tagIn: [ID] = null
  $categoryName: String = null
  $tagId: String = null
  $day: Int = null
  $month: Int = null
  $year: Int = null
  $search: String = ""
  $field: PostObjectsConnectionOrderbyEnum = DATE
  $order: OrderEnum = DESC
  $headerLocation: MenuLocationEnum!
  $footerLocation: MenuLocationEnum!
  ) {
    posts(
      first: $first
      after: $after
      last: $last
      before: $before
      where: {
        in: $in
        author: $author
        authorIn: $authorIn
        categoryIn: $categoryIn
        tagIn: $tagIn
        categoryId: $categoryId
        categoryName: $categoryName
        tagId: $tagId
        dateQuery: { day: $day, month: $month, year: $year }
        search: $search
        orderby: { field: $field, order: $order }
      }
    ) {
      nodes {
        ...NcmazFcPostCardFields
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
    generalSettings {
      ...NcgeneralSettingsFieldsFragment
    }
    primaryMenuItems: menuItems(where: { location:  $headerLocation  }, first: 80) {
      nodes {
        ...NcPrimaryMenuFieldsFragment
      }
    }
    footerMenuItems: menuItems(where: { location:  $footerLocation  }, first: 50) {
      nodes {
        ...NcFooterMenuFieldsFragment
      }
    }
  }
`)

export function getServerSideProps(ctx: any) {
  return getNextServerSideProps(ctx, {
    Page,
  })
}

export default Page 