# stage 1
# ARG REALM
FROM node:latest as proh2radmin
RUN apk update && apk add --no-cache make git
WORKDIR /app
COPY proh2radmin/package*.json  /app/
RUN npm install npm@6.4.1
RUN npm install -g @angular/cli@6.2.9 -g && npm ci
RUN npm install node-sass
COPY proh2radmin  /app
EXPOSE 4201

CMD ng serve --port 4201 --host 0.0.0.0 --disable-host-check

# stage 2
# FROM nginx:alpine
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=node /proh2radmin/dist/* /usr/share/nginx/html/$REALM/

# EXPOSE 90

# FROM node:alpine as microservice-two

# RUN apk update && apk add --no-cache make git

# WORKDIR /app

# COPY microservice-two/package*.json  /app/

# RUN npm install @angular/cli@6.0.8 -g \
#     && npm ci

# COPY microservice-two  /app

# EXPOSE 4201

# CMD ng serve --port 4201 --host 0.0.0.0 --disable-host-check
