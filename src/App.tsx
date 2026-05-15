import { useState } from "react";
import "./App.css";
import TalkWithAI from "./components/TalkWithAI";
import ImageGenerator from "./components/ImageGenerator";
import RecipeGenerator from "./components/RecipeGenerator";
import AudioUploader from "./components/AudioUploader";
import RealtimeTranscription from "./components/RealtimeTranscription";

function App() {
  const [activeTab, setActiveTab] = useState<"talk" | "recipes" | "images" | "transcribe" | "realtime">("talk");

  return (
    <div className="App">
      <div className="app-shell">
        <header className="hero">
          <div>
            <span className="eyebrow">Spring AI + OpenAI</span>
            <h1>AI Demo Lab</h1>
            <p>Um projeto de demonstração para conversar com IA, gerar receitas, criar imagens e transcrever áudio.</p>
          </div>

          <div className="hero-badge">
            <i className="bi bi-stars" />
            Demo
          </div>
        </header>

        <main className="content">
          <nav className="tabs">
            <button className={activeTab === "talk" ? "active" : ""} onClick={() => setActiveTab("talk")}>
              <i className="bi bi-chat-dots" />
              Chat
            </button>

            <button className={activeTab === "recipes" ? "active" : ""} onClick={() => setActiveTab("recipes")}>
              <i className="bi bi-journal-text" />
              Receitas
            </button>

            <button className={activeTab === "images" ? "active" : ""} onClick={() => setActiveTab("images")}>
              <i className="bi bi-image" />
              Imagens
            </button>

            <button className={activeTab === "transcribe" ? "active" : ""} onClick={() => setActiveTab("transcribe")}>
              <i className="bi bi-file-earmark-music" />
              Arquivo de áudio
            </button>

            <button className={activeTab === "realtime" ? "active" : ""} onClick={() => setActiveTab("realtime")}>
              <i className="bi bi-broadcast" />
              Tempo real
            </button>
          </nav>

          <section className="active-tab">
            {activeTab === "talk" && <TalkWithAI />}
            {activeTab === "recipes" && <RecipeGenerator />}
            {activeTab === "images" && <ImageGenerator />}
            {activeTab === "transcribe" && <AudioUploader />}
            {activeTab === "realtime" && <RealtimeTranscription />}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
