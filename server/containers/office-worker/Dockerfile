FROM alpine:3.20

# Install Headless LibreOffice, Fonts, Node.js and Bash
RUN apk add --no-cache \
    libreoffice \
    ttf-dejavu \
    ttf-liberation \
    font-freefont \
    font-noto \
    nodejs \
    bash

# Create non-root worker user
RUN addgroup -S filekit && adduser -S filekit -G filekit

WORKDIR /home/filekit

# Copy container HTTP bridge server
COPY server.js /home/filekit/server.js

RUN chown -R filekit:filekit /home/filekit

USER filekit

EXPOSE 8080

# Default entrypoint starts the conversion HTTP bridge
ENTRYPOINT ["node", "server.js"]
