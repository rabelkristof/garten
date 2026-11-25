FROM postgres:19

RUN apt-get update && apt-get -y install postgresql-19-cron
COPY "./postgresql.conf" "/etc/postgresql/postgresql.conf"