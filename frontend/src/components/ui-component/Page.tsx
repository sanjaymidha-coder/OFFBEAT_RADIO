import { forwardRef, ReactNode, Ref } from 'react';
import Head from 'next/head';

// material-ui
import Box, { BoxProps } from '@mui/material/Box';

// ==============================|| Page - SET TITLE & META TAGS ||============================== //

interface Props extends BoxProps {
  children: ReactNode;
  meta?: ReactNode;
  title: string;
}

const Page = forwardRef<HTMLDivElement, Props>(({ children, title = '', meta, ...other }: Props, ref: Ref<HTMLDivElement>) => (
  <>
    <Head>
      <title>{`${title} | Berry - React Material Admin Dashboard Template`}</title>
      <meta name="description" content="Checkout our cool page" key="desc" />
      <meta property="og:title" content="Social Title for Cool Page" />
      <meta property="og:description" content="And a social description for our cool page" />
      <meta property="og:image" content="https://example.com/images/cool-page.jpg" />
      {meta}
    </Head>

    <Box ref={ref} {...other}>
      {children}
    </Box>
  </>
));

export default Page;
