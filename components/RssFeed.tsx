import React from 'react';
import Parser from 'rss-parser';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import cheerio from 'cheerio';
import Link from 'next/link';
type CustomItem = { 'media:content': string };

const parser: Parser<{}, CustomItem> = new Parser({
    customFields: {
        item: ['media:content'],
    },
});

type Props = {
    feedUrl: string;
    queryKey: string;
};

const RssFeed = (props: Props) => {
    const {
        status: feedStatus,
        data: articleRssFeed,
        error: feedError,
    } = useQuery({ queryKey: [props.queryKey], queryFn: fetchArticlesRssFeed });

    async function fetchArticlesRssFeed() {
        const rssFeed = await parser.parseURL(
            `/api/articles/?rssUrl=${encodeURIComponent(props.feedUrl)}`
        );

        console.log({ rssFeed });

        return rssFeed;
    }

    if (feedStatus === 'loading') {
        return <span>Loading...</span>;
    }
    if (feedStatus === 'error') {
        return <span>There was an error fetching the feed</span>;
    }

    const renderArticleImg = (innerHtml: string) => {
        const $ = cheerio.load(innerHtml);

        const imgSrc = $('img').attr('src');

        return (
            <img
                src={imgSrc}
                alt='image'
                className='!h-[14rem] !w-[14rem] !m-0 !p-0 !rounded-md object-cover'
            />
        );
    };

    return (
        <section className='mb-2'>
            <h3 className='text-xl mb-4'>
                Articles From <Link href='https://jewishunpacked.com/' className='text-blue-500 hover:text-blue-800'>JewishUnpacked</Link>
            </h3>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {articleRssFeed?.items.map((item) => (
                    <div className='flex gap-4 items-center'>
                        {/* <div className='rssFeedItem' dangerouslySetInnerHTML={{ __html: item.content }} /> */}
                        {renderArticleImg(item.content)}
                        <div>
                            <p className='text-lg font-semibold mb-2'>
                                {item.title}
                            </p>
                            <p>
                                {item.contentSnippet.length > 100
                                    ? item.contentSnippet.slice(0, 100) + '...'
                                    : item.contentSnippet}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <button className='un'></button>
        </section>
    );
};

export default RssFeed;
