import {NextApiRequest, NextApiResponse} from "next";

const createContainer = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {
            // Formatted body to send to the API.
            const { ports, envVars } = req.body;

            // Validate the request body.
            const formattedBody = {
                containerName: req.body.name,
                image: req.body.imageName,
                ports: {
                    portMappings: ports.map((port: { hostPort: number; containerPort: number }) => {
                        if (!port.hostPort || !port.containerPort) {
                            throw new Error('Ports must have hostPort and containerPort.');
                        }
                        return {
                            hostPort: port.hostPort,
                            containerPort: port.containerPort,
                        };
                    }),
                },
                envs: {
                    variables: envVars.map((env: { name: string; value: string }) => {
                        if (!env.name || !env.value) {
                            throw new Error('Environment variables must have name and value.');
                        }
                        return {
                            key: env.name,
                            value: env.value,
                        };
                    }),
                },
            };

            // Debugging purposes.
            console.log('Formatted Body:', JSON.stringify(formattedBody, null, 2));

            // Send the request to the API.
            const response = await fetch('http://localhost:8080/api/v1/docker/create-container', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedBody)
            });

            // Parse the response.
            const data = await response.json();

            // Return the response.
            if (data && data.length > 0) {
                res.status(200).json(data);
            } else {
                res.status(400).json(data['error-codes']);
            }

        } catch (error: any) {
            console.error('Error processing request:', error.message);
            res.status(500).json({ error: error.message });
        }

    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
};

export default createContainer;
