import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import RssFeed from "../components/RssFeed";
export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState<string>();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
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
          <RssFeed feedUrl="https://jewishunpacked.com/feed/" queryKey="jewishunpacked" />
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="animal"
              placeholder="Give a link to an article"
              value={animalInput}
              onChange={(e) => setAnimalInput(e.target.value)}
            />
            <input type="submit" value="Generate Talmudic Interpretation" />
          </form>
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
