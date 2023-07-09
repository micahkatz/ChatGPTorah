import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import RssFeed from "../components/RssFeed";
import Button from "../components/Button";
import Input from "../components/Input";
export default function Home() {
  const [rssArticleUrl, setRssArticleUrl] = useState("");
  const [customArticleUrl, setCustomArticleUrl] = useState("");
  const [articleText, setArticleText] = useState("");
  const [result, setResult] = useState<string>();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleUrl: customArticleUrl || rssArticleUrl, articleText }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setCustomArticleUrl("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  // ChatGPTorah
  return (
    <div>
      <Head>
        <title>Chat GPTorah</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h1 className='text-2xl font-bold'>ChatGPTorah</h1>
        <span className='mb-4'>Select an article</span>
        <div className='max-w-5xl flex flex-col items-center'>
          <RssFeed setArticleUrl={setRssArticleUrl} feedUrl="https://jewishunpacked.com/feed/" queryKey="jewishunpacked" />
          <div className={`${rssArticleUrl ? 'hidden' : ''} flex flex-col items-center`}>
            <Input
              type="text"
              name="link"
              placeholder="Give a link to an article"
              value={customArticleUrl}
              onChange={(e) => setCustomArticleUrl(e.target.value)}
              className="mb-2 min-w-[20rem]"
            />
            <p className='mb-2 text-sm self-center'>OR</p>
            <textarea
              name="link"
              placeholder="Insert Text from Article"
              value={articleText}
              onChange={(e) => setArticleText(e.target.value)}
              cols={8}
              className="min-w-[20rem] border-solid border-2 border-purple-400 rounded-md px-2 py-1 mb-2"
            />
          </div>
          <Button
            onClick={onSubmit}
            className='mb-2'>Generate Talmudic Interpretation</Button>

          <div className={styles.result}>{result && result?.split('\n').map(text => (
            <p>
              {text}
            </p>
          ))}</div>
        </div>
      </main>
    </div>
  );
}
