import { Container } from "../ui";
import "./index.css";

export const Home = () => {
  return (

    <Container>

    <div class="ui container inverted vertical masthead left aligned segment hero">
      <div class="ui text container spacer">
        <h1 class="ui inverted header">
          West Oakland Air Quality Project
        </h1>
        <h2>Explore local air quality to understand the impact on you, your family, and your neighborhood.</h2>
        <div class="spacer-button"><a href="/maps" class="ui button teal">Explore the map <i class="right arrow icon"></i></a></div>
      </div>
    </div>

    <div class="ui left aligned equal width grid">

      <div class="column">
        <div class="ui"></div>
      </div>

      <div class="eight wide column">
        <div class="ui">
          <div class="ui text-container about-container">
          <div class="ui small image"><img src="./WOEIP-mark-2020-transp-225x220px.png"/></div>
            <div>
            <h2 className="ui header">Start collecting data yourself</h2>
            <p>Want to join WOEIP's team of volunteer data collectors?</p>
            <p><div><a href="http://eepurl.com/hqw6RD" target="_blank" class="ui button">Sign up for volunteer opportunities &nbsp;<i class="external square alternate icon"></i></a></div></p>
            </div>
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
