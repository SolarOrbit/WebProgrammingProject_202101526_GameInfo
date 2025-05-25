# frontend/gameinfo/Dockerfile

# --- Build Stage ---
# 1. Node.js 환경에서 프로젝트를 빌드합니다.
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 전역 ARG로 선언된 값들을 이 스테이지에서 사용할 수 있도록 다시 선언합니다.
# (주의: Dockerfile 최상단에도 동일한 ARG 선언이 있어야 --build-arg가 인식됩니다.
#  만약 최상단에 없다면 여기에만 선언해도 되지만, --build-arg는 첫 번째 FROM 이전에 선언된 ARG에 주로 바인딩됩니다.)
# 가장 확실한 방법은 Dockerfile 최상단과 사용하는 스테이지 양쪽에 ARG 선언을 두는 것입니다.
ARG VITE_RAWG_API_KEY
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

# 의존성 설치를 위해 package.json과 lock 파일만 먼저 복사합니다.
COPY package.json ./
COPY package-lock.json ./ 

RUN npm ci
# RUN yarn install --frozen-lockfile # yarn 사용 시

# 프로젝트 전체 소스 코드 복사 (또는 필요한 파일만 명시적 복사)
COPY public ./public
COPY src ./src
COPY index.html .
COPY vite.config.js .
COPY tailwind.config.js .
COPY postcss.config.js .
# .env 파일은 여기에 복사하지 않고, 아래 ENV 명령어를 통해 주입합니다.

# ARG로 받은 값들을 ENV로 설정하여 빌드 프로세스(vite)에서 사용 가능하도록 합니다.
ENV VITE_RAWG_API_KEY=$VITE_RAWG_API_KEY
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

# 프로덕션 빌드 실행
RUN npm run build

# --- Production Stage ---
# 2. Nginx를 사용하여 빌드된 정적 파일을 서비스합니다.
FROM nginx:stable-alpine

# 빌드 단계(builder)에서 생성된 /app/dist 폴더의 내용을
# Nginx의 기본 정적 파일 제공 위치로 복사합니다.
COPY --from=builder /app/dist /usr/share/nginx/html

# SPA 라우팅을 위한 Nginx 설정
RUN echo "server { \
        listen 80; \
        server_name localhost; \
        root /usr/share/nginx/html; \
        index index.html; \
        location / { \
            try_files \$uri \$uri/ /index.html; \
        } \
    }" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]