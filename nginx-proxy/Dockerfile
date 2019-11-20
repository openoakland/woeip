FROM jwilder/nginx-proxy
ARG API_DOMAIN
COPY cors.conf /etc/nginx/vhost.d/$API_DOMAIN
COPY api_location /etc/nginx/vhost.d/${API_DOMAIN}_location
