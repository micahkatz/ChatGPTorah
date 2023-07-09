import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { convert as convertHtml } from 'html-to-text'
import cheerio from 'cheerio'
import axios from "axios";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface SefariaCalendarResponse {
  date: Date;
  timezone: string;
  calendar_items: CalendarItem[];
}

interface CalendarItem {
  title: Description;
  displayValue: Description;
  url: string;
  ref?: string;
  heRef?: string;
  order: number;
  category: string;
  extraDetails?: ExtraDetails;
  description?: Description;
}

interface Description {
  en: string;
  he: string;
}

interface ExtraDetails {
  aliyot: string[];
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured",
      }
    });
    return;
  }

  const articleUrl: string = req.body?.articleUrl || '';
  var articleText: string = req.body?.articleText || '';
  if (articleUrl && articleUrl?.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid articleUrl",
      }
    });
    return;
  }
  if (articleText && articleText?.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid articleUrl",
      }
    });
    return;
  }

  try {
    if (!articleText) {
      const articleHTML = await (await fetch(articleUrl)).text()
      const $ = cheerio.load(articleHTML);
      articleText = convertHtml($('article').html())
    }

    const { data: sefariaResponse }: { data: SefariaCalendarResponse } = await axios.get('http://www.sefaria.org/api/calendars')
    const torahPortion = sefariaResponse['calendar_items'][0].displayValue.en

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: generatePrompt({ articleText, torahPortion }) }],
      temperature: 0.6,
    });
    const result = completion.data.choices[0].message

    console.log({ result })
    res.status(200).json({ result: result.content });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt({ torahPortion, articleText }: { torahPortion: string, articleText: string }) {

  return `Act as a talmudic scholar. Explain this article in the context of the talmud.
  Relate this to the current torah portion as well. The current torah portion is ${torahPortion}
Here is the article: ${articleText}`.substring(0, 4096)
}
