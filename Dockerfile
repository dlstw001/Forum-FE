FROM node:13.12.0-alpine as build
COPY . .
RUN yarn
RUN yarn build:dev
# production environment
FROM nginx:stable-alpine
COPY build/ /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]