FROM mcr.microsoft.com/mssql/server:2022-latest

ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=Pass@123
ENV MSSQL_PID=Express

USER root

RUN apt-get update && \
    apt-get install -y curl apt-transport-https gnupg2 unixodbc-dev && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y mssql-tools msodbcsql17 && \
    ln -s /opt/mssql-tools/bin/sqlcmd /usr/bin/sqlcmd && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Optional: create directories with proper permissions
RUN mkdir -p /var/opt/mssql/data /var/opt/mssql/log && \
    chown -R mssql:mssql /var/opt/mssql && \
    chmod -R 755 /var/opt/mssql

USER mssql

EXPOSE 1433

CMD ["/opt/mssql/bin/sqlservr"]
