# Instal package dependencies
FROM node:16-alpine AS dependency

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=$GITHUB_TOKEN

WORKDIR /rolo

COPY package*.json ./
RUN npm ci

# Build source
FROM dependency AS base
COPY . .
