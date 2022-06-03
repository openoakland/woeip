import { Container } from "../ui";
import "./index.css";

export const WestOaklandsAir = () => (
  <Container>
    {/*
      Page content goes here.
      React uses "JSX" to couple HTML and Javascript into one file https://reactjs.org/docs/introducing-jsx.html.
      As the about component is static content, it shouldn't need any of the JS-like features.
      For the HTML-like features, generally speaking all the html tags are the same.
      However, their attributes will take the form of how they would be selected from the DOM, rather than how they would be named in the tag.
      For example, "class" (https://www.w3schools.com/html/html_classes.asp) becomes "className" ("https://developer.mozilla.org/en-US/docs/Web/API/Element/className")
      Meanwhile, "for" (https://www.w3schools.com/html/html_form_attributes_form.asp) becomes ("https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor")
      */}
    <div class="ui container about-container">
      <h2 className="ui header">West Oakland's Air</h2>
      <p>
        If you live in West Oakland, you can often see the black soot cling to your window blinds. West Oakland residents endure the highest levels of diesel particulate matter (PM2.5) in the Bay Area. Freeways wrap the neighborhood, bringing a parade of high-emissions trucks to the Port of Oakland and other industrial sites that pepper the streets where people live. It’s a not-so-invisible killer—if you know what to look for.
      </p>
      <p>
        Neighborhoods near the Port of Oakland and Seventh Street experience nearly three times the cancer risk from local pollution sources compared to neighborhoods further away. Across West Oakland, people experience higher rates of asthma, cardiovascular disease, and premature death than other parts of Alameda County and the region.
      </p>
      <p>
        This didn’t happen by accident. It’s the direct result of decades of {" "}
        <a href="https://storymaps.arcgis.com/stories/0f58d49c566b486482b3e64e9e5f7ac9">
          redlining and racist zoning policies
        </a>{" "}. To undo it requires shifting the power back to those who live and breathe in West Oakland.
      </p>




      {" "}
      {/* close ui grid container */}
    </div>{" "}
    {/* close ui container about-container */}
    {/* Made the color red in the "./index.css" file, just to show how it's all linked up */}
  </Container>
);
