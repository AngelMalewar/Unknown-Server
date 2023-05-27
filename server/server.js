import express from "express";
import * as dotenv from "dotenv";
import cors from 'cors';
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
    organization: process.env.OPENAI_API_ORG,
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send({
        message: "Welcome to OpenAI API",
    });
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 4000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        // Remove specific lines and blocks of code from the response
        let botResponse = response.data.choices[0].text;
        botResponse = botResponse.replace("package com.example.demo.controller;", "")
            .replace("import java.util.List;", "")
            .replace("import org.springframework.beans.factory.annotation.Autowired;", "")
            .replace("import org.springframework.web.bind.annotation.*;", "")
            .replace("import com.example.demo.model.*;", "")
            .replace("import com.example.demo.*;", "")
            .replace("@RestController", "")
            .replace("@RequestMapping(path=\"/demo\")", "")
            .replace("public class MainController {", "")
            .replace("@Autowired", "")
            .replace("private UserRepository userRepository;", "")
            .replace("@GetMapping(path=\"/add\")", "")
            .replace("public @ResponseBody String addNewUser (@RequestParam String name, @RequestParam String email) {", "")
            .replace("User n = new User();", "")
            .replace("n.setName(name);", "")
            .replace("n.setEmail(email);", "")
            .replace("userRepository.save(n);", "")
            .replace("return \"Saved\";", "")
            .replace("@GetMapping(path=\"/all\")", "")
            .replace("public @ResponseBody Iterable<User> getAllUsers() {", "")
            .replace("public @ResponseBody Iterable<User> getAllUsers() {", "")
            .replace("return userRepository", "") + "  ";

        // Remove remaining comments
        botResponse = botResponse.replace(/\/\/.*(?:\r\n|\r|\n|$)/g, "");

        res.status(200).send({
            bot: botResponse
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
});

app.listen(5000, () => console.log("Server is running on port: http://localhost:5000"));
