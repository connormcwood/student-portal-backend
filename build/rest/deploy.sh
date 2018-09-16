docker build -t student-portal-rest -f build/rest/Dockerfile .

docker run -d -p 80:80 --name student-portal-service student-portal-rest

docker network connect student-net student-portal-service