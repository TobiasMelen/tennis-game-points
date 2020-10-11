import { createElement } from "react";
import { render } from "react-dom";
import App from "./components/App";
import "normalize.css";
import "./global.css";

render(
  createElement(App),
  document.getElementById("reactRoot")
);
