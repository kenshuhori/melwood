FROM node:12
ENV SUPABASE_URL $SUPABASE_URL
ENV SUPABASE_KEY $SUPABASE_KEY
WORKDIR /app
COPY . /app/
RUN npm install
CMD [ "npm", "run", "start" ]
