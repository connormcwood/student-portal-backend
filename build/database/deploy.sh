docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker rmi $(docker images -q)
docker volume prune --force

docker network rm student-net
docker network create --driver bridge student-net

docker pull mongo:4.1.2

docker build -t mongo:4.1.2

docker run -d -p 1989:1990 --name student-db -e MONGODB_USER="user" -e MONGODB_DATABASE="student_db" -e MONGODB_PASS="password" mongo:4.1.2
docker network connect student-net student-db