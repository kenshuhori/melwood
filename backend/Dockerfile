FROM node:12
ENV SUPABASE_URL https://eibggpxrnmfzannzgtkj.supabase.co
ENV SUPABASE_KEY eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDIxNzYxNCwiZXhwIjoxOTQ1NzkzNjE0fQ.C41bBGN_y4RHlRVDwBjgzlZx7OtTer_PrirPw-hWzeQ
WORKDIR /app
COPY . /app/
RUN npm install
CMD [ "npm", "run", "start" ]
