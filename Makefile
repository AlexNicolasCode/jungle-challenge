start:
	sudo docker compose up -d
	sudo docker ps

reup:
	sudo docker compose down
	sudo docker compose up -d --build
	sudo docker ps

ps:
	sudo docker ps
