import {NextApiRequest, NextApiResponse} from "next";

const startContainer = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        console.log(req.body);
        const response = await fetch(`http://localhost:8080/api/v1/docker/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();

        if (data && data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(400).json(data['error-codes']);
        }

    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
};

export default startContainer;
