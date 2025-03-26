from flask import Blueprint, request, jsonify
from models import db, User, GameState

game_routes = Blueprint("game", __name__)

@game_routes.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 400

    new_user = User(username=username)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully", "user_id": new_user.id})

@game_routes.route("/save", methods=["POST"])
def save_game():
    data = request.json
    user_id = data.get("user_id")
    bubbles = data.get("bubbles")
    score = data.get("score")

    game_state = GameState.query.filter_by(user_id=user_id).first()
    if game_state:
        game_state.bubbles = bubbles
        game_state.score = score
    else:
        game_state = GameState(user_id=user_id, bubbles=bubbles, score=score)
        db.session.add(game_state)

    db.session.commit()
    return jsonify({"message": "Game state saved"})
