import { useState } from "react";
import "./styles.css";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "@/utils/requests";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [imageBase64List, setImageBase64List] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const toImageSrc = (base64: string) => {
    if (base64.startsWith("data:image")) {
      return base64;
    }

    return `data:image/png;base64,${base64}`;
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("Informe um prompt para gerar a imagem.");
      return;
    }

    setLoading(true);
    setError("");
    setImageBase64List([]);

    const requestParams: AxiosRequestConfig = {
      url: "/images/ask",
      withCredentials: false,
      method: "GET",
      params: {
        prompt: prompt,
      },
    };

    try {
      const data = (await requestBackend(requestParams)).data as string[];
      setImageBase64List(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível gerar as imagens. Verifique o console e os logs do backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component">
      <div>Generate any images</div>

      <textarea
        className="image-input"
        name="image-input"
        id="image-input"
        placeholder="Enter a prompt to generate an image"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {error && <div className="image-error">{error}</div>}

      <button disabled={loading || !prompt.trim()} onClick={() => generateImage()}>
        {loading ? "Carregando..." : "Generate"}
      </button>

      <div className="image-grid">
        {imageBase64List.map((imageBase64, index) => (
          <img key={index} src={toImageSrc(imageBase64)} alt={`img-${index}`} />
        ))}

        {[...Array(Math.max(0, 4 - imageBase64List.length))].map((_, index) => (
          <div key={index + imageBase64List.length} className="empty-image-slot" />
        ))}
      </div>
    </div>
  );
};

export default ImageGenerator;