from flask_socketio import emit, join_room, leave_room
from models import db, GameState
from app import socketio

# Store active players in a dictionary
active_players = {}

@socketio.on("connect")
def handle_connect():
    print("A user connected!")

@socketio.on("disconnect")
def handle_disconnect():
    print("A user disconnected!")

@socketio.on("join_game")
def handle_join_game(data):
    """ User joins the game and room """
    user_id = data["user_id"]
    room = f"game_{user_id}"
    join_room(room)
    active_players[user_id] = room
    emit("player_joined", {"message": f"User {user_id} joined the game"}, room=room)

@socketio.on("update_score")
def handle_update_score(data):
    """ Updates player's score in real time """
    user_id = data["user_id"]
    new_score = data["score"]

    # Update the database
    game_state = GameState.query.filter_by(user_id=user_id).first()
    if game_state:
        game_state.score = new_score
        db.session.commit()

    # Broadcast score update
    emit("score_updated", {"user_id": user_id, "score": new_score}, broadcast=True)

@socketio.on("bomb_triggered")
def handle_bomb_triggered(data):
    """ When a bomb is used, notify all players """
    user_id = data["user_id"]
    color = data["color"]  # Color of bubbles to destroy
    emit("bomb_activated", {"user_id": user_id, "color": color}, broadcast=True)
