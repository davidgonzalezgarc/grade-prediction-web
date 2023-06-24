FROM node:18-alpine

RUN addgroup app && adduser -S -G app app
RUN mkdir /app && chown app:app /app
USER app
WORKDIR /app

COPY --chown=app:app . .
RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]