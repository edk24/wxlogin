# 微信授权统一平台 - Docker 构建 Makefile

# 配置变量
DOCKER_USERNAME := edk24
IMAGE_NAME := wx-auth-server
VERSION ?= latest
PLATFORM := linux/amd64
FULL_IMAGE := $(DOCKER_USERNAME)/$(IMAGE_NAME)

# 颜色输出
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

.PHONY: help build push build-push clean login info test

# 默认目标
.DEFAULT_GOAL := help

## help: 显示帮助信息
help:
	@echo "$(BLUE)微信授权统一平台 - Docker 构建命令$(NC)"
	@echo ""
	@echo "$(GREEN)可用命令:$(NC)"
	@echo "  make build         - 构建 Docker 镜像（本地）"
	@echo "  make push          - 推送镜像到 Docker Hub"
	@echo "  make build-push    - 构建并推送镜像"
	@echo "  make login         - 登录 Docker Hub"
	@echo "  make clean         - 清理本地镜像"
	@echo "  make info          - 显示镜像信息"
	@echo "  make test          - 测试运行镜像"
	@echo ""
	@echo "$(YELLOW)参数:$(NC)"
	@echo "  VERSION=v1.0.0     - 指定版本号（默认: latest）"
	@echo ""
	@echo "$(YELLOW)示例:$(NC)"
	@echo "  make build VERSION=v1.0.0"
	@echo "  make build-push VERSION=v1.0.0"

## info: 显示当前配置信息
info:
	@echo "$(BLUE)当前配置:$(NC)"
	@echo "  用户名: $(DOCKER_USERNAME)"
	@echo "  镜像名: $(IMAGE_NAME)"
	@echo "  版本号: $(VERSION)"
	@echo "  平台: $(PLATFORM)"
	@echo "  完整镜像名: $(FULL_IMAGE):$(VERSION)"

## build: 构建 Docker 镜像（本地）
build:
	@echo "$(BLUE)>>> 检查 buildx...$(NC)"
	@docker buildx version || (echo "$(YELLOW)错误: docker buildx 不可用$(NC)" && exit 1)
	@echo "$(BLUE)>>> 准备 buildx builder...$(NC)"
	@docker buildx inspect multiplatform > /dev/null 2>&1 || docker buildx create --name multiplatform --use
	@docker buildx use multiplatform
	@echo "$(GREEN)>>> 构建镜像 $(FULL_IMAGE):$(VERSION)...$(NC)"
	docker buildx build \
		--platform $(PLATFORM) \
		--tag $(FULL_IMAGE):$(VERSION) \
		--tag $(FULL_IMAGE):latest \
		--load \
		.
	@echo "$(GREEN)✓ 构建完成！$(NC)"
	@docker images $(FULL_IMAGE):$(VERSION)

## login: 登录 Docker Hub
login:
	@echo "$(BLUE)>>> 登录 Docker Hub...$(NC)"
	docker login

## push: 推送镜像到 Docker Hub
push:
	@echo "$(BLUE)>>> 推送镜像 $(FULL_IMAGE):$(VERSION)...$(NC)"
	docker push $(FULL_IMAGE):$(VERSION)
	docker push $(FULL_IMAGE):latest
	@echo "$(GREEN)✓ 推送完成！$(NC)"
	@echo ""
	@echo "使用方法:"
	@echo "  docker pull $(FULL_IMAGE):$(VERSION)"

## build-push: 构建并推送镜像（一步完成）
build-push: login
	@echo "$(BLUE)>>> 检查 buildx...$(NC)"
	@docker buildx version || (echo "$(YELLOW)错误: docker buildx 不可用$(NC)" && exit 1)
	@echo "$(BLUE)>>> 准备 buildx builder...$(NC)"
	@docker buildx inspect multiplatform > /dev/null 2>&1 || docker buildx create --name multiplatform --use
	@docker buildx use multiplatform
	@echo "$(GREEN)>>> 构建并推送镜像 $(FULL_IMAGE):$(VERSION)...$(NC)"
	docker buildx build \
		--platform $(PLATFORM) \
		--tag $(FULL_IMAGE):$(VERSION) \
		--tag $(FULL_IMAGE):latest \
		--push \
		.
	@echo "$(GREEN)✓ 构建并推送完成！$(NC)"
	@echo ""
	@echo "镜像信息:"
	@echo "  - $(FULL_IMAGE):$(VERSION)"
	@echo "  - $(FULL_IMAGE):latest"
	@echo ""
	@echo "使用方法:"
	@echo "  docker pull $(FULL_IMAGE):$(VERSION)"

## clean: 清理本地镜像
clean:
	@echo "$(YELLOW)>>> 清理本地镜像...$(NC)"
	-docker rmi $(FULL_IMAGE):$(VERSION)
	-docker rmi $(FULL_IMAGE):latest
	@echo "$(GREEN)✓ 清理完成！$(NC)"

## test: 测试运行镜像
test:
	@echo "$(BLUE)>>> 测试运行镜像...$(NC)"
	@echo "请确保已配置环境变量文件 .env"
	docker run --rm \
		--env-file .env \
		-p 8080:80 \
		$(FULL_IMAGE):$(VERSION)
