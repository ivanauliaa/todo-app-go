FROM golang:1.16-alpine

RUN mkdir app

WORKDIR /app

COPY ./ ./

EXPOSE 5000

CMD ["go", "run", "./backend/main.go"]