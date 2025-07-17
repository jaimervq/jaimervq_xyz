FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

COPY gallery_list.sh /gallery_list.sh
RUN chmod +x /gallery_list.sh
RUN /gallery_list.sh

RUN npm run build
CMD ["npm", "start"]
