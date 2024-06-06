
## Install
1. Install dependencies
```bash
npm install
```
2. Create and set up .env file
```bash
cp .env.example .env
```

## Run
```bash
npm start
```

## Test
```bash
npm test
```

## Docker
1. Build image
```bash
docker build -t frontend:v1.0 .
```

2. Run Docker container
```bash
docker run -p 3000:3000 frontend:v1.0
```

## Docker Compose
1. Build image
```bash
docker build -t frontend:v1.0 .
```

2. Run Docker container
```bash
docker compose up -d
```
