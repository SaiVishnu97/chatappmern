FROM node:latest AS frontend
WORKDIR /app
RUN npm install -g typescript
COPY frontend-typescript/package*.json .
RUN npm install
COPY frontend-typescript/. .
RUN npm run build

FROM node:latest AS backend
WORKDIR /app
ENV NODE_ENV=productiondocker
ENV BACKEND_URL=http://localhost:5000
ENV MONGO_URI=mongodb+srv://vishnu:Mongodbatlas@cluster0.4wbpkmt.mongodb.net/ChatAppDB
EXPOSE 5000
COPY backend-typescript/package*.json .
RUN npm install
COPY backend-typescript/. .
COPY --from=frontend /app/build ./frontendbuild
CMD [ "npm","run","start" ]

