from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import logging

app = Flask(__name__)
CORS(app)  # Разрешить все источники

# Настройка логирования
logging.basicConfig(level=logging.INFO)

def generate_random_coordinates(num):
    coordinates = []
    for _ in range(num):
        lat = round(random.uniform(55.5, 55.9), 6)
        lon = round(random.uniform(37.5, 37.9), 6)
        coordinates.append({"lat": lat, "lon": lon})
    return coordinates

def ml_model_predict(data):
    # Здесь должен быть код для вызова вашей ML модели
    # Это пример возвращаемых данных
    return {
        "prediction": "Пример предсказания",
        "confidence": 0.95
    }

@app.route('/api/advertisment/coordinate', methods=['POST'])
def get_coordinates():
    data = request.get_json()
    
    # Логирование полученных данных
    app.logger.info("Полученные данные: %s", data)
    
    billboards = data.get('billboards')
    
    if not billboards:
        return jsonify({"error": "Field 'billboards' is required"}), 400
    
    gender = data.get('gender', [])
    income = data.get('income', "unknown")
    ageGroup = data.get('ageGroup', "unknown")
    district = data.get('district', [])
    area = data.get('area', [])
    
    # Данные для ML модели
    ml_data = {
        "billboards": billboards,
        "gender": gender,
        "income": income,
        "ageGroup": ageGroup,
        "district": district,
        "area": area
    }
    
    # Вызов ML модели и получение предсказаний
    ml_result = ml_model_predict(ml_data)
    
    # Генерация случайных координат на основе количества билбордов
    coordinates = generate_random_coordinates(billboards)
    
    response_data = {
        "coordinates": coordinates,
        "ml_result": ml_result
    }
    
    return jsonify(response_data), 200

if __name__ == '__main__':
    app.run(debug=True, port=4000)
