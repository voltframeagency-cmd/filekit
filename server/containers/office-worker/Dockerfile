# Pinned Base Image & LibreOffice Engine
FROM alpine:3.20@sha256:777351696874e437b7004c1329b4720612a4339ed301540a83103212457814b7

# Install Headless LibreOffice and Font Manifest
RUN apk add --no-cache \
    libreoffice \
    ttf-dejavu \
    ttf-liberation \
    font-freefont \
    font-noto \
    bash

# Create non-root worker user
RUN addgroup -S filekit && adduser -S filekit -G filekit

# Secure permissions
USER filekit
WORKDIR /home/filekit

# Default conversion entrypoint
ENTRYPOINT ["libreoffice", "--headless", "--invisible", "--nodefault", "--nofirststartwizard", "--nolockcheck", "--nologo"]
