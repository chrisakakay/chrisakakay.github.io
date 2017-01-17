# NodeJS hosting

This will be a quick memo for me. How to host node app on linux with nginx (ex: digitalocean).

### Install node

Build-essential is needed for some npm package (for recompiling).
PM2 will be the runner for the app.

``` bash
sudo apt-get install nginx
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
sudo npm install -g pm2
```

### Project setup

``` bash
git clone https://github.com/ACCOUNT/PROJECT
npm install
pm2 start index.js
pm2 startup systemd
```

### Nginx setup

Open a new configuration file

``` bash
sudo vim /etc/nginx/sites-available/our-project
```

Add:
``` bash
server {
    listen 80;

    server_name example.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the new configuration

``` bash
sudo ln -s /etc/nginx/sites-available/our-project /etc/nginx/sites-enabled/our-project
```

Restart nginx

``` bash
service nginx restart
```

Thats all for a simple setup.
