FROM node:12
ENV SUPABASE_URL $supabase_url
ENV SUPABASE_KEY $supabase_key
WORKDIR /app
COPY . /app/
RUN npm install
CMD [ "npm", "run", "start" ]
