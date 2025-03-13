# Бэкенд (Flask)
FROM python:3.11 AS backend
WORKDIR /app

# Устанавливаем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE 5000
CMD ["python", "wsgi.py"]
