build:
	env GOOS=linux go build -ldflags="-s -w" -o bin/figma figma/main.go

clean:
	rm -rf ./bin

deploy: clean build
	sls deploy --verbose --aws-profile diez-serverless --stage prod
