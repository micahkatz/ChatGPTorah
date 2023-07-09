import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const rssUrl = req.query.rssUrl as string

        const rssData = await fetch(rssUrl)

        res.status(200).send(await rssData.text())
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }


}