import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { Dispatch, SetStateAction } from 'react';
import Parser from 'rss-parser';
import Button from './Button';
import RssItem from './RssItem';
type CustomItem = { 'media:content': string };

const parser: Parser = new Parser();

type Props = {
    feedUrl: string;
    queryKey: string;
    setRssArticle: Dispatch<SetStateAction<Parser.Item>>
};

const RssFeed = (props: Props) => {
    const {
        status: feedStatus,
        data: articleRssFeed,
        error: feedError,
    } = useQuery({ queryKey: [props.queryKey], queryFn: fetchArticlesRssFeed });

    const [page, setPage] = React.useState(0)
    const [selectedArticle, setSelectedArticle] = React.useState<Parser.Item>()

    React.useEffect(() => {
        props.setRssArticle(selectedArticle)
    }, [selectedArticle])

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


    const loadMoreArticles = () => setPage(prevPage => prevPage + 1);
    const PAGE_COUNT = 4

    return (
        <section className='mb-4 flex flex-col items-center'>
            <h3 className='text-xl mb-4 self-start'>
                Articles From <Link href='https://jewishunpacked.com/' className='text-blue-500 hover:text-blue-800'>JewishUnpacked</Link>
            </h3>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4'>
                {articleRssFeed?.items.slice(0, (page * PAGE_COUNT + PAGE_COUNT)).map((item) => (
                    <RssItem
                        key={item.guid}
                        item={item}
                        setSelectedArticle={setSelectedArticle}
                        selectedArticle={selectedArticle}
                    />
                ))}
            </div>
            <Button
                onClick={loadMoreArticles}
                disabled={(page * PAGE_COUNT + PAGE_COUNT) >= articleRssFeed?.items.length}
                className='mb-2 bg-purple-100 hover:bg-purple-200 text-purple-500 disabled:hidden'>Load More</Button>
        </section>
    );
};

export default RssFeed;
