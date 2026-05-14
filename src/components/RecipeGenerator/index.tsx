import { useState } from "react";
import "./styles.css";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "@/utils/requests";
import ReactMarkdown from "react-markdown";

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState<string>("");
  const [cuisine, setCuisine] = useState<string>("Any");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [response, setResponse] = useState<string>("");

  const generateRecipe = async () => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/recipes/ask",
      withCredentials: false,
      method: "GET",
      params: {
        ingredients: ingredients,
        cuisine: cuisine,
        dietaryRestrictions: dietaryRestrictions,
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
      <div>Generate any recipes</div>

      <textarea
        className="ingredients-input"
        name="ingredients-input"
        id="ingredients-input"
        placeholder="Enter the ingredients (comma separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />

      <textarea
        className="cuisine-input"
        name="cuisine-input"
        id="cuisine-input"
        placeholder="Enter the cuisine"
        value={cuisine}
        onChange={(e) => setCuisine(e.target.value)}
      />

      <textarea
        className="dietary-restrictions-input"
        name="dietary-restrictions-input"
        id="dietary-restrictions-input"
        placeholder="Enter the dietary restrictions"
        value={dietaryRestrictions}
        onChange={(e) => setDietaryRestrictions(e.target.value)}
      />

      {loading ? "Carregando..." : <button onClick={() => generateRecipe()}>Generate</button>}

      {response && (
        <div className="chat-output">
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;
