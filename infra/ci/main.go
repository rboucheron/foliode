package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

type Step struct {
	Name string
	Run  func(context.Context) error
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Minute)

	defer cancel()

	pipeline := []Step{
		{
			Name: "install frontend dependencies",
			Run: func(ctx context.Context) error {
				return run(ctx, "../frontend", "bun", "install")
			},
		},
		{
			Name: "test frontend with bun",
			Run: func(ctx context.Context) error {
				return run(ctx, "../frontend", "bun", "test")
			},
		},
		{
			Name: "Build Next.js",
			Run: func(ctx context.Context) error {
				return run(ctx, "../frontend/website", "bun", "run", "build")
			},
		},
		{
			Name: "create release folder",
			Run: func(ctx context.Context) error {
				return createRelease()
			},
		},
		{
			Name: "copy frontend to release folder",
			Run: func(ctx context.Context) error {
				return copyDir("../frontend/website/.next", "../release/frontend")
			},
		},
	}

	for _, step := range pipeline {

		fmt.Printf("\n %s\n", step.Name)

		start := time.Now()

		if err := step.Run(ctx); err != nil {
			log.Fatalf(" %s\n%v", step.Name, err)
		}

		fmt.Printf(" %.2fs\n", time.Since(start).Seconds())
	}
	fmt.Printf("\n Pipeline completed successfully!\n")
}

func run(ctx context.Context, dir string, command string, args ...string) error {

	cmd := exec.CommandContext(ctx, command, args...)
	cmd.Dir = dir

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin

	return cmd.Run()
}

func createRelease() error {

	os.RemoveAll("../release")

	return os.MkdirAll("../release/frontend", 0755)
}

func copyDir(src, dst string) error {

	return filepath.Walk(src, func(path string, info os.FileInfo, err error) error {

		if err != nil {
			return err
		}

		relative, _ := filepath.Rel(src, path)

		target := filepath.Join(dst, relative)

		if info.IsDir() {
			return os.MkdirAll(target, info.Mode())
		}

		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}

		return os.WriteFile(target, data, info.Mode())
	})
}
