import { Container } from "../ui";
import "./index.css";


export const Home = () => {
  return (

    <Container>

    <div class="ui container inverted vertical masthead center aligned segment teal">
      <div class="ui text container spacer">
        <h1 class="ui inverted header">
          West Oakland Air Quality Project
        </h1>
        <h2>Explore local air quality to understand the impact on you, your family, and your neighborhood.</h2>
        <div class="spacer-button"><a href="/maps" class="ui button test">Explore the map <i class="right arrow icon"></i></a></div>
      </div>
    </div>

    <div class="ui center aligned equal width grid">
      <div class="column">
        <div class="ui"></div>
      </div>
      <div class="eight wide column">
        <div class="ui">
          <div class="ui text-container about-container">
            <h2 className="ui header">Start collecting data yourself</h2>
            <p>
              Want to join our team of volunteer data collectors?
              <div class="spacer-button"><a href="/maps" class="ui button violet">Sign up for WOEIP's next training</a></div>
            </p>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="ui"></div>
      </div>
    </div>







    </Container>
  );
};
