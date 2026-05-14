import { useState } from "react";
import "./App.css";
import TalkWithAI from "./components/TalkWithAI";
import ImageGenerator from "./components/ImageGenerator";
import RecipeGenerator from "./components/RecipeGenerator";

function App() {
  const [activeTab, setActiveTab] = useState<"talk" | "recipes" | "images">();

  return (
    <div className="App">
      <div className="content">
        <button className={activeTab === "talk" ? "active" : ""} onClick={() => setActiveTab("talk")}>
          Talk with AI
        </button>
        <button className={activeTab === "recipes" ? "active" : ""} onClick={() => setActiveTab("recipes")}>
          Generate Recipes
        </button>
        <button className={activeTab === "images" ? "active" : ""} onClick={() => setActiveTab("images")}>
          Generate Images
        </button>

        <div className="active-tab">{activeTab === "talk" ? <TalkWithAI /> : activeTab === "images" ? <ImageGenerator /> : <RecipeGenerator />}</div>
      </div>
    </div>
  );
}

export default App;
