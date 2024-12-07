import {NextApiRequest, NextApiResponse} from "next";

const stopContainer = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        // Send the request to the API.
        const response = await fetch('http://localhost:8080/api/v1/docker/remove', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        // Parse the response.
        const data = await response.json();
        console.log(data);
        res.status(200).json(data);

        /*// Return the response.
        if (data && data.length > 0) {
            res.status(200).json(data);
        } else {
            console.log(data.httpStatus);
            res.status(400).json(data);
        }*/

    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
};

export default stopContainer;
