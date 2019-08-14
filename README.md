West Oakland Air Quality Project (WOAQ) [![TravisCI](https://travis-ci.org/openoakland/woeip.svg?branch=master)](https://travis-ci.org/openoakland/woeip) [![Codecov](https://codecov.io/gh/openoakland/woeip/branch/master/graph/badge.svg)](https://codecov.io/gh/openoakland/woeip)
===========================================================================

West Oakland Air Quality (WOAQ) is a project of [OpenOakland](https://www.openoakland.org/) focused on building digital advocacy tools around air quality data collected by volunteers and citizen scientists.

WOAQ partners with [West Oakland Environmental Indicators Project](https://www.woeip.org) (WOEIP), a community-based environmental justice organization that has been collecting air quality data for over a decade. WOEIP is dedicated to achieving healthy homes, healthy jobs and healthy neighborhoods for all who live, work, learn and play in West Oakland, California.

To learn more about the history of WOEIP, the roadmap for this project and more, check out the [About](https://github.com/openoakland/woeip/blob/master/.github/about.md) section.

# Quickstart

Run the woaq infrastructure with [Docker Compose](https://docs.docker.com/compose/)

```bash
  git clone https://github.com/openoakland/woeip.git
  cd woeip
  docker-compose up -d --build
```

Browse the client at [lvh.me](http://lvh.me), ping the api at [api.lvh.me](http://api.lvh.me) or explore data visualizations at [dataviz.lvh.me](http://dataviz.lvh.me)

# Services

- woaq-proxy: [nginx-proxy](https://github.com/jwilder/nginx-proxy), [ssl-autogen](https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion)
 
- woaq-web:
[typescript](https://www.typescriptlang.org/), [react](https://reactjs.org/), [razzle](https://github.com/jaredpalmer/razzle), [zurb](https://react.foundation/)

- woaq-dataviz: [holoviews](http://holoviews.org/), [jupyter](https://jupyter.org/)

- woaq-api: [python](https://www.python.org/), [django-rest-framework](https://www.django-rest-framework.org/)

- woaq-db: [postgis](https://postgis.net/)

# Contributing

See the [Contributing](https://github.com/openoakland/woeip/blob/master/.github/contributing.md) section.


# Contact

- Email: [woaq@openoakland.org](mailto:woaq@openoakland.org)
- Slack: [#WOAQ channel](https://openoakland.slack.com/) (complete [this form](https://docs.google.com/forms/d/e/1FAIpQLSee_qdE0qCmhufJC94MmSRVDLPAhhFJO4QMzuC31Kh0lxI_Mg/viewform) for access)
- In person: Join us [Tuesday evenings at Oakland City Hall](https://www.meetup.com/OpenOakland/).

Reporting security issues
-------------------------
Please do not report security issues in public. Instead, send an email to the WOAQ team at [woaq@openoakland.org](mailto:woaq@openoakland.org). Or reach out via the [#woaq Slack channel](https://openoakland.slack.com/) (complete [this form](https://docs.google.com/forms/d/e/1FAIpQLSee_qdE0qCmhufJC94MmSRVDLPAhhFJO4QMzuC31Kh0lxI_Mg/viewform) for access).

# License

[MIT](https://github.com/openoakland/woeip/blob/master/LICENSE)