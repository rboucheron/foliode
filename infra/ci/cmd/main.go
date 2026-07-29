package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/rboucheron/foliode-ci/frontend"
	"github.com/rboucheron/foliode-ci/pipeline"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Minute)

	defer cancel()

	switch os.Args[1] {
	case "frontend:release":
		frontendPipeline := frontend.Release(ctx)
		pipeline.Execute(ctx, frontendPipeline)

	default:
		fmt.Printf("Commande inconnue : %s\n", os.Args[1])
	}
}
