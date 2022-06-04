import { Container } from "../ui";
import "./index.css";
import trucks from "./West-Oakland-trucks.png";

export const WestOaklandsAir = () => (
  <Container>
    <div class="ui container about-container">
      <h2 className="ui header">West Oakland's Air</h2>
      <p>
        If you live in West Oakland, you can often see the black soot cling to
        your window blinds. West Oakland residents endure the highest levels of
        diesel particulate matter (PM2.5) in the Bay Area. Freeways wrap the
        neighborhood, bringing a parade of high-emissions trucks to the Port of
        Oakland and other industrial sites that pepper the streets where people
        live. It’s a not-so-invisible killer—if you know what to look for.
      </p>
      <p>
        Neighborhoods near the Port of Oakland and Seventh Street experience
        nearly three times the cancer risk from local pollution sources compared
        to neighborhoods further away. Across West Oakland, people experience
        higher rates of asthma, cardiovascular disease, and premature death than
        other parts of Alameda County and the region.
      </p>
      <p>
        <img
          class="ui fluid image"
          src={trucks}
          alt="Two cargo trucks cross paths on a residential street"
        />
      </p>
      <p>
        This didn’t happen by accident. It’s the direct result of decades of{" "}
        <a href="https://storymaps.arcgis.com/stories/0f58d49c566b486482b3e64e9e5f7ac9">
          redlining and racist zoning policies
        </a>
        . To undo it requires shifting the power back to those who live and
        breathe in West Oakland.
      </p>
      <p>
        <div className="ui button violet huge woa-button">
          <a href="/about" className="woa-button">
            Shifting power
          </a>
        </div>
        <div className="ui button violet huge woa-button">
          <a href="/maps" className="woa-button">
            Explore the map
          </a>
        </div>
      </p>
    </div>
  </Container>
);
