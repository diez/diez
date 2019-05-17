package main

import (
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/savaki/amplitude-go"

	"encoding/json"
	"os"
)

type response events.APIGatewayProxyResponse

type ping struct {
	UUID       string                 `json:"uuid"`
	EventType  string                 `json:"eventType"`
	Properties map[string]interface{} `json:"properties"`
}

func handler(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	event := new(ping)
	err := json.Unmarshal([]byte(req.Body), event)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
		}, err
	}

	client := amplitude.New(os.Getenv("AMPLITUDE_API_KEY"))
	client.Publish(amplitude.Event{
		DeviceId:        event.UUID,
		EventType:       event.EventType,
		EventProperties: event.Properties,
	})
	client.Flush()
	client.Close()
	return events.APIGatewayProxyResponse{
		StatusCode: 204,
	}, nil
}

func main() {
	lambda.Start(handler)
}
