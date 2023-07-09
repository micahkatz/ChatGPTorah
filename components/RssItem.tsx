import React from 'react'
import Parser from 'rss-parser'
import cheerio from 'cheerio';

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

    const renderInnerContent = () => (
        <>
            {renderArticleImg(item.content)}
            <div >
                <p className='text-lg font-semibold mb-2'>
                    {item.title}
                </p>
                <p>
                    {item.contentSnippet.length > 100
                        ? item.contentSnippet.slice(0, 100) + '...'
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