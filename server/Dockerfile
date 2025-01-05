FROM python:3.11

WORKDIR /backend
ENV FLASK_APP=launcher.py
ENV FLASK_RUN_HOST=0.0.0.0

COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY . .
COPY .env .

EXPOSE 8000
CMD ["python", "launcher.py"]