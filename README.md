### GATEWAY FOR SELF-HOST OLLAMA

## Purpose:
* Mostly to tinker with **self-host** option and Ollama doesn't expose the end directly so a solution is to rely on a gateway server
* Nginx reverse proxy **doesn't work** directly on Ollama also for some reason

## TODO:
* Maybe turn into GO server or something else less generic than NodeJS
* Logging and telemetry stuff
* Add db connection to store all chat section
  
## Notes:
* Server Requirements: usually 2 vCPU and 8GB of RAM
* Mind **https** config when deployed on the cloud

#### NGINX Setting

```
server {
    listen 80;

    server_name domain.com;  # Replace with your domain or use _ for all requests

    location / {
        proxy_pass http://localhost:3000;  # Forward requests to Express
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
