### API GATEWAY FOR SELF-HOST OLLAMA

#### Server Requirements: usually 2 vCPU and 8GB of RAM

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
