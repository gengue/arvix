# Arvix Deployment

This project is meant to be deploy as a monolitic application in a VPS such as hetzner or digital ocean and to run on a Ubuntu machine.

## Create the server and get access

- Recommended add you SSH keys first.

```
ssh root@your-server-ip
```

## Setting up the server

### Basics

These steps apply for both types of deployments (Docker or Manual).

1. [Firewall and users](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04)

2. [Install Caddy](https://caddyserver.com/docs/install#debian-ubuntu-raspbian)

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

3. Update Firewall rules

```bash
sudo ufw allow proto tcp from any to any port 80,443
```

4. Configure Caddy:

Copy the content of `deployment/Caddyfile` and paste it to `/etc/caddy/Caddyfile`.

```bash
sudo vim /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

5. `mkdir /home/genesis/arvix`

**Make sure the DNS are pointing to the server IP.**

### Docker

1. Following Steps 1 and 2 of [How To Install Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)

2. [Compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)

### Manual (Without Docker)

1. Install GO: `sudo snap install --classic go`

2. Configure the daemon: Copy the content of `deployment/arvix.service` and paste it to `/etc/systemd/system/arvix.service`

```bash
sudo vim /etc/systemd/system/arvix.service
sudo systemctl daemon-reload
sudo systemctl start arvix
```

3. (Optional) To avoid the password prompt, edit the sudoers file:

```bash
sudo EDITOR=vim visudo
# add the following line:
genesis ALL=(ALL) NOPASSWD: /bin/systemctl
```

## Checking status

```bash
sudo ufw status
sudo systemctl status caddy
# if docker deployment
sudo systemctl status docker
# if manual deployment
sudo systemctl status arvix
```

## Deployment

### Docker

First, set the production env vars to `.env` and `ui/.env`

```bash
ssh genesis@your-server-ip
# enter the server password... or setup ssh keys
cd arvix/
git pull origin main
docker-compose -f deployment/docker-compose.yml -d --build
```

### Manual

First, set the production env vars to `.env` and `ui/.env`

```bash
make deploy
# enter the server password... or setup ssh keys + edit sudoers file
```

### CI/CD Pipeline

To implement.
