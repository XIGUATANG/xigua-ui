FROM nginx
COPY dist/ /usr/app/xigua_ui/
COPY nginx.conf /etc/nginx/conf.d/default.conf