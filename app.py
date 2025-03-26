from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_cors import CORS
from gevent import monkey

# Patch all for gevent
monkey.patch_all()

app = Flask(__name__)
CORS(app)

# Configure SocketIO to use gevent
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="gevent")

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print("Client connected!")

@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected!")

@app.route('/error')
def error():
    1 / 0  # This will cause a division by zero error


if __name__ == '__main__':
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)
