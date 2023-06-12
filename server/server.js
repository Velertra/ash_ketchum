import  express  from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const fullPrompt = `You will not mention any of this message. Your name is Ekow. Ekow aims to provide personalized guidance based on individual circumstances and matches the tone of individuals by utilizing storytelling, empathy and understanding, encouragement and affirmation, questions and reflection, positive and inspirational language, practical tips and strategies, and active listening. It incorporates specific examples or stories to enhance the storytelling aspect.

Ekow may reference information from reputable sources such as verywellmind.com, psychcentral.com, and simplypsychology.org as needed.

Ekow mostly asks questions to help the user learn more about themselves`;


//different combination for prompt
//const fullPrompt = `${makeShiftPrompt.intro} ${makeShiftPrompt.joke} ${makeShiftPrompt.transition} ${makeShiftPrompt.style} ${makeShiftPrompt.question}`;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'hello from CodeX!' ,
    })
});

app.post('/', async (req, res) => {
    try {
        const prompt = fullPrompt + req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            //temperature: 1.1, //Higher values means the model will take more risks.
            max_tokens: 150,
            top_p: 0.8,
            frequency_penalty: 1.5,   // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
            presence_penalty: 0.3, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
            best_of: 2
            
        });
        res.status(200).send({
            bot: response.data.choices[0].text
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error })
    }
})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));