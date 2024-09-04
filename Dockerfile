FROM node:20-alpine AS frontend
WORKDIR /app
RUN npm install -g typescript
COPY frontend-typescript/package*.json .
RUN npm install
ENV REACT_APP_BACKENDURL=http://localhost:80
COPY frontend-typescript/. .
RUN npm run build

FROM node:20-alpine AS backend
WORKDIR /app
ENV NODE_ENV=productiondocker
ENV BACKEND_URL=http://localhost:5000
ENV PORT=5000
EXPOSE 5000
COPY backend-typescript/package*.json .
RUN npm install
COPY backend-typescript/. .
COPY --from=frontend /app/build ./frontendbuild
ARG mongouri
ENV MONGO_URI=${mongouri}

CMD [ "npm","run","start" ]

