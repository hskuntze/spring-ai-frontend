export const API_URL = process.env.REACT_APP_API_URL as string;

if (!API_URL) {
  throw new Error("REACT_APP_API_URL não definida.");
}