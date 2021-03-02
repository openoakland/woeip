FROM jwilder/nginx-proxy
ARG API_DOMAIN
COPY cors.conf /etc/nginx/vhost.d/$API_DOMAIN
COPY api_static_assets_routing /etc/nginx/vhost.d/${API_DOMAIN}_location