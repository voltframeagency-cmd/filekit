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

# Pre-seed read-only secure LibreOffice profile template
# MacroSecurityLevel=3 (Very High), DisableMacrosExecution=true,
# SecureURL=empty (zero trusted locations), ExecutePlugins=false
RUN mkdir -p /home/filekit/soffice_profile_template/user && \
    printf '<?xml version="1.0" encoding="UTF-8"?>\n\
<oor:items xmlns:oor="http://openoffice.org/2001/registry" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n\
  <item oor:path="/org.openoffice.Office.Common/Security/Scripting"><prop oor:name="MacroSecurityLevel" oor:type="xs:int"><value>3</value></prop></item>\n\
  <item oor:path="/org.openoffice.Office.Common/Security/Scripting"><prop oor:name="DisableMacrosExecution" oor:type="xs:boolean"><value>true</value></prop></item>\n\
  <item oor:path="/org.openoffice.Office.Common/Security/Scripting"><prop oor:name="SecureURL" oor:type="oor:string-list"><value/></prop></item>\n\
  <item oor:path="/org.openoffice.Office.Common/Security/Scripting"><prop oor:name="ExecutePlugins" oor:type="xs:boolean"><value>false</value></prop></item>\n\
</oor:items>' > /home/filekit/soffice_profile_template/user/registrymodifications.xcu

RUN chown -R filekit:filekit /home/filekit

USER filekit

EXPOSE 8080

# Default entrypoint starts the conversion HTTP bridge
ENTRYPOINT ["node", "server.js"]
