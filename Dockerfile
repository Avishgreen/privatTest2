FROM python:3.11

WORKDIR /data

ENV PYTHONUNBUFFERED=1
ENV WEBUI_URL=https://0.0.0.0:3000
ENV ENABLE_OLLAMA_API=False

RUN pip install -U open-webui
# При необходимости - установка ffmpeg:
RUN apt-get update && apt-get install -y ffmpeg

COPY . /data

CMD ["open-webui", "serve"]
