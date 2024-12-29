from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
import os

app = Flask(__name__)

# Path where the video will be temporarily saved
VIDEO_PATH = os.path.join('static', 'generated_video.mp4')

@app.route('/')
def index():
    return render_template('index.html')  # Serving index.html from /templates

@app.route('/video')
def video():
    return render_template('video.html')  # Serving video.html from /templates

@app.route('/create-video', methods=['POST'])
def create_video():
    try:
        data = request.get_json()
        locations = data.get('locations', [])
        print(locations)
        if len(locations) < 2:
            return jsonify({"error": "Need at least two locations"}), 400

        # Mock video creation logic
        # In a real application, you would generate the video here
        with open(VIDEO_PATH, 'wb') as f:
            f.write(b'Mock video content')

        return jsonify({"success": True, "message": "Video created successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/download-video')
def download_video():
    try:
        if os.path.exists(VIDEO_PATH):
            return send_from_directory(
                os.path.dirname(VIDEO_PATH),
                os.path.basename(VIDEO_PATH),
                as_attachment=True,
                download_name='travel_wrapped.mp4'
            )
        else:
            return jsonify({"error": "Video not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

# Error handlers
@app.errorhandler(404)
def page_not_found(e):
    return jsonify({"error": "Page not found"}), 404

@app.errorhandler(500)
def internal_server_error(e):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    # Create static directory if it doesn't exist
    os.makedirs('static', exist_ok=True)
    
    # Enable debug mode for development
    app.run(debug=True)
