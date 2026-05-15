import { ChangeEvent, MouseEvent, useState } from "react";
import "./styles.css";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "@/utils/requests";

const AudioUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files !== undefined) {
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);
    } else {
      console.log("No file detected.", e.target.files);
    }
  };

  const handleUpload = async (e: MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    const formData = new FormData();

    if (file !== null) {
      formData.append("file", file);
    }

    const requestParams: AxiosRequestConfig = {
      url: "/transcriptions/file",
      method: "POST",
      withCredentials: false,
      data: formData,
    };

    try {
      const data = (await requestBackend(requestParams)).data;
      setTranscription(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component">
      <div>Transcribe a audio file</div>

      <div className="file-input-container">
        <input type="file" accept="audio/*" onChange={handleFileChange} />
      </div>

      {loading ? (
        "Carregando..."
      ) : (
        <button className="upload-button" onClick={handleUpload}>
          Transcribe
        </button>
      )}

      <div className="file-output-container">
        <h2>Result</h2>
        <p>{transcription}</p>
      </div>
    </div>
  );
};

export default AudioUploader;
