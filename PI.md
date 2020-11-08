Follow method 2 here: 
https://medium.com/@maheshsenni/setting-up-a-raspberry-pi-without-keyboard-and-mouse-headless-9359e0926807

Then
Follow this, use 3.x.x couch version
https://andyfelong.com/2019/07/couchdb-2-1-on-raspberry-pi-raspbian-stretch/

Install ndoe follow this: 
https://linuxize.com/post/how-to-install-node-js-on-raspberry-pi/

Install nginx follow this
https://pimylifeup.com/raspberry-pi-nginx/


Install yarn

Should be https://smokeandice.net/2018/01/16/installing-node-js-on-your-raspberry-pi/

tricker than it seems

Install BEFORE node, then node comes with it.

Installing Node. js on your Raspberry Pi
sudo apt-get update && sudo apt-get install yarn.
Run yarn -v to verify (Version 1.3. 2 as of today)
Jan 16, 2018

Installing Node.js on your Raspberry Pi – Smoke and Ice

~~
To make restart, follow method 1 here: 

https://www.dexterindustries.com/howto/run-a-program-on-your-raspberry-pi-at-startup/
~~

OMG OMG OMG don't forget this value
https://unix.stackexchange.com/a/604213
https://serverfault.com/a/1031113
`StandardInput=tty-force`

Ref these two docs: 
https://computingforgeeks.com/how-to-install-couchdb-on-debian/
https://www.raspberrypi.org/documentation/linux/usage/systemd.md

For couch, 

take the comamnd
sudo -i -u couchdb /home/couchdb/bin/couchdb

and put it into their service command
/home/couchdb/bin/couchdb -o /dev/stdout -e /dev/stderr

edit admin username / password and cors setting
sudo vi /home/couchdb/etc/local.ini

```
add-cors-to-couchdb -u admin -p password
sudo npm install -g add-cors-to-couchdb
```


For docker, follow
https://withblue.ink/2020/06/24/docker-and-docker-compose-on-raspberry-pi-os.html

Need to install Linux x64 headless to get this working properly
maybe desktop to make sure there's a monitor capability?
 



```
sudo vi /etc/systemd/system/gmg.service
pi@raspberrypi:~/sites $ sudo systemctl daemon-reload

```


ssh follow steps here

https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account


```
[Unit]
Description=Backend service
After=network.target

[Service]
Type=oneshot
User=pi
ExecStart=git --git-dir=/home/pi/sites/gmg-js/.git pull
WorkingDirectory=/home/pi/sites/gmg-js

[Install]
WantedBy=multi-user.target
```

