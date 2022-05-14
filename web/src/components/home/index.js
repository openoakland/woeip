import { Container } from "../ui";
import "./index.css";
import woeipLogo from "./WOEIP-mark-2020-transp-225x220px.png";

export const Home = () => {
  return (

<Container>
    <div class="ui container inverted vertical masthead left aligned segment hero">
      <div class="ui text container spacer">
        <h1 class="ui inverted header">West Oakland Air Quality Project</h1>
        <h2>Explore local air quality to understand the impact on you, your family, and your neighborhood.</h2>
        <div class="spacer-button"><a href="/maps" class="ui button teal">Explore the map <i class="right arrow icon"></i></a></div>
      </div>
    </div>

    <div class="ui grid">

      <div class="eight wide computer twelve wide tablet sixteen wide mobile centered column">
          <div class="ui text-container about-container">
              <h2 className="ui header">Start collecting data yourself</h2>
              <p>Want to join WOEIP's team of volunteer data collectors?</p>
              <p><img class="ui mini image left floated" src={ woeipLogo } alt="WOEIP weathervane logo"/><a href="http://eepurl.com/hqw6RD" target="_blank" class="ui button">Learn about volunteer opportunities &nbsp;<i class="external square alternate icon"></i></a></p>
          </div>
      </div>

    </div>

</Container>
  );
};
