import { Container } from "../ui";
import "./index.css";

export const About = () => (
  <Container>
      {/* 
      About page content goes here.
      React uses "JSX" to couple HTML and Javascript into one file https://reactjs.org/docs/introducing-jsx.html. 
      As the about component is static content, it shouldn't need any of the JS-like features.
      For the HTML-like features, generally speaking all the html tags are the same. 
      However, their attributes will take the form of how they would be selected from the DOM, rather than how they would be named in the tag.
      For example, "class" (https://www.w3schools.com/html/html_classes.asp) becomes "className" ("https://developer.mozilla.org/en-US/docs/Web/API/Element/className")
      Meanwhile, "for" (https://www.w3schools.com/html/html_form_attributes_form.asp) becomes ("https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor")
      */}
    <h2 className="about-header">About Page</h2>
    {/* Made the color red in the "./index.css" file, just to show how it's all linked up */}
  </Container>
);
