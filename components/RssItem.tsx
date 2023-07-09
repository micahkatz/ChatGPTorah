import React from 'react'
import Parser from 'rss-parser'

type Props = {
    item: Parser.Item
    setSelectedArticle: React.Dispatch<React.SetStateAction<string>>
    selectedArticle: string | undefined
    renderArticleImg: (string) => React.ReactNode
}

const RssItem = (props: Props) => {
    const { item, selectedArticle, setSelectedArticle, renderArticleImg } = props
    return (
        <button
            className={`flex gap-4 items-center hover:scale-105 transition-all hover:bg-purple-100 hover:p-2 hover:rounded-md ${(selectedArticle === item.link) ? 'border-purple-500 bg-purple-200 border-solid border-4 p-2 rounded-md' : ''}`}
            key={`${item.guid}`}
            onClick={() => (selectedArticle === item.link) ? setSelectedArticle(undefined) : setSelectedArticle(item.link)}
        >
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
        </button>
    )
}

export default RssItem