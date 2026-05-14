import { useState } from "react";
import "./styles.css";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "@/utils/requests";
import ReactMarkdown from "react-markdown";

const TalkWithAI = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const askAi = async () => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      method: "GET",
      withCredentials: false,
      url: "/chats/ask",
      params: {
        prompt: prompt,
      },
    };

    try {
      const data = (await requestBackend(requestParams)).data;
      setResponse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component">
      <div>Talk with an AI chat</div>

      <textarea
        className="prompt-input"
        name="chat-input"
        id="chat-input"
        placeholder="Enter a prompt to start talking with the AI"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {loading ? "Carregando..." : <button onClick={() => askAi()}>Ask</button>}

      {response && (
        <div className="chat-output">
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default TalkWithAI;