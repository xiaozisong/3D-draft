
import { Render } from "./render";

export const engine = new Render();

export const useEngine = () => {
  return engine;
}