package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

var errorLogger = log.New(os.Stderr, "ERROR ", log.Llongfile)

func errorResponse(err error) events.APIGatewayProxyResponse {
	if err != nil {
		errorLogger.Println(err.Error())
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusInternalServerError,
		Body:       http.StatusText(http.StatusInternalServerError),
	}
}

func handler(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	queryString := url.Values{}
	queryString.Set("client_id", os.Getenv("CLIENT_ID"))
	queryString.Set("client_secret", os.Getenv("CLIENT_SECRET"))
	queryString.Set("code", req.QueryStringParameters["code"])
	queryString.Set("redirect_uri", req.QueryStringParameters["redirect_uri"])
	queryString.Set("grant_type", "authorization_code")
	tokenExchangeURL := fmt.Sprintf("%s?%s", os.Getenv("TOKEN_EXCHANGE_ENDPOINT"), queryString.Encode())
	response, err := http.Post(tokenExchangeURL, "application/json", bytes.NewBuffer([]byte{}))
	if err != nil || response.StatusCode != http.StatusOK {
		return errorResponse(err), nil
	}

	responseBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return errorResponse(err), nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       string(responseBody),
		Headers: map[string]string{
			"Content-Type": response.Header.Get("Content-Type"),
		},
	}, nil
}

func main() {
	lambda.Start(handler)
}
