# Honeycomb Tracing and Logs Demo

## Compiling Honeytail for Nginx proxy logs
### Step 1
Clone the honeytail repository.
`git@github.com:honeycombio/honeytail.git`

### Step 2
Edit the following variables in the Dockerfile
```
ENV HONEYCOMB_WRITE_KEY YOUR_KEY_HERE
ENV NGINX_CONF /tmp/nginx.conf
ENV NGINX_ACCESS_LOG_FILENAME /tmp/access.log
```

### Step 3
Edit the `CMD` with the following.
```
--file $NGINX_ACCESS_LOG_FILENAME \
--dataset YOUR_DATASET_HERE
```

### Step 4
Build honeytail.
`docker build -t honeytail .`

# Running Express Demo
### Step 1
Install depenendencies. 
`npm install`

### Step 2
Copy the .env.sample file to .env and fill it out.
`cp .env.sample .env`

### Step 3
Run the docker compose file.
`make up`

### Step 4
Since there is only one endpoint you can hit it by navigating to `http://localhost`

# Start Load Testing
### Step 1
Run the load script and define how many rps you want.
`./load.sh 5`



