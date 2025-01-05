FROM python:3.11

WORKDIR /backend
ENV FLASK_APP=launcher.py
ENV FLASK_RUN_HOST=0.0.0.0

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8000

COPY . .
COPY .env .

CMD ["python", "launcher.py"]