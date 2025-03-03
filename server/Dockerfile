FROM python:3.11

WORKDIR /backend

COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . .
COPY .env .
ENV RUN_FROM_DOCKER="True"

EXPOSE 8000
CMD ["python", "launcher.py"]