build:
	env GOOS=linux go build -ldflags="-s -w" -o bin/ping ping/main.go

clean:
	rm -rf ./bin

deploy-dev: clean build
	sls deploy --verbose --aws-profile diez-serverless --stage dev

deploy: clean build
	sls deploy --verbose --aws-profile diez-serverless --stage prod
