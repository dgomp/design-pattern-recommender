from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pattern_recommender import PatternRecommender
import os

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

recommender = PatternRecommender()

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        if not data or 'useCase' not in data:
            return jsonify({'error': 'Caso de uso não fornecido'}), 400
        use_case = data['useCase']
        recommendation = recommender.analyze_use_case(use_case)
        return jsonify(recommendation)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True) 