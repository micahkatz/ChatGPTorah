import Head from 'next/head';
import { useState } from 'react';
import styles from './index.module.css';
import RssFeed from '../components/RssFeed';
import Button from '../components/Button';
import Input from '../components/Input';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import Parser from 'rss-parser';
import RssItem from '../components/RssItem';
import Link from 'next/link';
export default function Home() {
  const [rssArticle, setRssArticle] = useState<Parser.Item>();
  const [customArticleUrl, setCustomArticleUrl] = useState('');
  const [articleText, setArticleText] = useState('');

  const generateInterpretationMutation = useMutation({
    mutationKey: ['generateInterpretation'],
    mutationFn: generateInterpretation,
  });
  const { data: resultData } = generateInterpretationMutation;

  async function generateInterpretation(): Promise<
    AxiosResponse<GenerateResponse>
  > {
    return axios.post('/api/generate', {
      articleUrl: rssArticle?.link || customArticleUrl,
      articleText,
    });
  }
  // ChatGPTorah
  return (
    <div>
      <Head>
        <title>Chat GPTorah</title>
        <link rel='icon' href='/favicon.png' />
      </Head>

      <main className={styles.main}>
        <h1 className='text-2xl font-bold'>ChatGPTorah</h1>
        {generateInterpretationMutation.isIdle && (
          <span className='mb-4'>Select an article</span>
        )}
        <div className='max-w-5xl flex flex-col items-center pb-12'>
          {generateInterpretationMutation.isLoading && (
            <div className="custom-loader mt-8"></div>
          )}
          {generateInterpretationMutation.isError && (
            <>
              <p className='text-red-500'>
                {generateInterpretationMutation.error instanceof
                  Error
                  ? generateInterpretationMutation.error
                    .message
                  : 'An error occurred'}
              </p>
              <Button
                className='mt-4'
                onClick={() =>
                  generateInterpretationMutation.reset()
                }
              >
                Try Again
              </Button>
            </>
          )}
          {generateInterpretationMutation.isSuccess &&
            resultData.data.result && (
              <div className='mt-10 max-w-xl'>
                {rssArticle && (
                  <RssItem
                    item={rssArticle}
                    notInteractive
                  />
                )}
                {articleText && (
                  <>
                    <textarea value={articleText} className='rounded-md border-solid border-2 border-purple-500 bg-purple-100 p-2 w-full' cols={8} />
                  </>
                )}
                {customArticleUrl && (
                  <div className='rounded-md border-solid bg-purple-100 p-2'>
                    <Link className='text-purple-500 hover: underline' href={customArticleUrl} target='_blank'>{customArticleUrl}</Link>
                  </div>
                )}
                <div className='mt-8'>

                  {resultData.data.result
                    .split('\n')
                    .map((text) => (
                      <p className='mb-4'>{text}</p>
                    ))}
                </div>

              </div>
            )}
          {generateInterpretationMutation.isIdle && (
            <>
              <RssFeed
                setRssArticle={setRssArticle}
                feedUrl='https://jewishunpacked.com/feed/'
                queryKey='jewishunpacked'
              />
              <div
                className={`${rssArticle ? 'hidden' : ''
                  } flex flex-col items-center`}
              >
                <Input
                  type='text'
                  name='link'
                  placeholder='Give a link to an article'
                  value={customArticleUrl}
                  onChange={(e) => {
                    setCustomArticleUrl(e.target.value);
                    setArticleText('');
                  }}
                  className='mb-2 min-w-[20rem]'
                />
                <p className='mb-2 text-sm self-center'>OR</p>
                <textarea
                  name='link'
                  placeholder='Insert Text from Article'
                  value={articleText}
                  onChange={(e) => {
                    setArticleText(e.target.value);
                    setCustomArticleUrl('');
                  }}
                  cols={8}
                  className='min-w-[20rem] border-solid border-2 border-purple-400 rounded-md px-2 py-1 mb-2'
                />
              </div>
            </>
          )}
          <div className='fixed bottom-0 w-screen p-2 bg-white flex justify-center'>
            <div className='relative'>
              <div className='w-full h-full bg-white absolute -z-50' />
              {generateInterpretationMutation.isIdle ? (
                <Button
                  onClick={() =>
                    generateInterpretationMutation.mutate()
                  }
                  disabled={
                    !customArticleUrl &&
                    !rssArticle &&
                    !articleText
                  }
                  className='disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Generate Talmudic Interpretation
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    generateInterpretationMutation.reset()
                  }
                >
                  Try Another Article
                </Button>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
