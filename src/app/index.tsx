import Head from 'expo-router/head';

import App from '@/advanced-creation-studio';

// Stack.Screen's title sets the native header only; static web rendering picks
// up <head> from expo-router/head, which is what lands in the exported HTML.
export default function Index() {
  return (
    <>
      <Head>
        <title>Advanced Creation Studio</title>
        <meta
          name="description"
          content="Advanced Creation Studio delivers evidence-based reentry programs for federal and state partners — reducing recidivism through workforce development, case management, and holistic reintegration."
        />
      </Head>
      <App />
    </>
  );
}
