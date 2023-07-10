import React from 'react'
import Parser from 'rss-parser'
import cheerio from 'cheerio';
import Link from 'next/link';

type Props = {
    item: Parser.Item
} & ({
    notInteractive?: false
    setSelectedArticle: React.Dispatch<React.SetStateAction<Parser.Item>>
    selectedArticle: Parser.Item | undefined
} | {
    notInteractive: true
})

const RssItem = (props: Props) => {
    const { item } = props
    const WORDS_IN_DESC = 15

    const renderArticleImg = (innerHtml: string) => {
        const $ = cheerio.load(innerHtml);

        const imgSrc = $('img').attr('src');

        return (
            <img
                src={imgSrc}
                alt='image'
                className='h-[8rem] w-[8rem] md:h-[14rem] md:w-[14rem] !m-0 !p-0 !rounded-md object-cover'
            />
        );
    };

    const renderInnerContent = () => (
        <>
            {renderArticleImg(item.content)}
            <div>
                <Link className='text-lg font-semibold mb-2 hover:underline' href={props.item?.link} target='_blank'>
                    {item.title}
                </Link>
                <p className='max-sm:hidden'>
                    {item.contentSnippet.split(' ').length > WORDS_IN_DESC
                        ? item.contentSnippet.split(' ').slice(0, WORDS_IN_DESC).join(' ') + '...'
                        : item.contentSnippet}
                </p>
            </div >
        </>
    )
    if (props?.notInteractive !== true) {
        return (
            <button
                className={`flex gap-4 items-center hover:scale-105 transition-all hover:bg-purple-100 hover:p-2 hover:rounded-md ${(props.selectedArticle?.link === item.link) ? 'border-purple-500 bg-purple-200 border-solid border-4 p-2 rounded-md' : ''}`}
                key={`${item.guid}`}
                onClick={() => (props.selectedArticle?.link === item.link) ? props.setSelectedArticle(undefined) : props.setSelectedArticle(item)}
                disabled={props?.notInteractive}
            >
                {renderInnerContent()}
            </button>
        )
    }
    return (
        <button
            className={`flex gap-4 items-center`}
            key={`${item.guid}`}
            disabled
        >
            {renderInnerContent()}
        </button>
    )
}

export default RssItem