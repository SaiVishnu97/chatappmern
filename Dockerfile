FROM node:20 AS frontend
WORKDIR /app
RUN npm install -g typescript
COPY frontend-typescript/package*.json .
RUN npm install
ENV REACT_APP_BACKENDURL=http://localhost:81
COPY frontend-typescript/. .
RUN npm run build

FROM node:20 AS backend
WORKDIR /app
ENV NODE_ENV=productiondocker
ENV BACKEND_URL=http://localhost:5002
ENV PORT=5002
EXPOSE 5000
COPY backend-typescript/package*.json .
RUN npm install
COPY backend-typescript/. .
COPY --from=frontend /app/build ./frontendbuild
ARG mongouri
ENV MONGO_URI=${mongouri}
CMD ["npm","run","start"]

