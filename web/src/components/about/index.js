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
    <div class="ui container about-container">
      <h2 className="ui header">About WOAQ</h2>

      <p>
        West Oakland Air Quality (WOAQ) helps West Oaklanders like you
        understand your local air quality and fight for cleaner air.
      </p>
      <p>
        WOAQ is a project of <a href="https://openoakland.org">OpenOakland</a>,
        a volunteer-led brigade of the nonprofit Code for America, and the{" "}
        <a href="https://woeip.org">
          West Oakland Environmental Indicators Project
        </a>{" "}
        (WOEIP), a community-based environmental justice organization that uses
        participatory research to achieve healthy neighborhoods for all who
        live, work, learn and play in West Oakland, California.
      </p>
      <p>
        Designed to power WOEIP’s citizen science program, WOAQ helps you
        visualize the neighborhood air quality data collected by you and your
        neighbors, explore the environmental issues that directly impact your
        health and well-being, and reclaim the air you breathe every day.
      </p>

      <h3 className="ui header">Tools for the community</h3>

      <p>
        For decades, the West Oakland Environmental Indicators Project, a
        community-led nonprofit, has led a groundbreaking process of{" "}
        <a href="https://woeip.org/our-approach/">
          participatory research and collaborative problem-solving
        </a>{" "}
        to reclaim and clean up the neighborhood’s air. Equipping residents of
        all ages with mobile air sensors, WOEIP staff and volunteers took to the
        streets to record what people intuitively sensed: that all air is not
        equal.
      </p>
      <p>
        WOEIP partnered with INTEL to create a citizen science program that
        helped community members understand the science behind air pollution and
        how to use data to advocate for real-world, systems-level change. This
        work served as the foundation of research that has led to one of the
        most community-rooted air pollution mitigation plans in the country,{" "}
        <i>
          <a href="https://woeip.org/featured-work/owning-our-air/">
            Owning Our Air
          </a>
        </i>
        .
      </p>
      <p>
        But when the initial funding ran out, WOEIP’s air quality database
        disappeared with it.
      </p>
      <p>
        The West Oakland Air Quality project re-envisions that original platform
        so WOEIP can empower another generation of residents to continue this
        critical work.
      </p>

      <h3 className="ui header">Acknowledgments</h3>

      <p>
        WOAQ is the result of years of hard work and contributions by many, many
        people. We’re thankful for and inspired by those who have contributed
        both directly and indirectly through code, design, expertise, research,
        and advocacy. We’re especially grateful for the many WOEIP volunteers
        who spent hours collecting air quality data in West Oakland.
      </p>

      <div class="ui grid container">

        <div class="three wide column">
          <h4 className="ui header">Core team</h4>
          <div class="ui bulleted list">
            <div class="item">Brian Beveridge</div>
            <div class="item">Angela Kwon</div>
            <div class="item">Tim Miller</div>
            <div class="item">Jess Sand</div>
            <div class="item">Niels Thorsen</div>
            <div class="item">Alana Tran</div>
            <div class="item">Wendy Wu</div>
          </div>
        </div>

        <div class="three wide column">
          <h4 className="ui header">Additional contributors</h4>
          <div class="ui bulleted list">
            <div class="item">Ife Ajiboye</div>
            <div class="item">Natalia Bilenko</div>
            <div class="item">Clinton Blackburn</div>
            <div class="item">Ethan Bradley</div>
            <div class="item">Robert Gibboni</div>
            <div class="item">Kabirdas Henry</div>
            <div class="item">Brooks Jessup</div>
            <div class="item">Attila Kovács</div>
            <div class="item">Joshua Ling</div>
            <div class="item">Kimberly Low</div>
            <div class="item">Jonathan Mitchell</div>
            <div class="item">Luke Travis</div>
            <div class="item">Jay Qi</div>
            <div class="item">Robert Soden</div>
            <div class="item">Ki Song</div>
          </div>
        </div>

        <div class="three wide column">
          <h4 className="ui header">Foundational inspiration and expertise</h4>
          <div class="ui bulleted list">
            <div class="item">Ms. Margaret Gordon and Brian Beveridge</div>
            <div class="item">The INTEL and UCB development team</div>
            <div class="item">
              The many students, residents, and other volunteers who took to the
              streets to collect air quality data over the years
            </div>
            <div class="item">
              The civil servants and experts at BAAQMD, CARB, and the City of
              Oakland who continue to move the{" "}
              <i>
                <a href="https://woeip.org/featured-work/owning-our-air/">
                  Owning Our Air
                </a>
              </i>{" "}
              initiative forward
            </div>
          </div>
        </div>

        <p>If you've contributed to WOAQ and would like to have your name listed here (or removed), please email woaq@openoakland.org (<a href="mailto:woaq@openoakland.org">send email</a>).</p>

      </div> {/* close ui grid container */}
    </div> {/* close ui container about-container */}

    {/* Made the color red in the "./index.css" file, just to show how it's all linked up */}
  </Container>
);
